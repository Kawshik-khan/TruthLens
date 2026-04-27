import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify admin authentication
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { id } = await params;

        // Check if source exists
        const existingSource = await (db as any).source.findUnique({
            where: { id }
        });

        if (!existingSource) {
            return NextResponse.json(
                { error: "Source not found" },
                { status: 404 }
            );
        }

        // Check if source is being used in submissions
        const submissionCount = await db.submission.count({
            where: {
                url: {
                    contains: existingSource.domain
                }
            }
        });

        if (submissionCount > 0) {
            return NextResponse.json(
                { 
                    error: "Cannot delete source - it is referenced in submissions",
                    submissionCount 
                },
                { status: 409 }
            );
        }

        // Delete bias history first (due to foreign key constraint)
        await (db as any).biasHistory.deleteMany({
            where: { sourceId: id }
        });

        // Delete source
        await (db as any).source.delete({
            where: { id }
        });

        return NextResponse.json(
            { 
                message: "Source deleted successfully",
                sourceName: existingSource.name,
                domain: existingSource.domain
            }
        );
    } catch (error) {
        console.error("Source deletion error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
