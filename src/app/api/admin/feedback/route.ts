import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function GET() {
    try {
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const feedback = await db.feedback.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(feedback);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
