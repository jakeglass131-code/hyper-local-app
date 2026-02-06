import { Business } from "./store";

export interface BusyTime {
    time: string;
    emoji: string;
    label: string;
}

export interface Recommendation {
    text: string;
    action: string;
}

export interface BusinessInsights {
    busyTimes: BusyTime[];
    recommendation: Recommendation;
}

export function getBusinessInsights(business: Business, now: Date = new Date()): BusinessInsights {
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const isWeekend = day === 0 || day === 6;

    // Default insights
    let busyTimes: BusyTime[] = [
        { time: "12–1pm", emoji: "🥪", label: "Lunch Peak" },
        { time: "6–8pm", emoji: "🍽️", label: "Dinner Rush" }
    ];
    let recommendation: Recommendation = {
        text: "Traffic is steady. Consider a flash sale to boost afternoon sales.",
        action: "Create Offer"
    };

    const category = business.category.toLowerCase();

    // Category-specific logic
    if (category.includes("cafe") || category.includes("coffee")) {
        busyTimes = [
            { time: "7–9am", emoji: "☕", label: "Morning Rush" },
            { time: "10–11am", emoji: "🥐", label: "Mid-Morning" }
        ];

        if (hour > 14) {
            recommendation = {
                text: "Afternoon slump detected. Offer a 'Happy Hour' on pastries to clear inventory.",
                action: "Create Pastry Deal"
            };
        } else {
            recommendation = {
                text: "Morning rush is coming. Ensure your 'Coffee Combo' offers are active.",
                action: "Check Active Offers"
            };
        }
    } else if (category.includes("bar") || category.includes("pub") || category.includes("night")) {
        busyTimes = [
            { time: "5–7pm", emoji: "🍻", label: "Happy Hour" },
            { time: "9–11pm", emoji: "🎵", label: "Late Night" }
        ];

        if (day === 5 || day === 6) { // Fri/Sat
            recommendation = {
                text: "Weekend crowd expected! Create a group bundle to attract larger parties.",
                action: "Create Bundle Offer"
            };
        } else {
            recommendation = {
                text: "Quiet weeknight? Run a '2-for-1' special to draw in the after-work crowd.",
                action: "Create BOGO Offer"
            };
        }
    } else if (category.includes("spa") || category.includes("wellness") || category.includes("beauty")) {
        busyTimes = [
            { time: "10am–12pm", emoji: "💆", label: "Morning Bookings" },
            { time: "4–6pm", emoji: "💅", label: "After-Work" }
        ];

        if (isWeekend) {
            recommendation = {
                text: "Weekend slots are filling up. Promote last-minute openings for tomorrow.",
                action: "Fill Empty Slots"
            };
        } else {
            recommendation = {
                text: "Mid-week lull. Offer a discount on premium services to boost revenue.",
                action: "Create Service Deal"
            };
        }
    } else if (category.includes("retail") || category.includes("shop")) {
        busyTimes = [
            { time: "11am–1pm", emoji: "🛍️", label: "Lunch Shoppers" },
            { time: "3–5pm", emoji: "🎁", label: "Afternoon Browse" }
        ];
        recommendation = {
            text: "Clear out seasonal stock. Run a 'Flash Sale' for the next 24 hours.",
            action: "Start Flash Sale"
        };
    } else if (category.includes("gym") || category.includes("fitness")) {
        busyTimes = [
            { time: "6–8am", emoji: "💪", label: "Early Birds" },
            { time: "5–7pm", emoji: "🏃", label: "Post-Work" }
        ];
        recommendation = {
            text: "Class attendance is lower on Fridays. Offer a 'Bring a Friend' pass.",
            action: "Create Guest Pass"
        };
    }

    return { busyTimes, recommendation };
}
