import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get all claims for this user
    const claims = Array.from(store.claims.values())
        .filter(c => c.userId === userId)
        .map(c => {
            // Enrich with Offer and Business details for UI
            const offer = store.offers.get(c.offerId);
            const business = offer ? store.businesses.get(offer.businessId) : null;
            return {
                ...c,
                offerTitle: offer?.title || "Unknown Offer",
                businessName: business?.name || "Unknown Business",
            };
        })
        .sort((a, b) => b.issuedAt - a.issuedAt); // Newest first

    return NextResponse.json(claims);
}
