import { NextResponse } from "next/server";
import { store, UserEvent } from "@/lib/store";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, eventType, businessId, category, offerId, distanceKm } = body;

        if (!userId || !eventType || !businessId || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Log Event
        const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const event: UserEvent = {
            id: eventId,
            userId,
            eventType,
            offerId,
            businessId,
            category,
            distanceKm,
            timestamp: Date.now(),
        };

        store.userEvents.set(eventId, event);

        // 2. Update Weights
        let userProfile = store.userProfiles.get(userId);
        if (!userProfile) {
            // Create if missing (Cold Start fallback)
            userProfile = {
                userId,
                categoryWeights: {},
                businessWeights: {},
                avgDistanceKm: 2.0,
                lastUpdatedAt: Date.now(),
            };
            store.userProfiles.set(userId, userProfile);
        }

        // Determine Increment
        let increment = 0;
        switch (eventType) {
            case "impression": increment = 0.1; break;
            case "click": increment = 1; break;
            case "favourite": increment = 2; break;
            case "redeem":
            case "book":
                increment = 5; break;
            default: increment = 0;
        }

        // Update Category Weight
        const currentCatWeight = userProfile.categoryWeights[category] || 0;
        userProfile.categoryWeights[category] = currentCatWeight + increment;

        // Update Business Weight
        const currentBizWeight = userProfile.businessWeights[businessId] || 0;
        userProfile.businessWeights[businessId] = currentBizWeight + increment;

        // Update Avg Distance (if provided)
        if (distanceKm !== undefined && distanceKm !== null) {
            // Simple moving average: 80% old, 20% new
            userProfile.avgDistanceKm = (userProfile.avgDistanceKm * 0.8) + (distanceKm * 0.2);
        }

        userProfile.lastUpdatedAt = Date.now();

        return NextResponse.json({
            success: true, eventId, newWeights: {
                category: userProfile.categoryWeights,
                business: userProfile.businessWeights
            }
        });

    } catch (e) {
        console.error("Event logging error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
