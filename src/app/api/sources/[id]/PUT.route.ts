import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Verify admin authentication
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const body = await request.json();
        const { domain, name, tier, biasIndex, category, region, description } = body;

        // Check if source exists
        const existingSource = await db.source.findUnique({
            where: { id: params.id }
        });

        if (!existingSource) {
            return NextResponse.json(
                { error: "Source not found" },
                { status: 404 }
            );
        }

        // Check for domain conflict if domain is being changed
        if (domain && domain !== existingSource.domain) {
            const domainConflict = await db.source.findUnique({
                where: { domain: domain.toLowerCase() }
            });

            if (domainConflict) {
                return NextResponse.json(
                    { error: "Source with this domain already exists" },
                    { status: 409 }
                );
            }
        }

        // Validate tier values if provided
        if (tier) {
            const validTiers = ["TRUSTED", "QUESTIONABLE", "DISINFO"];
            if (!validTiers.includes(tier)) {
                return NextResponse.json(
                    { error: "Invalid tier. Must be: TRUSTED, QUESTIONABLE, DISINFO" },
                    { status: 400 }
                );
            }
        }

        // Validate bias index if provided
        if (biasIndex !== undefined && (biasIndex < 0 || biasIndex > 100)) {
            return NextResponse.json(
                { error: "Bias index must be between 0 and 100" },
                { status: 400 }
            );
        }

        // Prepare update data
        const updateData: any = {
            updatedAt: new Date()
        };

        if (domain) updateData.domain = domain.toLowerCase();
        if (name) updateData.name = name;
        if (tier) updateData.tier = tier;
        if (biasIndex !== undefined) {
            updateData.biasIndex = biasIndex;
            updateData.credibilityScore = biasIndex;
        }
        if (category) updateData.category = category;
        if (region) updateData.region = region;
        if (description !== undefined) updateData.description = description;

        // Update source
        const updatedSource = await (db as any).source.update({
            where: { id: params.id },
            data: updateData
        });

        // Create bias history entry if bias or tier changed
        if (biasIndex !== undefined && biasIndex !== existingSource.biasIndex) {
            await (db as any).biasHistory.create({
                data: {
                    sourceId: params.id,
                    biasIndex,
                    tier: tier || existingSource.tier,
                    auditor: payload.email || "system",
                    reason: "Manual update via admin interface"
                }
            });
        }

        return NextResponse.json(updatedSource);
    } catch (error) {
        console.error("Source update error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
