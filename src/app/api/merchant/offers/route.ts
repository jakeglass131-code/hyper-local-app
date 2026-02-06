import { NextRequest, NextResponse } from "next/server";
import { store, Offer } from "@/lib/store";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const {
        userId,
        businessId,
        title,
        description,
        discountType,
        value,
        startsAt,
        endsAt,
        radiusMeters,
        inventory = 1,
        bookingRequired = true,
        notificationEnabled = false,
        targetDemographics,
        targetAgeRange,
        productType,
    } = body;

    if (!userId || !businessId || !title || !discountType || value === undefined) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    // Get merchant profile to check subscription
    const profile = Array.from(store.merchantProfiles.values()).find(
        (p) => p.userId === userId
    );

    if (!profile) {
        return NextResponse.json(
            { error: "Merchant profile not found" },
            { status: 404 }
        );
    }

    // Get subscription limits
    const limits = store.getSubscriptionLimits(profile.subscriptionTier);

    // Check daily offer limit
    const today = new Date().setHours(0, 0, 0, 0);
    const todaysOffers = Array.from(store.offers.values()).filter(
        (o) => o.businessId === businessId && o.startsAt >= today
    );

    if (todaysOffers.length >= limits.offersPerDay) {
        return NextResponse.json(
            {
                error: `Daily offer limit reached (${limits.offersPerDay} offers per day for ${profile.subscriptionTier} tier)`,
            },
            { status: 403 }
        );
    }

    // Validate features against subscription
    if (notificationEnabled && !limits.features.notifications) {
        return NextResponse.json(
            { error: "Notifications require premium subscription" },
            { status: 403 }
        );
    }

    if (targetDemographics && !limits.features.demographicsTargeting) {
        return NextResponse.json(
            { error: "Demographics targeting requires basic or premium subscription" },
            { status: 403 }
        );
    }

    if (targetAgeRange && !limits.features.ageTargeting) {
        return NextResponse.json(
            { error: "Age targeting requires premium subscription" },
            { status: 403 }
        );
    }

    // Create offer
    const id = Math.random().toString(36).substring(7);
    const offer: Offer = {
        id,
        businessId,
        title,
        description: description || "",
        discountType,
        value,
        startsAt: startsAt || Date.now(),
        endsAt: endsAt || Date.now() + 7 * 24 * 60 * 60 * 1000,
        radiusMeters: radiusMeters || 5000,
        isActive: true,
        redemptionCount: 0,
        inventory,
        bookingRequired,
        claimedCount: 0,
        notificationEnabled,
        targetDemographics,
        targetAgeRange,
        productType,
    };

    store.offers.set(id, offer);
    return NextResponse.json(offer);
}
