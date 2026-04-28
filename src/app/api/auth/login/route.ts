import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { config, validateEmailDomain, getCookieSettings, getTokenExpiration } from "@/lib/config";

const secret = new TextEncoder().encode(config.security.authSecret);

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Email validation removed - allow any domain
        // if (config.auth.domainWhitelist.length > 0 && !validateEmailDomain(email)) {
        //     console.log('Email validation failed for:', email, 'Domain:', email.split('@')[1], 'Whitelist:', config.auth.domainWhitelist);
        //     return NextResponse.json(
        //         { error: "Email domain is not allowed" },
        //         { status: 400 }
        //     );
        // }

        const user = await db.user.findUnique({
            where: { email },
        });
        
        console.log('User lookup for email:', email, 'Found user:', user);

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        console.log('Password comparison result:', isPasswordValid);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = await new SignJWT({
            userId: user.id,
            email: user.email,
            role: user.role
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime(getTokenExpiration())
            .sign(secret);

        const response = NextResponse.json(
            { message: "Login successful", user: { id: user.id, name: user.name, email: user.email, role: user.role } },
            { status: 200 }
        );

        // Set cookie with configurable settings
        (await cookies()).set("auth_token", token, getCookieSettings());

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
