import { NextResponse } from "next/server";
import { store, Claim, Offer } from "@/lib/store";

// Helper: Generate 10-char alphanumeric code (excluding confusing chars)
function generateVoucherCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I, 1, O, 0
    let code = "";
    for (let i = 0; i < 10; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Format: ABCD-EFGH-JK
    return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 10)}`;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { offerId, userId, reservationName } = body;

        if (!offerId || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Verify Offer Exists & Is Active
        const offer = store.offers.get(offerId);
        if (!offer || !offer.isActive) {
            return NextResponse.json({ error: "Offer not found or inactive" }, { status: 404 });
        }

        // 2. Check for Existing Active Claim (Status = issued)
        // REMOVED: Allow multiple reservations for the same offer (e.g. for friends/groups)
        /*
        const existingClaim = Array.from(store.claims.values()).find(
            c => c.offerId === offerId && c.userId === userId && c.status === "issued"
        );

        if (existingClaim) {
            // Return existing claim so UI can show the code again
            return NextResponse.json(existingClaim);
        }
        */

        // 3. Generate Unique Code
        let voucherCode = generateVoucherCode();
        let retries = 0;
        // Ensure uniqueness (simple loop check)
        while (Array.from(store.claims.values()).some(c => c.voucherCode === voucherCode) && retries < 5) {
            voucherCode = generateVoucherCode();
            retries++;
        }

        if (retries >= 5) {
            return NextResponse.json({ error: "Failed to load unique code" }, { status: 500 });
        }

        // 4. Create Claim
        const claimId = `claim_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const now = Date.now();
        const expiresAt = now + (2 * 60 * 60 * 1000); // 2 Hours expiry as requested

        const newClaim = {
            id: claimId,
            offerId,
            userId,
            merchantId: offer.businessId,
            voucherCode,
            status: "issued" as const,
            issuedAt: now,
            expiresAt,
            reservationName: reservationName || undefined,
        };

        store.claims.set(claimId, newClaim);

        // Update Offer Stats
        offer.claimedCount = (offer.claimedCount || 0) + 1;

        return NextResponse.json(newClaim);

    } catch (e) {
        console.error("Claim creation error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
