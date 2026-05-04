import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { verifyNews } from "@/lib/verify";
import { db } from "@/lib/db";
import { createAnalysisNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        if (!authResult.user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        const userId = authResult.user.id;

        const { content, title, url } = await req.json();

        if (!content) {
            return NextResponse.json(
                { error: "Please provide text content to verify" },
                { status: 400 }
            );
        }

        // Auto-generate title from the first ~60 chars of content if not provided
        const submissionTitle = title || content.slice(0, 60) + (content.length > 60 ? "..." : "");

        // Trigger verification using the claim text
        const verification = await verifyNews(content, submissionTitle);

        // Create submission in database
        const submission = await (db as any).submission.create({
            data: {
                title: submissionTitle,
                content,
                url: url || null,
                trustScore: verification.accuracy || 0,
                status: verification.status || "PENDING",
                citations: verification.citations ? JSON.stringify(verification.citations) : null,
                userId,
            },
        });

        // Create notification for user (non-blocking)
        createAnalysisNotification(userId, submissionTitle, verification.accuracy || 0)
            .catch(err => console.error('Failed to create notification:', err));

        // Return submission data along with AI analysis
        return NextResponse.json({
            ...submission,
            citations: verification.citations || [],
            aiAnalysis: verification.aiAnalysis,
        }, { status: 201 });
    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const authResult = await requireAuth(req);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        if (!authResult.user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        const userId = authResult.user.id;

        // Fetch user's submissions from database
        const submissions = await (db as any).submission.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        // Parse citations JSON for each submission
        const formattedSubmissions = submissions.map((sub: any) => ({
            ...sub,
            citations: sub.citations ? JSON.parse(sub.citations) : [],
        }));

        return NextResponse.json(formattedSubmissions);
    } catch (error) {
        console.error("Fetch submissions error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
