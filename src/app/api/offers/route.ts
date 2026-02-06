import { NextRequest, NextResponse } from "next/server";
import { store, Offer } from "@/lib/store";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    const includeInactive = searchParams.get("includeInactive") === "true";

    let offers = Array.from(store.offers.values());

    if (businessId) {
        offers = offers.filter((o) => o.businessId === businessId);
    }

    // Filter active offers unless requested otherwise
    if (!includeInactive) {
        const now = Date.now();
        offers = offers.filter((o) => o.isActive && o.startsAt <= now && o.endsAt >= now);
    }

    return NextResponse.json(offers);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { businessId, title, description, discountType, value, startsAt, endsAt, radiusMeters, inventory, bookingRequired } = body;

    if (!businessId || !title || !discountType || value === undefined) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = Math.random().toString(36).substring(7);

    const offer: Offer = {
        id,
        businessId,
        title,
        description: description || "",
        discountType,
        value,
        startsAt: startsAt || Date.now(),
        endsAt: endsAt || Date.now() + 7 * 24 * 60 * 60 * 1000, // Default 7 days
        radiusMeters: radiusMeters || 5000,
        isActive: true,
        redemptionCount: 0,
        // Phase 4 fields
        inventory: inventory || 1,
        bookingRequired: bookingRequired !== undefined ? bookingRequired : true,
        claimedCount: 0,
    };

    store.offers.set(id, offer);
    return NextResponse.json(offer);
}
