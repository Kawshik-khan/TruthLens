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

        const { message, context, history } = await req.json();

        if (!message || message.trim().length < 2) {
            return NextResponse.json(
                { error: "Message must not be empty" },
                { status: 400 }
            );
        }

        const aiResponse = await fetch(`${AI_SERVICE_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, context, history }),
        });

        if (!aiResponse.ok) {
            return NextResponse.json(
                { error: "AI service unavailable" },
                { status: 502 }
            );
        }

        const result = await aiResponse.json();

        // Store chat messages
        await db.chatMessage.createMany({
            data: [
                {
                    userId,
                    role: "USER",
                    content: message,
                    context: context || null,
                },
                {
                    userId,
                    role: "ASSISTANT",
                    content: result.reply,
                    context: context || null,
                },
            ],
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Chat error:", error);
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

        const messages = await db.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: "asc" },
            take: 50,
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Chat history error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
