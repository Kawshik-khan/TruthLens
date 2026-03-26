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

        // 1. Total Searches
        const totalSearches = await db.submission.count();

        // 2. Top Searchers
        const topSearchers = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                _count: {
                    select: { submissions: true }
                }
            },
            take: 10,
            orderBy: {
                submissions: {
                    _count: 'desc'
                }
            }
        });

        // 3. Trending Topics
        const allSubmissions = await db.submission.findMany({
            select: { title: true }
        });

        const topicCounts: Record<string, number> = {};
        allSubmissions.forEach(s => {
            const title = s.title || "Unknown Topic";
            topicCounts[title] = (topicCounts[title] || 0) + 1;
        });

        const topTopics = Object.entries(topicCounts)
            .map(([title, count]) => ({ title, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return NextResponse.json({
            totalSearches,
            topSearchers: topSearchers.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                searchCount: u._count.submissions
            })),
            topTopics
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
