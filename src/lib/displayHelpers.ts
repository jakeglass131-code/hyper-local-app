// Utility functions for displaying time and distance information

/**
 * Calculate human-readable time remaining
 * @param endsAt - Unix timestamp when offer expires
 * @returns String like "1h 12m" or "23m" or "Expired"
 */
export function getTimeRemaining(endsAt: number): string {
    const now = Date.now();
    const diff = endsAt - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

/**
 * Calculate distance and walk time from user location to business
 * @param userLat - User latitude
 * @param userLng - User longitude  
 * @param businessLat - Business latitude
 * @param businessLng - Business longitude
 * @returns Object with distance in meters and walking time in minutes
 */
export function calculateDistanceAndTime(
    userLat: number,
    userLng: number,
    businessLat: number,
    businessLng: number
): { distanceMeters: number; walkMinutes: number; displayText: string } {
    // Haversine formula
    const R = 6371e3; // Earth radius in meters
    const φ1 = (userLat * Math.PI) / 180;
    const φ2 = (businessLat * Math.PI) / 180;
    const Δφ = ((businessLat - userLat) * Math.PI) / 180;
    const Δλ = ((businessLng - userLng) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceMeters = Math.round(R * c);

    // Average walking speed: 5 km/h = 83.33 m/min
    const walkMinutes = Math.ceil(distanceMeters / 83.33);

    // Format display text
    let displayText = "";
    if (distanceMeters < 1000) {
        displayText = `${distanceMeters}m • ${walkMinutes} min walk`;
    } else {
        const km = (distanceMeters / 1000).toFixed(1);
        displayText = `${km}km • ${walkMinutes} min walk`;
    }

    return { distanceMeters, walkMinutes, displayText };
}

/**
 * Calculate savings amount based on discount type
 * @param discountType - Type of discount (percent, fixed, bundle)
 * @param value - Discount value
 * @param originalPrice - Original price (optional, defaults to $15 if not provided)
 * @returns Formatted savings string like "Save $4.20" or "You save 30%"
 */
export function calculateSavings(
    discountType: "percent" | "fixed" | "bundle",
    value: number,
    originalPrice: number = 15
): string {
    if (discountType === "percent") {
        const saved = (originalPrice * value) / 100;
        return `Save $${saved.toFixed(2)} • ${value}% off`;
    } else if (discountType === "fixed") {
        return `Save $${value.toFixed(2)}`;
    } else {
        // bundle - typically BOGO
        return `Buy 1 Get 1 Free`;
    }
}

/**
 * Get category icon emoji
 */
export function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
        Food: "🥪",
        Coffee: "☕",
        Drinks: "🍸",
        Wellness: "🌿",
        Beauty: "💅",
        Fitness: "💪",
        Retail: "🛍️",
        Entertainment: "🎬",
    };
    return icons[category] || "🏪";
}

/**
 * Calculate "Was/Now" price display
 * @param discountType - Type of discount
 * @param value - Discount value
 * @param originalPrice - Original price (defaults to $15)
 * @returns Object with original, discounted prices and display text
 */
export function calculateWasNowPrice(
    discountType: "percent" | "fixed" | "bundle",
    value: number,
    originalPrice: number = 15
): { original: number; now: number; displayText: string } {
    let now = originalPrice;

    if (discountType === "percent") {
        now = originalPrice * (1 - value / 100);
    } else if (discountType === "fixed") {
        now = Math.max(0, originalPrice - value);
    } else {
        // Bundle - show half price  
        now = originalPrice / 2;
    }

    const displayText = `Was $${originalPrice.toFixed(2)} → Now $${now.toFixed(2)}`;
    return { original: originalPrice, now, displayText };
}

/**
 * Get "how busy" indicator based on time of day and category
 * @param category - Business category
 * @param hour - Hour of day (0-23), defaults to current hour
 * @returns String like "Usually quiet" or "Peak time 🔥"
 */
export function getHowBusy(category: string, hour?: number): string {
    const currentHour = hour ?? new Date().getHours();

    // Coffee shops: busy 7-10am
    if (category === "Coffee" && currentHour >= 7 && currentHour < 10) {
        return "Peak time 🔥";
    }

    // Food: busy 12-2pm, 6-8pm
    if ((category === "Food" || category === "Brunch") &&
        ((currentHour >= 12 && currentHour < 14) || (currentHour >= 18 && currentHour < 20))) {
        return "Peak time 🔥";
    }

    // Bars: busy 6pm-11pm
    if ((category === "Bars" || category === "Drinks") && currentHour >= 18 && currentHour < 23) {
        return "Peak time 🔥";
    }

    // Otherwise quiet
    return "Usually quiet";
}

