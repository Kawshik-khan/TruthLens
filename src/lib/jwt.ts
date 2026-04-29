import jwt from 'jsonwebtoken';

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

export async function requireAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return { error: 'Invalid token', status: 401 };
  }

  // Return mock user data for now
  const user = {
    id: payload.userId,
    name: 'Test User',
    email: payload.email,
    role: payload.role,
    avatar: null,
    bio: null,
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      theme: 'dark',
      language: 'en'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return { user };
}
