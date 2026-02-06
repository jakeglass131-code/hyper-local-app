import { NextRequest, NextResponse } from "next/server";
import { store, Claim } from "@/lib/store";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const claims = Array.from(store.claims.values()).filter(
        (c) => c.userId === userId
    );

    // Sort by claimedAt DESC (newest first)
    claims.sort((a, b) => b.claimedAt - a.claimedAt);

    return NextResponse.json(claims);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { offerId, userId } = body;

    if (!offerId || !userId) {
        return NextResponse.json(
            { error: "offerId and userId required" },
            { status: 400 }
        );
    }

    const offer = store.offers.get(offerId);
    if (!offer) {
        return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Check inventory
    if (offer.claimedCount >= offer.inventory) {
        return NextResponse.json(
            { error: "No slots available" },
            { status: 400 }
        );
    }

    // Check if offer is active and within date range
    const now = Date.now();
    if (!offer.isActive || offer.startsAt > now || offer.endsAt < now) {
        return NextResponse.json(
            { error: "Offer is not currently active" },
            { status: 400 }
        );
    }

    const id = Math.random().toString(36).substring(7);

    const claim: Claim = {
        id,
        offerId,
        userId,
        claimedAt: Date.now(),
        status: "PENDING",
    };

    store.claims.set(id, claim);

    // Increment claimed count
    offer.claimedCount += 1;

    return NextResponse.json(claim);
}
