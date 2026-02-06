import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { role } = body;

    if (!role || (role !== "consumer" && role !== "provider")) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    // Set cookie
    response.cookies.set("role", role, {
        path: "/",
        maxAge: 86400, // 1 day
        sameSite: "lax",
    });

    return response;
}
