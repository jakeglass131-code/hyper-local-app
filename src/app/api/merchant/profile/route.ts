import { NextRequest, NextResponse } from "next/server";
import { store, MerchantProfile } from "@/lib/store";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Find profile by userId
    const profile = Array.from(store.merchantProfiles.values()).find(
        (p) => p.userId === userId
    );

    if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const {
        userId,
        businessName,
        businessCategory,
        businessAddress,
        businessLogo,
        contactEmail,
        contactPhone,
        subscriptionTier = "free",
    } = body;

    if (!userId || !businessName || !businessCategory || !businessAddress || !contactEmail) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    // Check if profile already exists
    const existing = Array.from(store.merchantProfiles.values()).find(
        (p) => p.userId === userId
    );

    if (existing) {
        // Update existing profile
        const updated: MerchantProfile = {
            ...existing,
            businessName,
            businessCategory,
            businessAddress,
            businessLogo,
            contactEmail,
            contactPhone,
            subscriptionTier,
            updatedAt: Date.now(),
        };
        store.merchantProfiles.set(existing.id, updated);
        return NextResponse.json(updated);
    }

    // Create new profile
    const id = Math.random().toString(36).substring(7);
    const profile: MerchantProfile = {
        id,
        userId,
        businessName,
        businessCategory,
        businessAddress,
        businessLogo,
        contactEmail,
        contactPhone,
        subscriptionTier,
        merchantPin: store.generatePin(),
        onboardingCompleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    store.merchantProfiles.set(id, profile);
    return NextResponse.json(profile);
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { userId, onboardingCompleted } = body;

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const profile = Array.from(store.merchantProfiles.values()).find(
        (p) => p.userId === userId
    );

    if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const updated: MerchantProfile = {
        ...profile,
        onboardingCompleted: onboardingCompleted ?? profile.onboardingCompleted,
        updatedAt: Date.now(),
    };

    store.merchantProfiles.set(profile.id, updated);
    return NextResponse.json(updated);
}
