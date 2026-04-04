import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

import { verifyNews } from "@/lib/verify";

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

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

        // Postgres strictly rejects null bytes (\u0000) inside of TEXT fields. 
        // We must sanitize user content and API JSON strings before saving.
        const sanitize = (str: string) => str ? str.replace(/\0/g, '') : '';
        const cleanContent = sanitize(content);
        const cleanTitle = sanitize(submissionTitle);
        const cleanCitations = sanitize(JSON.stringify(verification.citations));

        const submission = await db.submission.create({
            data: {
                content: cleanContent,
                url: url || null,
                title: cleanTitle,
                trustScore: verification.accuracy,
                status: verification.status,
                citations: cleanCitations,
                userId,
            },
        });

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

export async function GET(req: Request) {
    try {
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

        const submissions = await db.submission.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(submissions);
    } catch (error) {
        console.error("Fetch submissions error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
