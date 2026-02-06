import { NextRequest, NextResponse } from "next/server";
import { store, SubscriptionTier } from "@/lib/store";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const tier = searchParams.get("tier") as SubscriptionTier | null;

    if (!userId && !tier) {
        return NextResponse.json(
            { error: "User ID or tier required" },
            { status: 400 }
        );
    }

    // If tier is provided, return limits for that tier
    if (tier) {
        const limits = store.getSubscriptionLimits(tier);
        return NextResponse.json(limits);
    }

    // Otherwise, find user's profile and return their limits
    const profile = Array.from(store.merchantProfiles.values()).find(
        (p) => p.userId === userId
    );

    if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const limits = store.getSubscriptionLimits(profile.subscriptionTier);
    return NextResponse.json(limits);
}
