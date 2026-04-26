import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q")?.toLowerCase() || "";
        const category = searchParams.get("category") || "";
        const tier = searchParams.get("tier") || "";
        const region = searchParams.get("region") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const sortBy = searchParams.get("sort") || "name";
        const sortOrder = searchParams.get("order") || "asc";

        // Build where clause
        const where: any = {};

        if (query) {
            where.OR = [
                { domain: { contains: query } },
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } }
            ];
        }

        if (category) {
            where.category = category;
        }

        if (tier) {
            where.tier = tier;
        }

        if (region) {
            where.region = region;
        }

        // Build order clause
        const orderBy: any = {};
        const validSortFields = ["name", "domain", "biasIndex", "credibilityScore", "lastUpdated", "category"];
        const sortField = validSortFields.includes(sortBy) ? sortBy : "name";
        orderBy[sortField] = sortOrder;

        // Execute query with pagination
        const [sources, total] = await Promise.all([
            db.source.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    biasHistory: {
                        take: 5,
                        orderBy: { auditDate: "desc" }
                    }
                }
            }),
            db.source.count({ where })
        ]);

        // Calculate pagination info
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return NextResponse.json({
            sources,
            pagination: {
                currentPage: page,
                totalPages,
                totalSources: total,
                hasNext,
                hasPrev,
                limit
            },
            filters: {
                query,
                category,
                tier,
                region,
                sortBy,
                sortOrder
            }
        });
    } catch (error) {
        console.error("Source search error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
