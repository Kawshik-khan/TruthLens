import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

        const { text, submissionId, max_length, min_length } = await req.json();

        if (!text || text.trim().length < 50) {
            return NextResponse.json(
                { error: "Text must be at least 50 characters for summarization" },
                { status: 400 }
            );
        }

        const aiResponse = await fetch(`${AI_SERVICE_URL}/summarize`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text,
                max_length: max_length || 200,
                min_length: min_length || 50,
            }),
        });

        if (!aiResponse.ok) {
            return NextResponse.json(
                { error: "AI service unavailable" },
                { status: 502 }
            );
        }

        const result = await aiResponse.json();

        if (submissionId) {
            await db.aIAnalysis.create({
                data: {
                    submissionId,
                    type: "SUMMARY",
                    result: JSON.stringify(result),
                    confidence: result.compression_ratio,
                    modelUsed: "facebook/bart-large-cnn",
                    processingTime: result.processing_time_ms,
                },
            });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Summarization error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
