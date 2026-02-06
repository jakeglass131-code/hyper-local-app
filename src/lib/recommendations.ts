// Smart recommendation logic for "Quick Pick" and session-based suggestions

import { Offer } from "./store";

type UserPreferences = {
    categories: string[];
    dietaryRestrictions?: string[];
    budgetMax?: number;
    walkingDistanceMax?: number;
};

type SessionContext = {
    recentlyViewedCategories: string[];
    recentSearchTerms: string[];
    lastInteractionTime: number;
};

/**
 * Get time-based meal period
 */
export function getCurrentMealPeriod(): "breakfast" | "lunch" | "afternoon" | "dinner" | "latenight" {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 11) return "breakfast";
    if (hour >= 11 && hour < 15) return "lunch";
    if (hour >= 15 && hour < 18) return "afternoon";
    if (hour >= 18 && hour < 22) return "dinner";
    return "latenight";
}

/**
 * Quick Pick - Get single strong recommendation + 2 backups
 * @param offers - All available offers
 * @param userPreferences - User's saved preferences
 * @param userLocation - User's current location
 * @param sessionContext - Recent user behavior
 * @returns Top 3 recommendations
 */
export function getQuickPick(
    offers: any[],
    userPreferences: UserPreferences,
    userLocation: { lat: number; lng: number },
    sessionContext?: SessionContext
): any[] {
    const mealPeriod = getCurrentMealPeriod();
    const now = Date.now();

    // Score each offer
    const scored = offers.map(offer => {
        let score = 0;

        // 1. Is it available now?
        if (offer.endsAt > now && offer.claimedCount < offer.inventory) {
            score += 100;
        } else {
            return null; // Skip unavailable
        }

        // 2. Priority boost for service categories
        const serviceCategories = ["Wellness", "Beauty", "Fitness"];
        if (serviceCategories.includes(offer.category)) {
            score += 60; // Significant boost for services
        }

        // 3. Category match (user prefs or session)
        if (sessionContext?.recentlyViewedCategories.includes(offer.category)) {
            score += 50; // Boost if they've been looking at this category
        } else if (userPreferences.categories.includes(offer.category)) {
            score += 30;
        }

        // 4. Time of day relevance
        if (mealPeriod === "breakfast" && ["Coffee", "Food"].includes(offer.category)) {
            score += 40;
        } else if (mealPeriod === "lunch" && ["Food"].includes(offer.category)) {
            score += 40;
        } else if (mealPeriod === "dinner" && ["Food", "Drinks"].includes(offer.category)) {
            score += 40;
        } else if (mealPeriod === "afternoon" && ["Coffee", "Food"].includes(offer.category)) {
            score += 40;
        }

        // 5. Distance (mock - in production calculate real distance)
        // Closer = better
        const mockDistance = Math.random() * 2000; // 0-2km
        if (mockDistance < 500) score += 30;
        else if (mockDistance < 1000) score += 20;
        else if (mockDistance < 1500) score += 10;

        // 5. Discount size
        if (offer.discountType === "percent") {
            score += Math.min(offer.value, 50); // Up to 50 points for big discounts
        }

        // 6. Ending soon = urgency
        const hoursLeft = (offer.endsAt - now) / (1000 * 60 * 60);
        if (hoursLeft < 2) score += 25;
        else if (hoursLeft < 4) score += 15;

        return { offer, score };
    }).filter(Boolean);

    // Sort by score and return top 3
    return scored
        .sort((a, b) => (b?.score || 0) - (a?.score || 0))
        .slice(0, 3)
        .map(item => item?.offer);
}

/**
 * Curated collections - predefined filters
 */
export const COLLECTIONS = [
    {
        id: "cheap-eats",
        title: "Cheap Eats Under $10",
        emoji: "💵",
        filter: (offer: any) => {
            // Mock: assume $15 base price
            const price = 15 * (1 - (offer.value / 100));
            return price < 10;
        }
    },
    {
        id: "iced-coffee",
        title: "Best Iced Coffee Near You",
        emoji: "🧊",
        filter: (offer: any) => offer.category === "Coffee"
    },
    {
        id: "date-night",
        title: "Date Night Deals",
        emoji: "💕",
        filter: (offer: any) => offer.category === "Food" || offer.category === "Drinks"
    },
    {
        id: "late-night",
        title: "Late Night Bites",
        emoji: "🌙",
        filter: (offer: any) => {
            const hour = new Date().getHours();
            return hour >= 20 || hour < 2;
        }
    },
    {
        id: "student",
        title: "Student Favourites",
        emoji: "🎓",
        filter: (offer: any) => offer.value >= 20 // High discounts
    },
];

/**
 * Get time window offers
 */
export function getTimeWindowOffers(
    offers: any[],
    window: "breakfast" | "lunch" | "afternoon" | "dinner" | "latenight"
): any[] {
    const now = new Date();
    const hour = now.getHours();

    // Filter offers that are:
    // 1. Available now or soon
    // 2. Relevant to this meal time

    return offers.filter(offer => {
        // Check availability
        if (offer.endsAt < now.getTime()) return false;
        if (offer.claimedCount >= offer.inventory) return false;

        // Check relevance
        if (window === "breakfast" && ["Coffee", "Food"].includes(offer.category)) return true;
        if (window === "lunch" && ["Food"].includes(offer.category)) return true;
        if (window === "afternoon" && ["Coffee", "Food"].includes(offer.category)) return true;
        if (window === "dinner" && ["Food", "Drinks"].includes(offer.category)) return true;
        if (window === "latenight" && ["Drinks", "Food"].includes(offer.category)) return true;

        return false;
    });
}
