import { MOCK_BUSINESSES } from "./mockData";

export type Program = {
    id: string;
    name: string;
    stampsRequired: number;
    limitOnePerDay: boolean;
    cardColor?: string; // Hex code
    logo?: string; // Data URL
};

export type Card = {
    id: string;
    programId: string;
    userId: string; // For MVP, we'll just use a simple string ID
    stamps: number;
    lastStampAt?: number; // Timestamp
    history: {
        action: "STAMP" | "REWARD";
        timestamp: number;
    }[];
};

export type Token = {
    code: string; // Short code (e.g., "123456")
    type: "STAMP" | "REWARD" | "OFFER";
    cardId?: string; // Optional for offers
    offerId?: string; // For offer tokens
    expiresAt: number;
};

// TODO: Move to Supabase
export type Business = {
    id: string;
    name: string;
    category: string;
    suburb: string;
    lat: number;
    lng: number;
    merchantPin: string; // 4-6 digit PIN
    createdAt: number;
};

// TODO: Move to Supabase
export type Offer = {
    id: string;
    businessId: string;
    title: string;
    description: string;
    discountType: "percent" | "fixed" | "bundle";
    value: number; // Percent (e.g., 50) or fixed amount
    startsAt: number;
    endsAt: number;
    radiusMeters: number;
    isActive: boolean;
    redemptionCount: number;
    // Phase 4: Time slot inventory
    inventory: number; // Total slots available (default 1)
    bookingRequired: boolean; // true = claim first, false = direct redeem (default true)
    claimedCount: number; // Tracks active claims
    // Phase 6: Targeting fields
    notificationEnabled?: boolean; // Premium feature
    targetDemographics?: string[]; // e.g., ["students", "families"]
    targetAgeRange?: { min: number; max: number };
    productType?: string; // e.g., "food", "retail", "service"
    imageUrl?: string; // URL or base64
    originalPrice?: number; // For % off offers, to show "Was $X"
};

// TODO: Move to Supabase
export type Claim = {
    id: string;
    offerId: string;
    userId: string; // Consumer ID
    merchantId: string;
    voucherCode: string; // "ABCD-EFGH-JK"
    status: "issued" | "redeemed" | "expired" | "cancelled";
    issuedAt: number;
    expiresAt: number;
    redeemedAt?: number;
    redeemedByMerchantUserId?: string;
    notes?: string;
    reservationName?: string; // Phase 4: Name for reservation
};

// TODO: Move to Supabase
// TODO: Move to Supabase
export type Analytics = {
    businessId: string;
    // Core metrics
    offerRedemptions: { offerId: string; timestamp: number; revenue: number }[];
    stampsIssued: { timestamp: number }[];
    rewardsRedeemed: { timestamp: number }[];

    // Advanced metrics (Top 20)
    impressions: { offerId: string; timestamp: number }[];
    clicks: { offerId: string; timestamp: number }[];
    newCustomers: number;
    returningCustomers: number;
    loyaltySignups: number;

    // Financials
    totalRevenue: number;
    totalDiscountCost: number;
};

export type DailyAnalytics = {
    date: string; // YYYY-MM-DD
    revenue: number;
    redemptions: number;
    impressions: number;
    clicks: number;
    newCustomers: number;
    returningCustomers: number;
    offers: {
        offerId: string;
        offerName: string;
        revenue: number;
        redemptions: number;
    }[];
};

// Phase 6: Merchant Profile
export type SubscriptionTier = "free" | "basic" | "premium";

export type MerchantProfile = {
    id: string;
    userId: string; // Links to auth user
    businessName: string;
    businessCategory: string;
    businessAddress: string;
    businessLogo?: string; // URL or base64
    contactEmail: string;
    contactPhone?: string;
    subscriptionTier: SubscriptionTier;
    merchantPin: string; // 4-6 digit PIN for scanner
    onboardingCompleted: boolean;
    createdAt: number;
    updatedAt: number;
};

export type SubscriptionLimits = {
    tier: SubscriptionTier;
    offersPerDay: number;
    features: {
        basicTargeting: boolean; // Location radius
        demographicsTargeting: boolean;
        ageTargeting: boolean;
        notifications: boolean;
        analytics: boolean;
    };
};

// Personalization Engine ("AI") Types
export type UserProfile = {
    userId: string;
    categoryWeights: Record<string, number>; // e.g. "coffee": 12
    businessWeights: Record<string, number>; // e.g. "b1": 5
    avgDistanceKm: number;
    lastUpdatedAt: number;
};

export type UserEvent = {
    id: string;
    userId: string;
    eventType: "impression" | "click" | "favourite" | "redeem" | "book";
    offerId?: string;
    businessId: string;
    category: string;
    distanceKm?: number;
    timestamp: number;
};

// Global in-memory store
// TODO: Replace with Supabase database

class Store {
    programs: Map<string, Program> = new Map();
    cards: Map<string, Card> = new Map();
    tokens: Map<string, Token> = new Map();

    // Phase 3 additions
    businesses: Map<string, Business> = new Map();
    offers: Map<string, Offer> = new Map();
    analytics: Map<string, Analytics> = new Map();
    redeemedTokens: Set<string> = new Set(); // Track redeemed tokens to prevent reuse

    // Phase 4 additions
    claims: Map<string, Claim> = new Map();

    // Phase 6 additions
    merchantProfiles: Map<string, MerchantProfile> = new Map();

    // Personalization Engine ("AI") additions
    userProfiles: Map<string, UserProfile> = new Map();
    userEvents: Map<string, UserEvent> = new Map();



    constructor() {
        // Initialize with a default program
        this.programs.set("default", {
            id: "default",
            name: "Coffee Loyalty",
            stampsRequired: 10,
            limitOnePerDay: false,
        });

        // Initialize Default User Profile (user_123) for simple MVP
        this.userProfiles.set("user_123", {
            userId: "user_123",
            categoryWeights: {},
            businessWeights: {},
            avgDistanceKm: 2.0,
            lastUpdatedAt: Date.now(),
        });

        // Add sample offers for map display
        const now = Date.now();
        const oneWeekLater = now + 7 * 24 * 60 * 60 * 1000;
        const tomorrow = now + 24 * 60 * 60 * 1000;

        // Generate offers for generated businesses
        MOCK_BUSINESSES.forEach((b) => {
            if (b.id.startsWith("gen_b_")) {
                const offerId = `offer_${b.id}`;
                this.offers.set(offerId, {
                    id: offerId,
                    businessId: b.id,
                    title: `Special Deal at ${b.name}`,
                    description: `Get 20% off all items at ${b.name}. Limited time only!`,
                    discountType: "percent",
                    value: 20,
                    startsAt: now,
                    endsAt: oneWeekLater,
                    radiusMeters: 5000,
                    isActive: true,
                    redemptionCount: 0,
                    inventory: 50,
                    bookingRequired: true,
                    claimedCount: 0,
                    productType: b.category.toLowerCase(),
                    imageUrl: "",
                });
            }
        });

        // Offer for Brew Haven (b1)
        this.offers.set("offer1", {
            id: "offer1",
            businessId: "b1",
            title: "50% Off Coffee",
            description: "Get half off any specialty coffee drink",
            discountType: "percent",
            value: 50,
            startsAt: now,
            endsAt: oneWeekLater,
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 100,
            bookingRequired: true,
            claimedCount: 5,
            productType: "food",
            imageUrl: "",
        });

        // Offer for The Burger Joint (b2)
        this.offers.set("offer2", {
            id: "offer2",
            businessId: "b2",
            title: "$5 Off Burgers",
            description: "Save $5 on any burger combo",
            discountType: "fixed",
            value: 5,
            startsAt: now,
            endsAt: oneWeekLater,
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 100,
            bookingRequired: true,
            claimedCount: 8,
            productType: "food",
            imageUrl: "",
        });

        // Offer for Style Studio (b3)
        this.offers.set("offer3", {
            id: "offer3",
            businessId: "b3",
            title: "30% Off Haircuts",
            description: "Premium haircut and styling at 30% off",
            discountType: "percent",
            value: 30,
            startsAt: now,
            endsAt: oneWeekLater,
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 100,
            bookingRequired: true,
            claimedCount: 3,
            productType: "service",
            imageUrl: "",
        });

        // Offer for Zen Spa (b4)
        this.offers.set("offer4", {
            id: "offer4",
            businessId: "b4",
            title: "20% Off Massage",
            description: "Relax with 20% off any 60-minute massage",
            discountType: "percent",
            value: 20,
            startsAt: now,
            endsAt: oneWeekLater,
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 100,
            bookingRequired: true,
            claimedCount: 1,
            productType: "service",
            imageUrl: "",
        });

        // Offer for Cinema Paradiso (b5)
        this.offers.set("offer5", {
            id: "offer5",
            businessId: "b5",
            title: "Buy 1 Get 1 Free Ticket",
            description: "Buy one movie ticket, get one free for any showing",
            discountType: "bundle",
            value: 100, // 100% off second item effectively
            startsAt: now,
            endsAt: oneWeekLater,
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 100,
            bookingRequired: true,
            claimedCount: 12,
            productType: "entertainment",
            imageUrl: "",
        });

        // Offer for Brew Haven (b1) - Another offer
        this.offers.set("offer6", {
            id: "offer6",
            businessId: "b1",
            title: "Free Pastry with Coffee",
            description: "Get a free pastry when you buy any large coffee",
            discountType: "fixed", // Or bundle
            value: 5, // Approximate value
            startsAt: now,
            endsAt: oneWeekLater,
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 15,
            bookingRequired: true,
            claimedCount: 4,
            productType: "food",
            imageUrl: "",
        });

        // NEW SERVICE OFFERS for diversity

        // Serenity Spa & Massage (b10)
        this.offers.set("offer10", {
            id: "offer10",
            businessId: "b10",
            title: "30% Off Deep Tissue Massage",
            description: "Relieve tension with our signature deep tissue treatment",
            discountType: "percent",
            value: 30,
            startsAt: now,
            endsAt: tomorrow,
            radiusMeters: 3000,
            isActive: true,
            redemptionCount: 0,
            inventory: 6,
            bookingRequired: true,
            claimedCount: 2,
            productType: "wellness",
            imageUrl: "",
        });

        // Urban Wellness Spa (b11)
        this.offers.set("offer11", {
            id: "offer11",
            businessId: "b11",
            title: "Facial + Massage Combo - $99",
            description: "60min facial + 30min massage. Save $40!",
            discountType: "fixed",
            value: 40,
            startsAt: now,
            endsAt: oneWeekLater,
            radiusMeters: 3000,
            isActive: true,
            redemptionCount: 0,
            inventory: 8,
            bookingRequired: true,
            claimedCount: 1,
            productType: "wellness",
            imageUrl: "",
        });

        // Glamour Beauty Bar (b12)
        this.offers.set("offer12", {
            id: "offer12",
            businessId: "b12",
            title: "25% Off Gel Nails",
            description: "Perfect nails for any occasion",
            discountType: "percent",
            value: 25,
            startsAt: now,
            endsAt: tomorrow,
            radiusMeters: 2000,
            isActive: true,
            redemptionCount: 0,
            inventory: 10,
            bookingRequired: true,
            claimedCount: 3,
            productType: "beauty",
            imageUrl: "",
        });

        // FitZone Studio (b13)
        this.offers.set("offer13", {
            id: "offer13",
            businessId: "b13",
            title: "Free Week Trial Pass",
            description: "Try unlimited classes for 7 days",
            discountType: "fixed",
            value: 50,
            startsAt: now,
            endsAt: oneWeekLater,
            radiusMeters: 4000,
            isActive: true,
            redemptionCount: 0,
            inventory: 15,
            bookingRequired: true,
            claimedCount: 4,
            productType: "fitness",
            imageUrl: "",
        });

        // Luxe Hair Lounge (b14)
        this.offers.set("offer14", {
            id: "offer14",
            businessId: "b14",
            title: "20% Off Haircut & Style",
            description: "Premium cuts with expert stylists",
            discountType: "percent",
            value: 20,
            startsAt: now,
            endsAt: tomorrow,
            radiusMeters: 2500,
            isActive: true,
            redemptionCount: 0,
            inventory: 12,
            bookingRequired: true,
            claimedCount: 5,
            productType: "beauty",
            imageUrl: "",
        });

        // Zen Wellness Center (b15)
        this.offers.set("offer15", {
            id: "offer15",
            businessId: "b15",
            title: "50% Off First Yoga Class",
            description: "New to yoga? Try your first class half price",
            discountType: "percent",
            value: 50,
            startsAt: now,
            endsAt: oneWeekLater,
            radiusMeters: 3000,
            isActive: true,
            redemptionCount: 0,
            inventory: 20,
            bookingRequired: true,
            claimedCount: 2,
            productType: "wellness",
            imageUrl: "",
        });

        // Mock Paused Offers for testing
        this.offers.set("offer_paused_1", {
            id: "offer_paused_1",
            businessId: "b1",
            title: "Seasonal Pumpkin Spice Latte",
            description: "Limited time autumn special",
            discountType: "percent",
            value: 20,
            startsAt: now - 30 * 24 * 60 * 60 * 1000, // Started last month
            endsAt: now - 1 * 24 * 60 * 60 * 1000, // Ended yesterday
            radiusMeters: 5000,
            isActive: false, // PAUSED
            redemptionCount: 45,
            inventory: 0,
            bookingRequired: false,
            claimedCount: 45,
            productType: "food",
            imageUrl: "",
        });

        this.offers.set("offer_paused_2", {
            id: "offer_paused_2",
            businessId: "b1",
            title: "Summer Iced Tea BOGO",
            description: "Buy one get one free on all iced teas",
            discountType: "bundle",
            value: 100,
            startsAt: now - 90 * 24 * 60 * 60 * 1000,
            endsAt: now - 60 * 24 * 60 * 60 * 1000,
            radiusMeters: 5000,
            isActive: false, // PAUSED
            redemptionCount: 120,
            inventory: 0,
            bookingRequired: false,
            claimedCount: 120,
            productType: "food",
            imageUrl: "",
        });



        // --- TIME-BASED MOCK OFFERS FOR FILTER TESTING ---
        const today = new Date();
        const setTime = (h: number) => {
            const d = new Date(today);
            d.setHours(h, 0, 0, 0);
            return d.getTime();
        };

        // Matcha Offer for Search Testing
        this.offers.set("offer_matcha", {
            id: "offer_matcha",
            businessId: "b1", // Brew Haven
            title: "Iced Matcha Latte",
            description: "Premium ceremonial grade matcha with oat milk",
            discountType: "percent",
            value: 20,
            startsAt: setTime(6), // 6 AM
            endsAt: setTime(23), // 11 PM
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 30,
            bookingRequired: true,
            claimedCount: 0,
            productType: "food",
            imageUrl: "",
        });

        // --- NEW OFFERS FOR SEARCH TESTING ---

        // Sushi Sensation (b16)
        this.offers.set("offer_sushi", {
            id: "offer_sushi",
            businessId: "b16",
            title: "All You Can Eat Sushi",
            description: "Unlimited sushi and sashimi for lunch.",
            discountType: "fixed",
            value: 35,
            startsAt: setTime(11),
            endsAt: setTime(15),
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 20,
            bookingRequired: true,
            claimedCount: 0,
            productType: "food",
            imageUrl: "",
        });

        // Yoga Flow Studio (b17)
        this.offers.set("offer_yoga", {
            id: "offer_yoga",
            businessId: "b17",
            title: "Free First Class",
            description: "New students try their first class for free.",
            discountType: "percent",
            value: 100,
            startsAt: setTime(6),
            endsAt: setTime(20),
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 50,
            bookingRequired: true,
            claimedCount: 0,
            productType: "wellness",
            imageUrl: "",
        });

        // The Book Nook (b18)
        this.offers.set("offer_books", {
            id: "offer_books",
            businessId: "b18",
            title: "Buy 2 Get 1 Free",
            description: "On all paperback fiction.",
            discountType: "bundle",
            value: 100,
            startsAt: setTime(9),
            endsAt: setTime(17),
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 100,
            bookingRequired: false,
            claimedCount: 0,
            productType: "retail",
            imageUrl: "",
        });

        // Taco Fiesta (b19)
        this.offers.set("offer_tacos", {
            id: "offer_tacos",
            businessId: "b19",
            title: "$2 Taco Tuesday",
            description: "All tacos are $2 all day.",
            discountType: "fixed",
            value: 2,
            startsAt: setTime(11),
            endsAt: setTime(22),
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 200,
            bookingRequired: false,
            claimedCount: 0,
            productType: "food",
            imageUrl: "",
        });

        // Iron Gym (b20)
        this.offers.set("offer_gym", {
            id: "offer_gym",
            businessId: "b20",
            title: "No Joining Fee",
            description: "Save $99 when you join this week.",
            discountType: "fixed",
            value: 99,
            startsAt: setTime(0),
            endsAt: setTime(23),
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 50,
            bookingRequired: true,
            claimedCount: 0,
            productType: "fitness",
            imageUrl: "",
        });

        // Pizza Palace (b21)
        this.offers.set("offer_pizza", {
            id: "offer_pizza",
            businessId: "b21",
            title: "Large Pizza for $10",
            description: "Any traditional pizza for just $10.",
            discountType: "fixed",
            value: 10,
            startsAt: setTime(17),
            endsAt: setTime(23),
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 100,
            bookingRequired: true,
            claimedCount: 0,
            productType: "food",
            imageUrl: "",
        });

        // Breakfast (6am - 11am)
        this.offers.set("offer_breakfast", {
            id: "offer_breakfast",
            businessId: "b1", // Brew Haven
            title: "Early Bird Breakfast Special",
            description: "Half price croissant with any coffee before 11am",
            discountType: "fixed",
            value: 5,
            startsAt: setTime(7), // 7:00 AM today
            endsAt: setTime(10), // 10:00 AM today
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 50,
            bookingRequired: true,
            claimedCount: 0,
            productType: "food",
            imageUrl: "",
        });

        // Lunch (11am - 3pm)
        this.offers.set("offer_lunch", {
            id: "offer_lunch",
            businessId: "b2", // The Burger Joint
            title: "Lunch Rush Burger Deal",
            description: "$10 Burger & Drink Combo",
            discountType: "fixed",
            value: 10,
            startsAt: setTime(11), // 11:00 AM today
            endsAt: setTime(14), // 2:00 PM today
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 50,
            bookingRequired: true,
            claimedCount: 0,
            productType: "food",
            imageUrl: "",
        });

        // Afternoon (3pm - 6pm)
        this.offers.set("offer_afternoon", {
            id: "offer_afternoon",
            businessId: "b1", // Brew Haven
            title: "Afternoon Pick-Me-Up",
            description: "2-for-1 Pastries",
            discountType: "bundle",
            value: 100,
            startsAt: setTime(15), // 3:00 PM today
            endsAt: setTime(17), // 5:00 PM today
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 50,
            bookingRequired: true,
            claimedCount: 0,
            productType: "food",
            imageUrl: "",
        });

        // Dinner (6pm - 10pm)
        this.offers.set("offer_dinner", {
            id: "offer_dinner",
            businessId: "b2", // The Burger Joint
            title: "Dinner Feast for Two",
            description: "2 Burgers, 2 Fries, 2 Drinks for $30",
            discountType: "fixed",
            value: 15,
            startsAt: setTime(18), // 6:00 PM today
            endsAt: setTime(21), // 9:00 PM today
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 50,
            bookingRequired: true,
            claimedCount: 0,
            productType: "food",
            imageUrl: "",
        });

        // Late Night (10pm - 6am)
        this.offers.set("offer_latenight", {
            id: "offer_latenight",
            businessId: "b5", // Cinema Paradiso (Entertainment/Late)
            title: "Midnight Movie Madness",
            description: "Half price tickets for late showings",
            discountType: "percent",
            value: 50,
            startsAt: setTime(22), // 10:00 PM today
            endsAt: setTime(26), // 2:00 AM tomorrow (handle overflow logic in filter if needed, or just set to 2am next day)
            radiusMeters: 5000,
            isActive: true,
            redemptionCount: 0,
            inventory: 50,
            bookingRequired: true,
            claimedCount: 0,
            productType: "entertainment",
            imageUrl: "",
        });
    }

    // Helper: Generate 4-6 digit PIN
    generatePin(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    // Helper: Get subscription limits
    getSubscriptionLimits(tier: SubscriptionTier): SubscriptionLimits {
        const limits: Record<SubscriptionTier, SubscriptionLimits> = {
            free: {
                tier: "free",
                offersPerDay: 1,
                features: {
                    basicTargeting: true,
                    demographicsTargeting: false,
                    ageTargeting: false,
                    notifications: false,
                    analytics: false,
                },
            },
            basic: {
                tier: "basic",
                offersPerDay: 5,
                features: {
                    basicTargeting: true,
                    demographicsTargeting: true,
                    ageTargeting: false,
                    notifications: false,
                    analytics: true,
                },
            },
            premium: {
                tier: "premium",
                offersPerDay: 999,
                features: {
                    basicTargeting: true,
                    demographicsTargeting: true,
                    ageTargeting: true,
                    notifications: true,
                    analytics: true,
                },
            },
        };
        return limits[tier];
    }

    // Helper: Track analytics
    trackEvent(businessId: string, type: "offer" | "stamp" | "reward" | "impression" | "click", offerId?: string, revenue: number = 0) {
        if (!this.analytics.has(businessId)) {
            this.analytics.set(businessId, {
                businessId,
                offerRedemptions: [],
                stampsIssued: [],
                rewardsRedeemed: [],
                impressions: [],
                clicks: [],
                newCustomers: 0,
                returningCustomers: 0,
                loyaltySignups: 0,
                totalRevenue: 0,
                totalDiscountCost: 0,
            });
        }
        const analytics = this.analytics.get(businessId)!;
        const timestamp = Date.now();

        if (type === "offer" && offerId) {
            analytics.offerRedemptions.push({ offerId, timestamp, revenue });
            analytics.totalRevenue += revenue;
        } else if (type === "stamp") {
            analytics.stampsIssued.push({ timestamp });
        } else if (type === "reward") {
            analytics.rewardsRedeemed.push({ timestamp });
        } else if (type === "impression" && offerId) {
            analytics.impressions.push({ offerId, timestamp });
        } else if (type === "click" && offerId) {
            analytics.clicks.push({ offerId, timestamp });
        }
    }

    // Helper: Generate mock advanced analytics
    getAdvancedAnalytics(businessId: string, startDate?: number, endDate?: number): { overview: any; calendar: any[] } {
        // Mock data for demonstration
        const calendar = [];
        const now = new Date();

        // Default to 30 days if not specified
        const end = endDate ? new Date(endDate) : now;
        const start = startDate ? new Date(startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Calculate days difference
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        let totalRevenue = 0;
        let totalRedemptions = 0;
        let totalImpressions = 0;
        let totalClicks = 0;

        for (let i = 0; i <= days; i++) {
            const date = new Date(end);
            date.setDate(date.getDate() - i);

            if (date < start) break;

            const dateStr = date.toISOString().split('T')[0];

            const dailyRevenue = Math.floor(Math.random() * 500);
            const dailyRedemptions = Math.floor(Math.random() * 20);
            const dailyImpressions = Math.floor(Math.random() * 200);
            const dailyClicks = Math.floor(Math.random() * 50);

            totalRevenue += dailyRevenue;
            totalRedemptions += dailyRedemptions;
            totalImpressions += dailyImpressions;
            totalClicks += dailyClicks;

            calendar.push({
                date: dateStr,
                revenue: dailyRevenue,
                redemptions: dailyRedemptions,
                impressions: dailyImpressions,
                clicks: dailyClicks,
                newCustomers: Math.floor(dailyRedemptions * 0.3),
                returningCustomers: Math.floor(dailyRedemptions * 0.7),
                offers: [
                    { offerId: "1", offerName: "50% Off Coffee", revenue: dailyRevenue * 0.6, redemptions: Math.floor(dailyRedemptions * 0.6) },
                    { offerId: "2", offerName: "Free Muffin", revenue: dailyRevenue * 0.4, redemptions: Math.floor(dailyRedemptions * 0.4) }
                ]
            });
        }

        return {
            overview: {
                totalImpressions,
                totalClicks,
                totalRedemptions,
                conversionRate: totalImpressions > 0 ? ((totalRedemptions / totalImpressions) * 100).toFixed(1) : "0.0",
                totalRevenue,
                aov: totalRedemptions > 0 ? (totalRevenue / totalRedemptions).toFixed(2) : "0.00",
                newVsReturning: "30% / 70%",
                roi: "450%",
                costOfDiscounts: Math.floor(totalRevenue * 0.2),
                netRevenue: Math.floor(totalRevenue * 0.8),
                loyaltySignups: Math.floor(days * 1.5),
                rewardsRedeemed: Math.floor(days * 0.4),
            },
            calendar: calendar.reverse()
        };
    }
}

// Singleton instance
// Singleton pattern with global persistence for development hot-reloads
const globalStore = global as unknown as { store: Store };
export const store = globalStore.store || new Store();
if (process.env.NODE_ENV !== 'production') globalStore.store = store;
