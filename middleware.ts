import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production')

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    console.log(`Middleware: Allowing public route ${pathname}`)
    return NextResponse.next()
  }

  // Check if route starts with public prefix
  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) {
    console.log(`Middleware: Allowing public prefix route ${pathname}`)
    return NextResponse.next()
  }

  // Check for auth token in cookies
  const token = request.cookies.get('token')?.value

  if (!token) {
    console.log(`Middleware: No token found for protected route ${pathname}, redirecting to login`)
    // Redirect to login if no token
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify JWT using jose (edge runtime compatible)
    const { payload } = await jwtVerify(token, JWT_SECRET)
    console.log(`Middleware: Token verified for user ${payload.email}, allowing access to ${pathname}`)
    return NextResponse.next()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Middleware: Token verification failed for route ${pathname}:`, errorMessage)
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
