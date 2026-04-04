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

        const { text, submissionId } = await req.json();

        if (!text || text.trim().length < 5) {
            return NextResponse.json(
                { error: "Text must be at least 5 characters" },
                { status: 400 }
            );
        }

        const aiResponse = await fetch(`${AI_SERVICE_URL}/sentiment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
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
                    type: "SENTIMENT",
                    result: JSON.stringify(result),
                    confidence: result.confidence,
                    modelUsed: "distilbert-base-uncased-finetuned-sst-2-english",
                    processingTime: result.processing_time_ms,
                },
            });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Sentiment analysis error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
