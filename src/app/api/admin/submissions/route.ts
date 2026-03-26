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

        const submissions = await db.submission.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(submissions);
    } catch (error) {
        console.error("Admin submissions error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
