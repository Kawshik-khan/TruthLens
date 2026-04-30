import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register', 
  '/auth',
  '/',
  '/terms',
  '/methodology',
  '/sources',
  '/learn',
  '/learn/quizzes',
  '/feedback',
  '/submit',
  '/analyze'
]

// Routes that start with these are public
const publicPrefixes = ['/api/', '/_next/', '/favicon.ico', '/static/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if route starts with public prefix
  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Check for auth token in cookies
  const token = request.cookies.get('token')?.value

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify JWT
    jwt.verify(token, JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    // Token is invalid, redirect to login
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

// Configure matcher for middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
