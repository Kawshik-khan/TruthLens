import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Helper to extract token from cookies in a request
function getTokenFromCookies(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token') {
      return value;
    }
  }
  return null;
}

// Helper to extract token from Authorization header (for API calls)
function getTokenFromAuthHeader(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Debug helper to log all authentication attempts
function logAuthAttempt(request: Request, source: string, token: string | null, success: boolean) {
  console.log(`Auth attempt - Source: ${source}, Token: ${token ? token.substring(0, 10) + '...' : 'null'}, Success: ${success}`);
  
  if (!success) {
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  }
}

export async function requireAuth(request: Request) {
  // Try to get token from cookie first, then fall back to Authorization header
  let token = getTokenFromCookies(request);
  let authSource = 'cookie';
  
  if (!token) {
    token = getTokenFromAuthHeader(request);
    authSource = token ? 'authorization' : 'none';
  }
  
  // Log authentication attempt for debugging
  logAuthAttempt(request, authSource, token, !!token);
  
  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return { error: 'Invalid token', status: 401 };
  }

  // Fetch real user from database
  try {
    const user = await (db as any).user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return { error: 'User not found', status: 401 };
    }

    return { user };
  } catch (error) {
    console.error('Error fetching user from database:', error);
    return { error: 'Database error', status: 500 };
  }
}
