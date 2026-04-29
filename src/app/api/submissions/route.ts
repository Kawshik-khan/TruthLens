import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { verifyNews } from "@/lib/verify";

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

        // For now, return mock data since we don't have the database connection
        // In production, you would:
        // const submission = await db.submission.create({
        //     data: {
        //         title: submissionTitle,
        //         content,
        //         url,
        //         trustScore: analysis.trustScore,
        //         status: analysis.status,
        //         citations: analysis.citations || [],
        //         userId,
        //     },
        // });

        const submission = {
            id: Date.now().toString(),
            title: submissionTitle,
            content,
            url,
            trustScore: verification.accuracy,
            status: verification.status,
            citations: verification.citations || [],
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Return submission data along with AI analysis
        return NextResponse.json({
            ...submission,
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

        // For now, return mock data since we don't have the database connection
        // In production, you would:
        // const submissions = await db.submission.findMany({
        //     where: { userId },
        //     orderBy: { createdAt: "desc" },
        // });

        const mockSubmissions = [
            {
                id: "1",
                title: "Climate Change Analysis",
                content: "Analysis of recent climate change data and trends...",
                url: "https://example.com/climate-article",
                trustScore: 85,
                status: "VERIFIED",
                citations: ["Source 1", "Source 2"],
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                updatedAt: new Date().toISOString(),
                userId: userId
            },
            {
                id: "2", 
                title: "Political News Verification",
                content: "Verification of recent political news claims...",
                url: "https://example.com/political-article",
                trustScore: 72,
                status: "RELIABLE",
                citations: ["Source 3"],
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
                updatedAt: new Date().toISOString(),
                userId: userId
            }
        ];

        return NextResponse.json(mockSubmissions);
    } catch (error) {
        console.error("Fetch submissions error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
