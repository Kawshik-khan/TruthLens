import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        if (message.length < 20) {
            return NextResponse.json(
                { error: "Message must be at least 20 characters" },
                { status: 400 }
            );
        }

        const feedback = await db.feedback.create({
            data: {
                name,
                email,
                message,
            },
        });

        return NextResponse.json(
            { message: "Feedback submitted successfully", id: feedback.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Feedback submission error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
