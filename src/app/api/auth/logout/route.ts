import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logout successful" });

    // Clear the token cookie with same configuration as login
    const isProduction = process.env.NODE_ENV === "production";
    const cookieDomain = process.env.COOKIE_DOMAIN;

    response.cookies.set("token", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        domain: cookieDomain,
        path: "/",
        maxAge: 0 // Expire immediately
    });

    console.log("Logout successful: token cookie cleared");
    return response;
}
