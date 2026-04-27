import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { BiasScoringAlgorithm } from "@/lib/biasScoring";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function POST(request: Request) {
    try {
        // Verify admin authentication
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const body = await request.json();
        const { domain, name, tier, biasIndex, category, region, description } = body;

        // Validate required fields
        if (!domain || !name || !tier || biasIndex === undefined) {
            return NextResponse.json(
                { error: "Missing required fields: domain, name, tier, biasIndex" },
                { status: 400 }
            );
        }

        // Validate tier values
        const validTiers = ["TRUSTED", "QUESTIONABLE", "DISINFO"];
        if (!validTiers.includes(tier)) {
            return NextResponse.json(
                { error: "Invalid tier. Must be: TRUSTED, QUESTIONABLE, DISINFO" },
                { status: 400 }
            );
        }

        // Validate bias index range
        if (biasIndex < 0 || biasIndex > 100) {
            return NextResponse.json(
                { error: "Bias index must be between 0 and 100" },
                { status: 400 }
            );
        }

        // Check for duplicate domain
        const existingSource = await db.source.findUnique({
            where: { domain: domain.toLowerCase() }
        });

        if (existingSource) {
            return NextResponse.json(
                { error: "Source with this domain already exists" },
                { status: 409 }
            );
        }

        // Calculate proper credibility score using the algorithm
        const metrics = {
            submissionCount: 0,
            averageTrustScore: 0,
            userReports: 0,
            ageInDays: 0,
            lastUpdated: new Date()
        };
        
        const credibilityScore = BiasScoringAlgorithm.calculateCredibilityScore(biasIndex, metrics);

        // Create new source
        const source = await (db as any).source.create({
            data: {
                domain: domain.toLowerCase(),
                name,
                tier,
                biasIndex,
                category: category || "NEWS",
                region,
                description,
                credibilityScore, // Use calculated credibility score
                auditor: payload.email || "system"
            }
        });

        // Create initial bias history entry
        await (db as any).biasHistory.create({
            data: {
                sourceId: source.id,
                biasIndex,
                tier,
                auditor: payload.email || "system",
                reason: "Initial source creation"
            }
        });

        return NextResponse.json(source, { status: 201 });
    } catch (error) {
        console.error("Source creation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
