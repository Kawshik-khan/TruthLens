import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export default async function proxy(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    const { pathname } = req.nextUrl;

    // Paths that require authentication
    const protectedPaths = ["/dashboard", "/report", "/admin"];
    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtectedPath) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            const { payload } = await jwtVerify(token, secret);

            // Admin route protection
            if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Redirect to dashboard if already logged in and trying to access login/register
    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/report/:path*", "/admin/:path*", "/login", "/register"],
};
