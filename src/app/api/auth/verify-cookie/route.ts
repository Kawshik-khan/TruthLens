import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';

export async function GET(request: NextRequest) {
    try {
        // Check if token exists and is valid
        const authResult = await requireAuth(request);

        if (authResult.error) {
            console.log('Cookie verification failed:', authResult.error);
            return NextResponse.json(
                { error: authResult.error, authenticated: false },
                { status: authResult.status }
            );
        }

        console.log('Cookie verification successful for user:', authResult.user?.email);
        return NextResponse.json({
            authenticated: true,
            user: {
                id: authResult.user?.id,
                email: authResult.user?.email,
                name: authResult.user?.name
            }
        });
    } catch (error) {
        console.error('Cookie verification error:', error);
        return NextResponse.json(
            { error: 'Verification failed', authenticated: false },
            { status: 500 }
        );
    }
}