import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { token: tokenOrCode, action: requestedAction, count = 1 } = body;

    if (!tokenOrCode) {
        return NextResponse.json(
            { error: "Token is required" },
            { status: 400 }
        );
    }

    const tokenData = store.tokens.get(tokenOrCode);

    if (!tokenData) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 });
    }

    // Infer action if not provided
    const action = requestedAction || tokenData.type;

    if (Date.now() > tokenData.expiresAt) {
        store.tokens.delete(tokenOrCode);
        return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // Check if token already redeemed
    if (store.redeemedTokens.has(tokenOrCode)) {
        return NextResponse.json({ error: "Token already redeemed" }, { status: 400 });
    }

    if (tokenData.type !== action) {
        return NextResponse.json(
            { error: `Token is for ${tokenData.type}, not ${action}` },
            { status: 400 }
        );
    }

    // Handle OFFER redemption
    if (action === "OFFER") {
        if (!tokenData.offerId) {
            return NextResponse.json({ error: "Invalid offer token" }, { status: 400 });
        }

        const offer = store.offers.get(tokenData.offerId);
        if (!offer) {
            return NextResponse.json({ error: "Offer not found" }, { status: 404 });
        }

        // Increment redemption count
        offer.redemptionCount += 1;

        // Track analytics
        store.trackEvent(offer.businessId, "offer", offer.id);

        // Mark token as redeemed
        store.redeemedTokens.add(tokenOrCode);
        store.tokens.delete(tokenOrCode);

        return NextResponse.json({
            success: true,
            offerTitle: offer.title,
            businessId: offer.businessId
        });
    }

    // Handle STAMP/REWARD redemption (existing logic)
    if (!tokenData.cardId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const card = store.cards.get(tokenData.cardId);
    if (!card) {
        return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const program = store.programs.get(card.programId);
    if (!program) {
        return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Get businessId for analytics (use "default" for now since we don't have card->business mapping yet)
    const businessId = "default";

    // Perform Action
    if (action === "STAMP") {
        // Check limit one per day
        if (program.limitOnePerDay && card.lastStampAt) {
            const lastDate = new Date(card.lastStampAt).toDateString();
            const today = new Date().toDateString();
            if (lastDate === today) {
                return NextResponse.json(
                    { error: "Daily limit reached" },
                    { status: 400 }
                );
            }
        }

        card.stamps += Number(count);
        card.lastStampAt = Date.now();
        card.history.push({ action: "STAMP", timestamp: Date.now() });

        // Track analytics
        store.trackEvent(businessId, "stamp");
    } else if (action === "REWARD") {
        if (card.stamps < program.stampsRequired) {
            return NextResponse.json(
                { error: "Not enough stamps" },
                { status: 400 }
            );
        }
        card.stamps -= program.stampsRequired;
        card.history.push({ action: "REWARD", timestamp: Date.now() });

        // Track analytics
        store.trackEvent(businessId, "reward");
    }

    // Mark token as redeemed
    store.redeemedTokens.add(tokenOrCode);
    store.tokens.delete(tokenOrCode);

    return NextResponse.json({ success: true, newStamps: card.stamps });
}
