import { NextRequest, NextResponse } from "next/server";
import { store, Card } from "@/lib/store";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if card exists
    // In a real app we'd query by userId. Here we iterate.
    let card = Array.from(store.cards.values()).find(c => c.userId === userId);

    if (!card) {
        const id = Math.random().toString(36).substring(7);
        card = {
            id,
            programId: "default",
            userId,
            stamps: 0,
            history: [],
        };
        store.cards.set(id, card);
    }

    return NextResponse.json(card);
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const card = Array.from(store.cards.values()).find(c => c.userId === userId);

    if (!card) {
        return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(card);
}
