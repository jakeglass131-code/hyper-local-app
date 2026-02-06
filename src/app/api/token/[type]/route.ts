import { NextRequest, NextResponse } from "next/server";
import { store, Token } from "@/lib/store";
import { randomBytes } from "crypto";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params;

    if (type !== "stamp" && type !== "reward" && type !== "offer") {
        return NextResponse.json({ error: "Invalid token type" }, { status: 400 });
    }

    const body = await request.json();
    const { cardId, offerId } = body;

    // Handle offer tokens
    if (type === "offer") {
        if (!offerId) {
            return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });
        }

        const offer = store.offers.get(offerId);
        if (!offer) {
            return NextResponse.json({ error: "Offer not found" }, { status: 404 });
        }

        // Check if offer is active and within date range
        const now = Date.now();
        if (!offer.isActive || offer.startsAt > now || offer.endsAt < now) {
            return NextResponse.json({ error: "Offer is not currently active" }, { status: 400 });
        }

        // Generate short code (6 digits)
        const shortCode = Math.floor(100000 + Math.random() * 900000).toString();
        const tokenStr = randomBytes(16).toString("hex");
        const expiresAt = Date.now() + 60 * 1000; // 60 seconds

        const token: Token = {
            code: shortCode,
            type: "OFFER",
            offerId,
            expiresAt,
        };

        store.tokens.set(shortCode, token);
        store.tokens.set(tokenStr, token);

        return NextResponse.json({
            token: tokenStr,
            shortCode,
            expiresAt,
        });
    }

    // Handle stamp/reward tokens (existing logic)
    if (!cardId) {
        return NextResponse.json({ error: "Card ID is required" }, { status: 400 });
    }

    const card = store.cards.get(cardId);
    if (!card) {
        return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Check eligibility for reward
    if (type === "reward") {
        const program = store.programs.get(card.programId);
        if (!program || card.stamps < program.stampsRequired) {
            return NextResponse.json(
                { error: "Not eligible for reward" },
                { status: 400 }
            );
        }
    }

    // Generate short code (6 digits)
    const shortCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate long token (UUID-like)
    const tokenStr = randomBytes(16).toString("hex");

    const expiresAt = Date.now() + 60 * 1000; // 60 seconds

    const token: Token = {
        code: shortCode,
        type: type.toUpperCase() as "STAMP" | "REWARD",
        cardId,
        expiresAt,
    };

    // Store by both short code and long token for flexibility
    store.tokens.set(shortCode, token);
    store.tokens.set(tokenStr, token);

    return NextResponse.json({
        token: tokenStr,
        shortCode,
        expiresAt,
    });
}
