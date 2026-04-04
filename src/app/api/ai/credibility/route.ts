import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await jwtVerify(token, secret);

        const { domain } = await req.json();

        if (!domain || domain.trim().length < 3) {
            return NextResponse.json(
                { error: "Please provide a valid domain" },
                { status: 400 }
            );
        }

        const aiResponse = await fetch(`${AI_SERVICE_URL}/credibility`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain }),
        });

        if (!aiResponse.ok) {
            return NextResponse.json(
                { error: "AI service unavailable" },
                { status: 502 }
            );
        }

        const result = await aiResponse.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Credibility check error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
