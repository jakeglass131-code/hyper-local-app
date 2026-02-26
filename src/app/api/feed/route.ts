import { NextResponse } from "next/server";
import { store, Offer } from "@/lib/store";
import { calculateDistanceAndTime } from "@/lib/displayHelpers"; // We might need to duplicate simple dist logic if displayHelpers is client-side only? 
// Actually, displayHelpers imports standard math, so it should be fine in node environment if it doesn't use 'window'. 
// Let's assume we maintain a simple dist function here to be safe and dependency-free.

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");

    if (!userId) {
        return NextResponse.json({ error: "UserId required" }, { status: 400 });
    }

    // Default Location (Perth CBD) if not provided
    const userLat = latStr ? parseFloat(latStr) : -31.9523;
    const userLng = lngStr ? parseFloat(lngStr) : 115.8613;

    // 1. Fetch User Profile
    const profile = store.userProfiles.get(userId) || {
        userId,
        categoryWeights: {},
        businessWeights: {},
        avgDistanceKm: 2.0,
        lastUpdatedAt: Date.now(),
    };

    // 2. Fetch All Active Offers
    // Convert Map to Array
    const allOffers = Array.from(store.offers.values()).filter(o => o.isActive);
    const now = Date.now();

    // 3. Score Offers
    const scoredOffers = allOffers.map(offer => {
        const business = store.businesses.get(offer.businessId);
        // If business missing (shouldn't happen in consistent store), give low score
        if (!business) return { ...offer, score: -999, distKm: 999 };

        // --- SCORES ---

        // A. Affinity
        const catWeight = profile.categoryWeights[business.category] || 0;
        const bizWeight = profile.businessWeights[business.id] || 0;
        const affinityScore = (catWeight * 3) + (bizWeight * 2);

        // B. Distance
        const distKm = getDistanceKm(userLat, userLng, business.lat, business.lng);
        let distBoost = 0;
        if (distKm <= profile.avgDistanceKm) {
            distBoost = 2;
        } else if (distKm <= profile.avgDistanceKm * 2) {
            distBoost = 1;
        }

        // C. Urgency
        const hoursLeft = (offer.endsAt - now) / (1000 * 60 * 60);
        let urgencyBoost = 0;
        if (hoursLeft <= 6) urgencyBoost = 3;
        else if (hoursLeft <= 24) urgencyBoost = 2;
        else if (hoursLeft <= 72) urgencyBoost = 1;

        // D. Popularity (Mock based on redemptionCount/claimedCount)
        const popBoost = Math.min((offer.claimedCount || 0) / 10, 2) + ((business as any).rating / 5 || 0);

        const totalScore = affinityScore + distBoost + urgencyBoost + popBoost;

        return {
            ...offer,
            score: totalScore,
            distKm
        };
    });

    // 4. Sort by Score DESC
    scoredOffers.sort((a, b) => b.score - a.score);

    // 5. Diversity Rule (Max 2 per business in Top 10)
    const finalFeed: typeof scoredOffers = [];
    const businessCounts: Record<string, number> = {};
    const deferredOffers: typeof scoredOffers = [];

    // Pass 1: Fill feed respecting limits
    for (const offer of scoredOffers) {
        const count = businessCounts[offer.businessId] || 0;
        if (finalFeed.length < 10 && count >= 2) {
            deferredOffers.push(offer);
        } else {
            finalFeed.push(offer);
            businessCounts[offer.businessId] = count + 1;
        }
    }

    // Append deferred offers at the end
    finalFeed.push(...deferredOffers);

    // 6. Reorder Categories Logic
    // Get all unique categories from offers
    const allCategories = Array.from(new Set(Array.from(store.businesses.values()).map(b => b.category)));

    // Sort based on weight DESC
    const sortedCategories = allCategories.sort((a, b) => {
        const weightA = profile.categoryWeights[a] || 0;
        const weightB = profile.categoryWeights[b] || 0;
        return weightB - weightA;
    });

    // Ensure "All" is treated implicitly by client, or we can send it.
    // Client usually prepends "All" or "For You".

    return NextResponse.json({
        feed: finalFeed.map(({ score, distKm, ...o }) => o), // Return clean offers (maybe keep score for debug?)
        // Let's return score for debugging in the UI console
        debugScores: finalFeed.map(o => ({ id: o.id, score: o.score, title: o.title })),
        reorderedCategories: sortedCategories
    });
}
