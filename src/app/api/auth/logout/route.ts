import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out successfully" });

    (await cookies()).set("auth_token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    return response;
}
