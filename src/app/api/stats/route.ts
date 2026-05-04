import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/stats - Get platform statistics
export async function GET() {
    try {
        // Total analyses (submissions count)
        const totalAnalyses = await (db as any).submission.count();

        // Verified sources count (sources with high credibility score >= 70)
        const verifiedSources = await (db as any).source.count({
            where: { credibilityScore: { gte: 70 } }
        });

        // Total users
        const userCount = await (db as any).user.count();

        // Average accuracy from all submissions
        const avgAccuracyResult = await (db as any).submission.aggregate({
            _avg: { trustScore: true }
        });
        const avgAccuracy = Math.round(avgAccuracyResult._avg.trustScore || 0);

        // Countries served (count unique regions from sources)
        const regions = await (db as any).source.groupBy({
            by: ['region'],
            where: { region: { not: null } }
        });
        const countriesServed = regions.length;

        return NextResponse.json({
            totalAnalyses,
            verifiedSources,
            userCount,
            avgAccuracy,
            countriesServed
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
