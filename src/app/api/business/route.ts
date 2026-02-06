import { NextRequest, NextResponse } from "next/server";
import { store, Program } from "@/lib/store";

export async function GET() {
    const programs = Array.from(store.programs.values());
    return NextResponse.json(programs);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name, stampsRequired, limitOnePerDay, cardColor, logo } = body;

    const id = "default"; // For MVP we only support one program

    const program: Program = {
        id,
        name: name || "Coffee Loyalty",
        stampsRequired: Number(stampsRequired) || 10,
        limitOnePerDay: Boolean(limitOnePerDay),
        cardColor,
        logo,
    };

    store.programs.set(id, program);
    return NextResponse.json(program);
}
