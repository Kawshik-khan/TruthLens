import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { config, validateEmailDomain, isValidRole } from "@/lib/config";

export async function POST(req: Request) {
    console.log("Registration request received");
    try {
        const body = await req.json();
        console.log("Request body parsed:", body);
        const { name, email, password, role } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // Validate email domain if whitelist is configured
        if (!validateEmailDomain(email)) {
            return NextResponse.json(
                { error: "Email domain is not allowed" },
                { status: 400 }
            );
        }

        // Validate role if provided
        if (role && !isValidRole(role)) {
            return NextResponse.json(
                { error: `Invalid role. Must be one of: ${config.auth.availableRoles.join(', ')}` },
                { status: 400 }
            );
        }

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, config.auth.passwordHashRounds);

        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || config.auth.defaultUserRole,
            },
        });

        return NextResponse.json(
            { message: "User registered successfully", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
