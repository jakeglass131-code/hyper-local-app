import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const claim = store.claims.get(id);

    if (!claim) {
        return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status } = body;

    if (status === "COMPLETED") {
        claim.status = "COMPLETED";
        claim.completedAt = Date.now();
    } else if (status === "CANCELLED") {
        claim.status = "CANCELLED";
        // Refund inventory
        const offer = store.offers.get(claim.offerId);
        if (offer) {
            offer.claimedCount = Math.max(0, offer.claimedCount - 1);
        }
    }

    return NextResponse.json(claim);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const claim = store.claims.get(id);

    if (!claim) {
        return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    // Refund inventory if pending
    if (claim.status === "PENDING") {
        const offer = store.offers.get(claim.offerId);
        if (offer) {
            offer.claimedCount = Math.max(0, offer.claimedCount - 1);
        }
    }

    store.claims.delete(id);
    return NextResponse.json({ success: true });
}
