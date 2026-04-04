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

        if (!text || text.trim().length < 10) {
            return NextResponse.json(
                { error: "Text must be at least 10 characters" },
                { status: 400 }
            );
        }

        // Forward to FastAPI
        const aiResponse = await fetch(`${AI_SERVICE_URL}/fake-news`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        if (!aiResponse.ok) {
            const errText = await aiResponse.text();
            console.error("AI Service error:", errText);
            return NextResponse.json(
                { error: "AI service unavailable" },
                { status: 502 }
            );
        }

        const result = await aiResponse.json();

        // Store result in database if submissionId provided
        if (submissionId) {
            await db.aIAnalysis.create({
                data: {
                    submissionId,
                    type: "FAKE_NEWS",
                    result: JSON.stringify(result),
                    confidence: result.confidence,
                    modelUsed: "facebook/bart-large-mnli",
                    processingTime: result.processing_time_ms,
                },
            });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Fake news analysis error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
