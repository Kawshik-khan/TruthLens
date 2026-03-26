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

        const { url, title } = await req.json();

        if (!url || !title) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Trigger real verification
        const verification = await verifyNews(url, title);

        const submission = await db.submission.create({
            data: {
                url,
                title,
                trustScore: verification.accuracy,
                status: verification.status,
                citations: JSON.stringify(verification.citations),
                userId,
            },
        });

        return NextResponse.json(submission, { status: 201 });
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
