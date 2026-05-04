import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';

export async function GET(request: NextRequest) {
    try {
        console.log('[/api/auth/me] Request received');
        const authResult = await requireAuth(request);
        console.log('[/api/auth/me] Auth result:', { hasError: !!authResult.error, hasUser: !!authResult.user });
        
        if (authResult.error) {
            console.log('[/api/auth/me] Auth error:', authResult.error);
            const response = NextResponse.json({ error: authResult.error }, { status: authResult.status });
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            response.headers.set('Pragma', 'no-cache');
            response.headers.set('Expires', '0');
            return response;
        }

        if (!authResult.user) {
            console.log('[/api/auth/me] User not found');
            const response = NextResponse.json({ error: 'User not found' }, { status: 401 });
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            response.headers.set('Pragma', 'no-cache');
            response.headers.set('Expires', '0');
            return response;
        }

        const user = authResult.user;
        console.log('[/api/auth/me] Returning user:', user.email);

        const response = NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
        
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        
        return response;
    } catch (error) {
        console.error('[/api/auth/me] Error:', error);
        const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        return response;
    }
}
