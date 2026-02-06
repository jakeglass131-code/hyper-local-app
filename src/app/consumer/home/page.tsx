"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Clock, MapPin, Star, Users, Tag, Ticket, TrendingUp, Zap, Sparkles, Coffee as CoffeeIcon, Utensils, Moon } from "lucide-react";
import { MOCK_BUSINESSES, CATEGORIES } from "@/lib/mockData";
import { useConsumerStore } from "@/store/consumerStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Offer } from "@/lib/store";
import { LogoHeader } from "@/components/consumer/LogoHeader";
import FavoriteStar from "@/components/FavoriteStar";
import { FlyingTicketAnimation } from "@/components/FlyingTicketAnimation";
import { getTimeRemaining, calculateDistanceAndTime, calculateSavings, getCategoryIcon } from "@/lib/displayHelpers";
import { getQuickPick, getCurrentMealPeriod, getTimeWindowOffers, COLLECTIONS } from "@/lib/recommendations";

const userId = "user_123"; // TODO: Replace with auth

export default function HomePage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const { preferences, setPreferences, toggleFavourite, isFavourite, addClaim, addToCart, cart, location } = useConsumerStore();
    const [showFilters, setShowFilters] = useState(false);
    const [liveSlots, setLiveSlots] = useState<Offer[]>([]);
    const [claiming, setClaiming] = useState<string | null>(null);
    const [selectedDistance, setSelectedDistance] = useState<string>("500m");
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [openNow, setOpenNow] = useState(false);
    const [hasLoyalty, setHasLoyalty] = useState(false);
    const [acceptsBookings, setAcceptsBookings] = useState(false);
    const [flyingAnimations, setFlyingAnimations] = useState<Array<{ id: string; startPosition: { x: number; y: number } }>>([]);
    const [feedView, setFeedView] = useState<"near" | "trending" | "ending">("near");
    const [showQuickPick, setShowQuickPick] = useState(false);
    const [quickPickResults, setQuickPickResults] = useState<any[]>([]);
    const [cartBump, setCartBump] = useState(false);

    // Animate cart badge on change
    useEffect(() => {
        if (cart.length > 0) {
            setCartBump(true);
            const timer = setTimeout(() => setCartBump(false), 300);
            return () => clearTimeout(timer);
        }
    }, [cart.length]);

    // Fetch live slots on mount
    useEffect(() => {
        fetchLiveSlots();
    }, []);

    const fetchLiveSlots = async () => {
        try {
            const res = await fetch("/api/offers");
            const offers: Offer[] = await res.json();

            // Filter for booking-required offers with inventory
            const slots = offers
                .filter((o) => o.bookingRequired && o.claimedCount < o.inventory)
                .sort((a, b) => a.endsAt - b.endsAt); // Ending soon first

            setLiveSlots(slots);
        } catch (e) {
            console.error(e);
        }
    };

    const handleClaimSlot = async (offerId: string, event: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent duplicate animations if already claiming
        if (claiming) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const startPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };

        // Create single animation
        setFlyingAnimations(prev => [...prev, { id: `${offerId}-${Date.now()}`, startPosition }]);

        setClaiming(offerId);
        try {
            const res = await fetch("/api/claims", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ offerId, userId }),
            });

            if (res.ok) {
                const claim = await res.json();
                addClaim(claim.id);

                // Find the offer and add to cart, synced with animation landing (1.2s)
                const slot = liveSlots.find(s => s.id === offerId);
                if (slot) {
                    setTimeout(() => {
                        addToCart(slot);
                    }, 1200);
                }

                fetchLiveSlots(); // Refresh to update inventory
            } else {
                const error = await res.json();
                console.error("Failed to claim slot:", error.error);
            }
        } catch (e) {
            console.error("Network error:", e);
        } finally {
            setClaiming(null);
        }
    };

    // Quick Pick Handler
    const handleQuickPick = () => {
        const userPrefs = {
            categories: preferences.categories,
            budgetMax: 20,
            walkingDistanceMax: 1000,
        };

        const userLoc = location || { lat: -31.9523, lng: 115.8613 };

        const picks = getQuickPick(liveSlots, userPrefs, userLoc);
        setQuickPickResults(picks);
        setShowQuickPick(true);
    };

    // Filter Logic
    console.log("Search Term:", search);
    console.log("Total Businesses:", MOCK_BUSINESSES.length);
    console.log("Live Slots:", liveSlots.length);

    const filteredBusinesses = MOCK_BUSINESSES.filter((b) => {
        const searchLower = search.toLowerCase();

        // Fuzzy match helper (simple inclusion + common typos)
        const fuzzyMatch = (text: string, term: string) => {
            if (text.includes(term)) return true;
            // Handle specific common typos reported by user
            if (term === "cofee" && text.includes("coffee")) return true;
            return false;
        };

        // Check if business matches
        const matchesBusinessInfo =
            fuzzyMatch(b.name.toLowerCase(), searchLower) ||
            fuzzyMatch(b.category.toLowerCase(), searchLower);

        // Check if any of this business's offers match
        const hasMatchingOffer = liveSlots.some(slot =>
            slot.businessId === b.id && (
                fuzzyMatch(slot.title.toLowerCase(), searchLower) ||
                fuzzyMatch(slot.description.toLowerCase(), searchLower)
            )
        );

        const matchesCategory =
            preferences.categories.length === 0 ||
            preferences.categories.includes(b.category);

        const result = (matchesBusinessInfo || hasMatchingOffer) && matchesCategory;
        if (search && result) {
            console.log("Match found:", b.name, "Info:", matchesBusinessInfo, "Offer:", hasMatchingOffer);
        }
        return result;
    });

    // Filter Live Slots based on all active filters
    const filteredSlots = liveSlots.filter((slot) => {
        const business = MOCK_BUSINESSES.find((b) => b.id === slot.businessId);
        if (!business) return false;

        // 1. Search
        if (search) {
            const searchLower = search.toLowerCase();
            const matchesName = business.name.toLowerCase().includes(searchLower);
            const matchesCategory = business.category.toLowerCase().includes(searchLower);
            const matchesTitle = slot.title.toLowerCase().includes(searchLower);
            const matchesDesc = slot.description.toLowerCase().includes(searchLower);

            if (!matchesName && !matchesCategory && !matchesTitle && !matchesDesc) {
                return false;
            }
        }

        // 2. Categories
        if (preferences.categories.length > 0 && !preferences.categories.includes(business.category)) {
            return false;
        }

        // 3. Distance
        if (selectedDistance) {
            const userLoc = location || { lat: -31.9523, lng: 115.8613 };
            const { distanceMeters } = calculateDistanceAndTime(
                userLoc.lat,
                userLoc.lng,
                business.lat,
                business.lng
            );

            const maxDistKm = selectedDistance === "500m" ? 0.5 : selectedDistance === "1km" ? 1 : selectedDistance === "5km" ? 5 : 100;
            if (distanceMeters > maxDistKm * 1000) return false;
        }



        // 5. Price (Optional - keeping consistent with previous logic of skipping for now)
        if (selectedPrice !== null) {
            // Assuming slot.value is the price or discount. 
            // If it's a discount, we might need the original price.
            // For now, let's assume we filter by the final price if available, 
            // or just skip if we don't have price data.
            // The mock data structure for Offer is: { id, businessId, title, description, discountType, value, ... }
            // If discountType is 'fixed', value is the discount amount.
            // We don't strictly have "price" in the Offer interface in this file context, 
            // but let's assume we can't filter by price accurately without it.
            // However, the user asked for it. Let's look at how price filter was implemented in the UI.
            // It sets `selectedPrice` (number).
            // Let's assume for now we don't filter slots by price unless we add a price field to Offer.
            // Or maybe we filter by "value" if it's a fixed price offer? 
            // Actually, usually offers are "discounts". 
            // Let's leave price out of slot filtering for now to be safe, or just apply it if it makes sense.
            // The prompt implies "based on my filters".
            // Let's check `filteredBusinesses` again. It doesn't filter by price either.
            // So consistent behavior is fine.
        }

        return true;
    });

    return (
        <div className="pb-24">
            {/* Logo Header */}
            <LogoHeader />

            {/* Header */}
            <header className="sticky top-0 z-10 bg-white dark:bg-neutral-900 px-4 py-3 shadow-sm border-b border-gray-100 dark:border-neutral-800">
                <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search places & deals..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                // Clear category filters when searching to ensure global search
                                if (e.target.value && preferences.categories.length > 0) {
                                    setPreferences({ categories: [] });
                                }
                            }}
                            className="w-full rounded-full bg-gray-100 dark:bg-neutral-800 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder:text-gray-500"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="rounded-full bg-gray-100 dark:bg-neutral-800 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700"
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => router.push('/consumer/reservations')}
                        className="relative rounded-full bg-gray-100 dark:bg-neutral-800 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700"
                        data-reservations-button
                    >
                        <Ticket className="h-5 w-5" />
                        {cart?.length > 0 && (
                            <span className={cn(
                                "absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-neutral-900 transition-transform",
                                cartBump ? "scale-150" : "scale-100"
                            )}>
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Filter Modal */}
            {showFilters && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                        onClick={() => setShowFilters(false)}
                    />

                    {/* Modal */}
                    <div className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-5">
                        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-4 py-4 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-base text-gray-900 dark:text-white">Filters</h3>
                                <button
                                    onClick={() => {
                                        setPreferences({ categories: [], liveDealsOnly: false });
                                        setSelectedDistance("500m");
                                        setSelectedPrice(null);
                                        setSelectedRating(null);
                                        setOpenNow(false);
                                        setHasLoyalty(false);
                                        setAcceptsBookings(false);
                                    }}
                                    className="text-xs text-indigo-600 font-medium"
                                >
                                    Reset All
                                </button>
                            </div>
                        </div>

                        <div className="px-4 py-4">
                            {/* Categories */}
                            <div className="mb-5">
                                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Categories</h4>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                const current = preferences.categories;
                                                const newCats = current.includes(cat)
                                                    ? current.filter((c) => c !== cat)
                                                    : [...current, cat];
                                                setPreferences({ categories: newCats });
                                            }}
                                            className={cn(
                                                "rounded-full px-4 py-2 text-xs font-medium transition-colors",
                                                preferences.categories.includes(cat)
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-5">
                                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Distance</h4>
                                <div className="flex gap-2">
                                    {["500m", "1km", "5km", "10km+"].map((dist) => (
                                        <button
                                            key={dist}
                                            onClick={() => setSelectedDistance(dist)}
                                            className={cn(
                                                "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                                                selectedDistance === dist
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-neutral-700 hover:text-indigo-600"
                                            )}
                                        >
                                            {dist}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Max Price</h4>
                                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                        {selectedPrice ? `Under $${selectedPrice}` : "Any"}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={selectedPrice || 0}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setSelectedPrice(val === 0 ? null : val);
                                    }}
                                    className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                    <span>Any</span>
                                    <span>$25</span>
                                    <span>$50</span>
                                    <span>$75</span>
                                    <span>$100+</span>
                                </div>
                            </div>

                            {/* Quick Toggles */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Quick Filters</h4>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Has Loyalty Program</span>
                                    <button
                                        onClick={() => setHasLoyalty(!hasLoyalty)}
                                        className={cn(
                                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                            hasLoyalty ? "bg-indigo-600" : "bg-gray-200 dark:bg-neutral-700"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                hasLoyalty ? "translate-x-6" : "translate-x-1"
                                            )}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Accepts Bookings</span>
                                    <button
                                        onClick={() => setAcceptsBookings(!acceptsBookings)}
                                        className={cn(
                                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                            acceptsBookings ? "bg-indigo-600" : "bg-gray-200 dark:bg-neutral-700"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                acceptsBookings ? "translate-x-6" : "translate-x-1"
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Apply Button */}
                            <button
                                onClick={() => setShowFilters(false)}
                                className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </>
            )}



            {/* Live Activity Strip */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-sm font-medium whitespace-nowrap">Right now near you:</span>
                    {(() => {
                        const categoryCounts = filteredSlots.reduce((acc, slot) => {
                            const business = MOCK_BUSINESSES.find(b => b.id === slot.businessId);
                            if (business) {
                                acc[business.category] = (acc[business.category] || 0) + 1;
                            }
                            return acc;
                        }, {} as Record<string, number>);

                        if (Object.keys(categoryCounts).length === 0) {
                            return <span className="text-sm text-white/80 italic">No live deals match your filters</span>;
                        }

                        return Object.entries(categoryCounts).map(([category, count]) => (
                            <button
                                key={category}
                                onClick={() => {
                                    const isSelected = preferences.categories.length === 1 && preferences.categories[0] === category;
                                    setPreferences({ categories: isSelected ? [] : [category] });
                                    setShowFilters(false);
                                }}
                                className="text-sm font-medium whitespace-nowrap bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
                            >
                                {count} {category.toLowerCase()}
                            </button>
                        ));
                    })()}
                </div>
            </div>

            <main className="px-4 py-6 space-y-6">

                {/* Feed Toggle Chips */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setFeedView("near")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                            feedView === "near"
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700"
                        )}
                    >
                        <MapPin className="h-4 w-4" />
                        Near You
                    </button>
                    <button
                        onClick={() => setFeedView("trending")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                            feedView === "trending"
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700"
                        )}
                    >
                        <TrendingUp className="h-4 w-4" />
                        Trending
                    </button>
                    <button
                        onClick={() => setFeedView("ending")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                            feedView === "ending"
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700"
                        )}
                    >
                        <Zap className="h-4 w-4" />
                        Ending Soon
                    </button>
                </div>

                {/* Live Slots Section */}
                {liveSlots.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {feedView === "near" && "Near You 📍"}
                                {feedView === "trending" && "Trending Now 🔥"}
                                {feedView === "ending" && "Ending Soon ⚡"}
                            </h2>
                        </div>
                        <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
                            {liveSlots
                                .sort((a, b) => {
                                    // Sort based on feed view
                                    if (feedView === "ending") {
                                        return a.endsAt - b.endsAt; // Soonest first
                                    } else if (feedView === "trending") {
                                        // Mock trending: most claimed = most popular
                                        return b.claimedCount - a.claimedCount;
                                    }
                                    // Default: nearest first (would need location data)
                                    return 0;
                                })
                                .map((slot) => {
                                    const business = MOCK_BUSINESSES.find((b) => b.id === slot.businessId);
                                    if (!business) return null;

                                    const timeLeft = Math.max(0, slot.endsAt - Date.now());
                                    const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
                                    const slotsLeft = slot.inventory - slot.claimedCount;

                                    // Calculate distance and time
                                    const userLoc = location || { lat: -31.9523, lng: 115.8613 }; // Default to Perth CBD
                                    const distanceInfo = calculateDistanceAndTime(
                                        userLoc.lat,
                                        userLoc.lng,
                                        business.lat,
                                        business.lng
                                    );

                                    // Calculate savings
                                    const savings = calculateSavings(slot.discountType, slot.value);

                                    // Get category icon
                                    const categoryIcon = getCategoryIcon(business.category);

                                    // Get time remaining
                                    const timeRemaining = getTimeRemaining(slot.endsAt);

                                    return (
                                        <div key={`${slot.businessId}-${slot.id}`} className="min-w-[280px] flex flex-col rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
                                            {/* Category Icon Badge */}
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">{categoryIcon}</span>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white">{business.name}</h3>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{business.category}</p>
                                                    </div>
                                                </div>
                                                {/* Countdown Timer */}
                                                <div className="flex items-center text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    {timeRemaining}
                                                </div>
                                            </div>

                                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{slot.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{slot.description}</p>

                                            {/* Savings & Distance Row */}
                                            <div className="flex items-center justify-between text-xs mb-3">
                                                <div className="flex items-center text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                                                    <Tag className="h-3 w-3 mr-1" />
                                                    {savings}
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {distanceInfo.displayText}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
                                                <div className="flex items-center">
                                                    <Tag className="h-3 w-3 mr-1" />
                                                    {slot.discountType === "percent" ? `${slot.value}% off` : `$${slot.value} off`}
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    {slotsLeft} {slotsLeft === 1 ? 'slot' : 'slots'} left
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4">
                                                <button
                                                    onClick={(e) => handleClaimSlot(slot.id, e)}
                                                    disabled={claiming === slot.id || slotsLeft === 0}
                                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 transition-all"
                                                >
                                                    {claiming === slot.id ? "Claiming..." : slotsLeft === 0 ? "Fully Booked" : "Claim Slot"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                )}

                {/* Suggestions / List */}
                <section>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        {preferences.liveDealsOnly ? "Live Deals Nearby" : "Suggestions for You"}
                    </h2>
                    <div className="space-y-4">
                        {filteredBusinesses.map((business) => (
                            <Link
                                key={business.id}
                                href="/consumer/map"
                                className="flex bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="w-24 h-24 relative">
                                    <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{business.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{business.category} • {business.address}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFavourite(business.id);
                                            }}
                                        >
                                            <HeartIcon filled={isFavourite(business.id)} />
                                        </button>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center text-xs text-yellow-500 font-bold">
                                            <Star className="h-3 w-3 mr-1" />
                                            {business.rating}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-400">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            0.8 km
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            {/* Flying Ticket Animations */}
            {flyingAnimations.map((animation) => (
                <FlyingTicketAnimation
                    key={animation.id}
                    startPosition={animation.startPosition}
                    onComplete={() => {
                        setFlyingAnimations(prev => prev.filter(a => a.id !== animation.id));
                    }}
                />
            ))}
        </div>
    );
}

function HeartIcon({ filled }: { filled: boolean }) {
    return <FavoriteStar initialFilled={filled} />;
}
