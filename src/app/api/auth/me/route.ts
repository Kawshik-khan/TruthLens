import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';

export async function GET(request: NextRequest) {
    try {
        const authResult = await requireAuth(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        if (!authResult.user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        const user = authResult.user;

        // Return user data in the format expected by the frontend
        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error('Auth me error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
