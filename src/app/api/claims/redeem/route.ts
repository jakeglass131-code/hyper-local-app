import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { voucherCode, merchantUserId } = body;

        // Note: activeMerchantId should come from session/auth context in real app.
        // For MVP, we assume the frontend sends the merchant's ID or we look it up via merchantUserId.
        // Let's assume we pass the merchantId for simplicity in MVP, or simulate a lookup.
        const merchantId = body.merchantId;

        if (!voucherCode || !merchantId) {
            return NextResponse.json({ error: "Missing code or merchant ID" }, { status: 400 });
        }

        // 1. Normalize Code (e.g. remove dashes, uppercase)
        // actually let's keep dashes if we generate them with dashes. 
        // But user input might lack dashes. 
        // Let's assume strict format for now or simple loose match.
        // The store stores "ABCD-EFGH-JK". User might type "ABCDEFGHJK".

        const cleanInput = voucherCode.replace(/[^A-Z0-9]/gi, "").toUpperCase();

        // Find claim by matching normalized code (store code also normalized)
        const claim = Array.from(store.claims.values()).find(c => {
            const cleanStoreCode = c.voucherCode.replace(/[^A-Z0-9]/gi, "").toUpperCase();
            return cleanStoreCode === cleanInput;
        });

        // 2. Validate Existence
        if (!claim) {
            return NextResponse.json({ error: "Voucher code not found" }, { status: 404 });
        }

        // 3. Validate Merchant Ownership
        if (claim.merchantId !== merchantId) {
            return NextResponse.json({ error: "Voucher not valid for this store" }, { status: 403 });
        }

        // 4. Validate Status
        if (claim.status === "redeemed") {
            return NextResponse.json({ error: "Voucher already redeemed", claimedAt: claim.redeemedAt }, { status: 409 });
        }
        if (claim.status === "expired" || claim.status === "cancelled") {
            return NextResponse.json({ error: "Voucher is expired or cancelled" }, { status: 410 });
        }

        // 5. Check Expiry Time
        if (Date.now() > claim.expiresAt) {
            claim.status = "expired";
            return NextResponse.json({ error: "Voucher has expired" }, { status: 410 });
        }

        // 6. REDEEM!
        claim.status = "redeemed";
        claim.redeemedAt = Date.now();
        claim.redeemedByMerchantUserId = merchantUserId;

        // Fetch offer details for success message
        const offer = store.offers.get(claim.offerId);

        return NextResponse.json({
            success: true,
            message: "Voucher redeemed successfully",
            claim: {
                ...claim,
                offerTitle: offer?.title,
                discountValue: offer?.value,
                discountType: offer?.discountType
            }
        });

    } catch (e) {
        console.error("Redemption error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
