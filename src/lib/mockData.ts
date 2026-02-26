export type Business = {
    id: string;
    name: string;
    category: string;
    description: string;
    address: string;
    lat: number;
    lng: number;
    image: string;
    rating: number;
    distance?: string; // Calculated on client
};

export type Offer = {
    id: string;
    businessId: string;
    title: string;
    description: string;
    // Enhanced fields to match store.ts
    discountType: "percent" | "fixed" | "bundle";
    value: number;
    startsAt?: number;
    endsAt?: number;
    expiresAt?: number; // Legacy support
    radiusMeters?: number;
    isActive?: boolean;
    redemptionCount?: number;
    inventory?: number;
    bookingRequired?: boolean;
    claimedCount?: number;
    productType?: string;
    imageUrl?: string;
    originalPrice?: number;
    type?: "DISCOUNT" | "FREE_ITEM" | "BOGO"; // Legacy support
};

export const CATEGORIES = [
    "Food",
    "Coffee",
    "Drinks",
    "Wellness",
    "Beauty",
    "Fitness",
    "Retail",
    "Entertainment",
];

// --- GENERATE 100+ MOCK BUSINESSES FOR SEARCH TESTING ---
const ADJECTIVES = ["Happy", "Golden", "Urban", "Royal", "Green", "Blue", "Red", "Silver", "Modern", "Classic", "Elite", "Prime", "Cozy", "Fresh", "Tasty", "Quick", "Super", "Mega", "Ultra", "Hyper"];
const NOUNS = ["Panda", "Dragon", "Tiger", "Lion", "Eagle", "Shark", "Whale", "Dolphin", "Bear", "Wolf", "Fox", "Cat", "Dog", "Rabbit", "Mouse", "Horse", "Cow", "Pig", "Sheep", "Goat"];
const SUFFIXES = ["Cafe", "Bistro", "Grill", "Diner", "Lounge", "Bar", "Pub", "Club", "Spa", "Salon", "Studio", "Gym", "Store", "Shop", "Mart", "Market", "Plaza", "Center", "Hub", "Spot"];
const STREETS = ["Murray St", "Hay St", "William St", "Barrack St", "Wellington St", "St Georges Tce", "Adelaide Tce", "James St", "Lake St", "Roe St"];

const generateMockBusinesses = (count: number): Business[] => {
    const businesses: Business[] = [];
    for (let i = 0; i < count; i++) {
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
        const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
        const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
        const street = STREETS[Math.floor(Math.random() * STREETS.length)];

        // Center on Perth but spread out towards Subiaco, Highgate, Fremantle, and the Coast
        const lat = -31.9505 + (Math.random() - 0.5) * 0.25;
        const lng = 115.8605 + (Math.random() - 0.5) * 0.3;

        businesses.push({
            id: `gen_b_${i}`,
            name: `${adj} ${noun} ${suffix}`,
            category: category,
            description: `A unique ${category.toLowerCase()} experience in the heart of our community.`,
            address: `${Math.floor(Math.random() * 500) + 1} ${street}, Perth WA`,
            lat: lat,
            lng: lng,
            image: `https://images.unsplash.com/photo-${[
                '1554118811-1e0d58224f24', // Coffee
                '1555396273-367ea4eb4db5', // Restaurant
                '1559339352-11d035aa65de', // Beauty
                '1534438327276-14e5300c3a48', // Gym
                '1441986300917-64674bd600d8', // Retail
                '1506126613408-eca07ce68773'  // Wellness
            ][Math.floor(Math.random() * 6)]}?w=800&q=80`,
            rating: 3.8 + Math.random() * 1.2,
        });
    }
    return businesses;
};

export const MOCK_BUSINESSES: Business[] = [
    ...generateMockBusinesses(100), // Generate 100 random businesses
    {
        id: "b1",
        name: "Brew Haven",
        category: "Coffee",
        description: "Artisanal coffee and pastries.",
        address: "123 Murray St, Perth CBD",
        lat: -31.9523,
        lng: 115.8613,
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
        rating: 4.8,
    },
    {
        id: "b2",
        name: "The Burger Joint",
        category: "Food",
        description: "Best burgers in town.",
        address: "456 William St, Northbridge",
        lat: -31.9400, // ~2km away
        lng: 115.8500,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        rating: 4.5,
    },
    {
        id: "b3",
        name: "Urban Threads",
        category: "Retail",
        description: "Modern fashion for everyone.",
        address: "789 Hay St, Perth",
        lat: -31.9550,
        lng: 115.8580,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        rating: 4.2,
    },
    {
        id: "b4",
        name: "Zen Spa",
        category: "Wellness", // Was Services
        description: "Relax and rejuvenate.",
        address: "101 Barrack St, Perth",
        lat: -31.9800, // ~4km away (South Perth/Como)
        lng: 115.8700,
        image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80",
        rating: 4.9,
    },
    {
        id: "b5",
        name: "Cinema Paradiso",
        category: "Entertainment",
        description: "Classic movies and popcorn.",
        address: "202 James St, Northbridge",
        lat: -32.0500, // ~12km away (Fremantle area)
        lng: 115.7500,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
        rating: 4.4,
    },
    {
        id: "b10",
        name: "Serenity Spa & Massage",
        category: "Wellness", // Was Massage
        description: "Therapeutic massage and relaxation treatments.",
        address: "88 St Georges Terrace, Perth CBD",
        lat: -31.9540,
        lng: 115.8585,
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
        rating: 4.9,
    },
    {
        id: "b11",
        name: "Urban Wellness Spa",
        category: "Wellness", // Was Spa
        description: "Full-service spa with facials, massages, and body treatments.",
        address: "125 St Georges Terrace, Perth CBD",
        lat: -31.9300, // ~3km away (Highgate/Mt Lawley)
        lng: 115.8800,
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
        rating: 4.8,
    },
    {
        id: "b12",
        name: "Glamour Beauty Bar",
        category: "Beauty",
        description: "Nails, lashes, brows, and makeup services.",
        address: "45 Hay Street, Perth CBD",
        lat: -31.9520,
        lng: 115.8600,
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
        rating: 4.7,
    },
    {
        id: "b13",
        name: "FitZone Studio",
        category: "Fitness",
        description: "Boutique fitness classes and personal training.",
        address: "200 Murray Street, Perth CBD",
        lat: -31.9530,
        lng: 115.8620,
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
        rating: 4.6,
    },
    {
        id: "b14",
        name: "Luxe Hair Lounge",
        category: "Beauty", // Was Hair Salon
        description: "Premium cuts, colors, and styling.",
        address: "75 Barrack Street, Perth CBD",
        lat: -31.9900, // ~5-6km away
        lng: 115.8200,
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
        rating: 4.8,
    },
    {
        id: "b15",
        name: "Zen Wellness Center",
        category: "Wellness",
        description: "Yoga, meditation, and holistic wellness programs.",
        address: "150 William Street, Perth CBD",
        lat: -31.9515,
        lng: 115.8595,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
        rating: 4.9,
    },
    // NEW MOCK BUSINESSES FOR SEARCH TESTING
    {
        id: "b16",
        name: "Sushi Sensation",
        category: "Food",
        description: "Authentic Japanese sushi and sashimi.",
        address: "100 James St, Northbridge",
        lat: -31.9480,
        lng: 115.8550,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
        rating: 4.7,
    },
    {
        id: "b17",
        name: "Yoga Flow Studio",
        category: "Wellness",
        description: "Find your inner peace with our flow classes.",
        address: "50 Hay St, Subiaco",
        lat: -31.9450,
        lng: 115.8250,
        image: "https://images.unsplash.com/photo-1599447421405-0753f5d10949?w=800&q=80",
        rating: 4.9,
    },
    {
        id: "b18",
        name: "The Book Nook",
        category: "Retail",
        description: "Cozy bookstore with a wide selection.",
        address: "200 Murray St, Perth",
        lat: -31.9525,
        lng: 115.8615,
        image: "https://images.unsplash.com/photo-1507842217121-9e962835bf6e?w=800&q=80",
        rating: 4.8,
    },
    {
        id: "b19",
        name: "Taco Fiesta",
        category: "Food",
        description: "Authentic Mexican street food.",
        address: "123 William St, Northbridge",
        lat: -31.9490,
        lng: 115.8580,
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
        rating: 4.6,
    },
    {
        id: "b20",
        name: "Iron Gym",
        category: "Fitness",
        description: "24/7 gym with top-tier equipment.",
        address: "300 Wellington St, Perth",
        lat: -31.9500,
        lng: 115.8600,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
        rating: 4.5,
    },
    {
        id: "b21",
        name: "Pizza Palace",
        category: "Food",
        description: "Wood-fired pizzas made with love.",
        address: "88 James St, Northbridge",
        lat: -31.9470,
        lng: 115.8560,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
        rating: 4.7,
    },
];

export const MOCK_OFFERS: Offer[] = [
    {
        id: "o1",
        businessId: "b1",
        title: "50% Off Latte",
        description: "Get half off any latte between 2pm and 4pm.",
        expiresAt: Date.now() + 3600 * 1000 * 2, // 2 hours from now
        type: "DISCOUNT",
        discountType: "percent",
        value: 50,
        startsAt: Date.now(),
        endsAt: Date.now() + 3600 * 1000 * 2,
        isActive: true,
        inventory: 100,
        claimedCount: 5,
        bookingRequired: true,
    },
    {
        id: "o2",
        businessId: "b2",
        title: "Free Fries",
        description: "Free fries with any burger purchase.",
        expiresAt: Date.now() + 3600 * 1000 * 5, // 5 hours from now
        type: "FREE_ITEM",
        discountType: "fixed",
        value: 5,
        startsAt: Date.now(),
        endsAt: Date.now() + 3600 * 1000 * 5,
        isActive: true,
        inventory: 200,
        claimedCount: 20,
        bookingRequired: false,
    },
    {
        id: "o3",
        businessId: "b4",
        title: "Buy 1 Get 1 Massage",
        description: "Bring a friend and get a free massage.",
        expiresAt: Date.now() + 3600 * 1000 * 24, // 24 hours from now
        type: "BOGO",
        discountType: "bundle",
        value: 100,
        startsAt: Date.now(),
        endsAt: Date.now() + 3600 * 1000 * 24,
        isActive: true,
        inventory: 10,
        claimedCount: 1,
        bookingRequired: true,
    },
];
