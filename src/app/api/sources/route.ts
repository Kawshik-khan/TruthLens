import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const sources = await db.source.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json(sources);
    } catch (error) {
        console.error("Sources fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
