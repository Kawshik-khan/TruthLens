import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

async function checkAdmin() {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload.role === "ADMIN" ? payload : null;
    } catch {
        return null;
    }
}

export async function GET() {
    if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const sources = await db.source.findMany({
            orderBy: { name: "asc" },
        });
        return NextResponse.json(sources);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { domain, name, tier, biasIndex } = await req.json();
        const source = await (db as any).source.create({
            data: {
                domain,
                name,
                tier,
                biasIndex: parseFloat(biasIndex) || 0,
                category: "NEWS", // Add required category field
                auditDate: new Date(),
                auditor: "System Admin",
            },
        });
        return NextResponse.json(source);
    } catch (error) {
        console.error("Source creation error:", error);
        return NextResponse.json({ error: "Error creating source" }, { status: 500 });
    }
}
