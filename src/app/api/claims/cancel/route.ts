
import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(request: Request) {
    try {
        const { claimId, userId } = await request.json();

        if (!claimId || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const claim = store.claims.get(claimId);

        if (!claim) {
            return NextResponse.json({ error: "Claim not found" }, { status: 404 });
        }

        if (claim.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (claim.status !== "issued") {
            return NextResponse.json({ error: "Cannot cancel this claim" }, { status: 400 });
        }

        // 1. Update Claim Status
        const updatedClaim = { ...claim, status: "cancelled" as const };
        store.claims.set(claimId, updatedClaim);

        // 2. Update Offer Inventory & Counts
        const offer = store.offers.get(claim.offerId);
        if (offer) {
            const updatedOffer = {
                ...offer,
                claimedCount: Math.max(0, offer.claimedCount - 1),
                inventory: offer.inventory + 1
            };
            store.offers.set(offer.id, updatedOffer);
        }

        return NextResponse.json({ success: true });

    } catch (e) {
        console.error("Failed to cancel claim", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
