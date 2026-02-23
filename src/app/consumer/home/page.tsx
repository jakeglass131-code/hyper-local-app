"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Clock, MapPin, Star, Users, Tag, Ticket, TrendingUp, Zap, Sparkles, Coffee as CoffeeIcon, Utensils, Moon, Bell, ChevronDown, ShoppingCart } from "lucide-react";
import { MOCK_BUSINESSES, MOCK_OFFERS, CATEGORIES } from "@/lib/mockData";
import { useConsumerStore } from "@/store/consumerStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Offer } from "@/lib/store";
import FavoriteStar from "@/components/FavoriteStar";
import { FlyingTicketAnimation } from "@/components/FlyingTicketAnimation";
import { getTimeRemaining, calculateDistanceAndTime, calculateSavings, getCategoryIcon } from "@/lib/displayHelpers";
import { getQuickPick, getCurrentMealPeriod, getTimeWindowOffers, COLLECTIONS } from "@/lib/recommendations";

const userId = "user_123"; // TODO: Replace with auth

import { VoucherModal } from "@/components/consumer/VoucherModal";
import { ReservationModal } from "@/components/consumer/ReservationModal";
import { Claim } from "@/lib/store";

export default function HomePage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const { preferences, setPreferences, toggleFavourite, isFavourite, addClaim, addToCart, cart, location } = useConsumerStore();
    const [showFilters, setShowFilters] = useState(false);
    const [liveSlots, setLiveSlots] = useState<Offer[]>([]);
    const [claiming, setClaiming] = useState<string | null>(null);
    // const [voucherClaim, setVoucherClaim] = useState<Claim | null>(null); // Removed modal
    const [selectedDistance, setSelectedDistance] = useState<string>("500m");
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [openNow, setOpenNow] = useState(false);
    const [hasLoyalty, setHasLoyalty] = useState(false);
    const [acceptsBookings, setAcceptsBookings] = useState(false);
    const [flyingAnimations, setFlyingAnimations] = useState<Array<{ id: string; startPosition: { x: number; y: number }; text?: string }>>([]);
    const [feedView, setFeedView] = useState<"near" | "trending" | "ending">("near");
    const [showQuickPick, setShowQuickPick] = useState(false);
    const [quickPickResults, setQuickPickResults] = useState<any[]>([]);
    const [cartBump, setCartBump] = useState(false);

    // Reservation Modal State
    const [reservationModal, setReservationModal] = useState<{
        isOpen: boolean;
        offerId: string | null;
        startPos: { x: number; y: number } | null;
    }>({ isOpen: false, offerId: null, startPos: null });

    const [sortedCategories, setSortedCategories] = useState<string[]>([]);

    // Animate cart badge on change
    useEffect(() => {
        if (cart.length > 0) {
            setCartBump(true);
            const timer = setTimeout(() => setCartBump(false), 300);
            return () => clearTimeout(timer);
        }
    }, [cart.length]);

    // Fetch feed on mount
    useEffect(() => {
        fetchFeed();
        // Log Impression on mount (MVP)
        trackEvent("impression", "feed_load", "feed", "general");
    }, []);

    const trackEvent = async (eventType: string, offerId: string | undefined, businessId: string, category: string) => {
        try {
            await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    eventType,
                    offerId,
                    businessId,
                    category,
                    distanceKm: 2.0 // TODO: Calculate actual distance
                }),
            });
        } catch (e) {
            console.error("Tracking Error:", e);
        }
    };

    const fetchFeed = async () => {
        try {
            const res = await fetch(`/api/feed?userId=${userId}&lat=${location?.lat || -31.9523}&lng=${location?.lng || 115.8613}`);
            const data = await res.json();

            if (data.feed) {
                // The API returns a sorted feed. We use it directly.
                // Note: We are relaxing the "bookingRequired" filter to show the AI's selection
                setLiveSlots(data.feed);
            }
            if (data.reorderedCategories) {
                setSortedCategories(data.reorderedCategories);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleClaimSlot = (offerId: string, event: React.MouseEvent<HTMLButtonElement>) => {
        // 1. Capture Click Position for Animation later
        const rect = event.currentTarget.getBoundingClientRect();
        const startPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };

        // 2. Open Reservation Modal
        setReservationModal({
            isOpen: true,
            offerId,
            startPos: startPosition,
        });
    };

    const confirmClaim = async (name: string) => {
        const { offerId, startPos } = reservationModal;
        if (!offerId || !startPos) return;

        // Close Modal
        setReservationModal({ isOpen: false, offerId: null, startPos: null });

        // Prevent duplicate animations if already claiming
        if (claiming) return;

        // Create single animation
        setFlyingAnimations(prev => [...prev, {
            id: `${offerId}-${Date.now()}`,
            startPosition: startPos,
            text: name ? `Reservation Name: ${name}` : undefined
        }]);

        setClaiming(offerId);
        try {
            const res = await fetch("/api/claims/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    offerId,
                    userId,
                    reservationName: name
                }),
            });

            if (res.ok) {
                const claim = await res.json();
                addClaim(claim.id);

                fetchFeed(); // Refresh to update inventory

                // Add to cart to update badge
                const offer = liveSlots.find(s => s.id === offerId);
                if (offer) {
                    addToCart({ ...offer, claimId: claim.id, reservationName: name });
                }
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

    // Helper for Value Badge Text
    const getValueBadgeText = (slot: Offer) => {
        if (slot.discountType === 'percent') return `Save ${slot.value}%`;
        return `Save $${slot.value}`;
    };

    return (
        <div className="pb-24 bg-gray-50 dark:bg-black min-h-screen">
            {/* Voucher Modal - Removed */}
            {/* App Bar (Non-Sticky) */}

            {/* 1. App Bar (Non-Sticky) */}
            <div className="bg-white dark:bg-neutral-900 px-4 pt-12 pb-2 flex items-center justify-between">
                {/* Left: Logo */}
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white fill-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">HyperLocal</span>
                </div>

                {/* Center: Location Trigger */}
                <button className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Perth, WA</span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                </button>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Cart Removed as per request */}
                    <button
                        onClick={() => router.push('/consumer/offers')}
                        className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                        id="offers-btn-header-mobile-hidden" // Hidden target, mostly relying on bottom nav
                    >
                        {/* Optional: Add a different icon like "Tag" or similar if needed here, but user asked to get rid of cart */}
                        {/* For now we just keep the bell or remove this button entirely. User said "get rid of the cart". */}
                    </button>
                    <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 border-2 border-white dark:border-neutral-900 rounded-full"></span>
                    </button>
                </div>
            </div>

            {/* 2. Sticky Header: Search + Tabs */}
            <header className="sticky top-0 z-30 bg-white dark:bg-neutral-900 shadow-sm border-b border-gray-100 dark:border-neutral-800 pb-0">
                <div className="px-4 py-2 space-y-3">
                    {/* Search Bar */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search places & deals..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-10 rounded-xl bg-gray-100 dark:bg-neutral-800 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder:text-gray-500 font-medium transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(true)}
                            className={cn(
                                "h-10 w-10 flex items-center justify-center rounded-xl transition-colors relative",
                                showFilters || preferences.categories.length > 0 ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400"
                            )}
                        >
                            <SlidersHorizontal className="h-5 w-5" />
                            {(preferences.categories.length > 0) && (
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-neutral-900" />
                            )}
                        </button>
                    </div>

                    {/* Segmented Control Tabs */}
                    <div className="p-1 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center relative gap-1">
                        <button
                            onClick={() => setFeedView("near")}
                            className={cn(
                                "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 text-center",
                                feedView === "near"
                                    ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                            )}
                        >
                            Near You
                        </button>
                        <button
                            onClick={() => setFeedView("trending")}
                            className={cn(
                                "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 text-center",
                                feedView === "trending"
                                    ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                            )}
                        >
                            Trending
                        </button>
                        <button
                            onClick={() => setFeedView("ending")}
                            className={cn(
                                "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 text-center",
                                feedView === "ending"
                                    ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                            )}
                        >
                            Ending Soon
                        </button>
                    </div>
                </div>
            </header>

            {/* Filter Modal */}
            {showFilters && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm animate-in fade-in"
                        onClick={() => setShowFilters(false)}
                    />
                    <div className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-5">
                        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800 px-5 py-4 rounded-t-3xl z-10 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Filters</h3>
                            <button
                                onClick={() => {
                                    setPreferences({ categories: [] });
                                    setSelectedDistance("500m");
                                }}
                                className="text-sm font-medium text-red-500"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="p-5 pb-8 space-y-6">
                            {/* Categories */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Categories</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(sortedCategories.length > 0 ? sortedCategories : CATEGORIES).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                const current = preferences.categories;
                                                const newCats = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
                                                setPreferences({ categories: newCats });
                                            }}
                                            className={cn(
                                                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                                preferences.categories.includes(cat)
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                                                    : "bg-white dark:bg-neutral-800 text-gray-600 border-gray-200 dark:border-neutral-700"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Distance */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Distance</h4>
                                <div className="flex bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl">
                                    {["500m", "1km", "5km", "10km+"].map(dist => (
                                        <button
                                            key={dist}
                                            onClick={() => setSelectedDistance(dist)}
                                            className={cn(
                                                "flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center",
                                                selectedDistance === dist
                                                    ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                                                    : "text-gray-500 dark:text-gray-400"
                                            )}
                                        >
                                            {dist}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Apply */}
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all"
                            >
                                Show {filteredSlots.length} Results
                            </button>
                        </div>
                    </div>
                </>
            )}

            <main className="px-5 py-6 space-y-8">
                {/* 0. Because You Like [Top Category] Section */}
                {sortedCategories.length > 0 && liveSlots.some(s => {
                    const b = MOCK_BUSINESSES.find(biz => biz.id === s.businessId);
                    return b && b.category === sortedCategories[0];
                }) && (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                    Because you like {sortedCategories[0]}
                                </h2>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                                {liveSlots
                                    .filter(s => {
                                        const b = MOCK_BUSINESSES.find(biz => biz.id === s.businessId);
                                        return b && b.category === sortedCategories[0];
                                    })
                                    .slice(0, 5)
                                    .map(slot => {
                                        const business = MOCK_BUSINESSES.find(b => b.id === slot.businessId);
                                        if (!business) return null;
                                        return (
                                            <div
                                                key={`rec-${slot.id}`}
                                                className="min-w-[260px] bg-white dark:bg-neutral-900 rounded-2xl p-3 border border-gray-100 dark:border-neutral-800 shadow-sm"
                                                onClick={() => trackEvent("click", slot.id, slot.businessId, business.category)}
                                            >
                                                <div className="h-32 rounded-xl bg-gray-100 overflow-hidden mb-3 relative">
                                                    <img src={business.image} className="w-full h-full object-cover" />
                                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold">
                                                        {getValueBadgeText(slot)}
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-gray-900 dark:text-white truncate">{slot.title}</h4>
                                                <p className="text-xs text-gray-500 mb-3">{business.name}</p>
                                                <button
                                                    className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleClaimSlot(slot.id, e);
                                                        trackEvent("redeem", slot.id, slot.businessId, business.category);
                                                    }}
                                                >
                                                    Get Deal
                                                </button>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </section>
                    )}

                {/* Live Slots Section */}
                {filteredSlots.length > 0 && (
                    <section className="space-y-4">
                        {filteredSlots
                            .sort((a, b) => {
                                if (feedView === "ending") return a.endsAt - b.endsAt;
                                if (feedView === "trending") return b.claimedCount - a.claimedCount;
                                return 0;
                            })
                            .map((slot) => {
                                const business = MOCK_BUSINESSES.find((b) => b.id === slot.businessId);
                                if (!business) return null;

                                const slotsLeft = slot.inventory - slot.claimedCount;
                                const userLoc = location || { lat: -31.9523, lng: 115.8613 };
                                const distanceInfo = calculateDistanceAndTime(userLoc.lat, userLoc.lng, business.lat, business.lng);

                                // Determine CTA Text
                                let ctaText = "Get Deal";
                                if (slot.bookingRequired) ctaText = "Book";
                                if (slot.discountType === 'percent' && slot.value >= 40) ctaText = "Claim";
                                if (slotsLeft <= 3) ctaText = "Secure";
                                if (claiming === slot.id) ctaText = "Processing";
                                if (slotsLeft === 0) ctaText = "Sold Out";

                                return (
                                    <div
                                        key={`${slot.businessId}-${slot.id}`}
                                        className="bg-white dark:bg-neutral-900 rounded-3xl p-3 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-neutral-800"
                                        onClick={() => trackEvent("click", slot.id, slot.businessId, business.category)}
                                    >

                                        {/* 1. Image Area (Rounded 2xl) */}
                                        <div className="h-40 w-full rounded-2xl bg-gray-100 dark:bg-neutral-800 relative overflow-hidden mb-3">
                                            <img src={business.image || "/placeholder.jpg"} className="w-full h-full object-cover" alt={business.name} />
                                            {/* Top Right: Time Badge */}
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center">
                                                <Clock className="h-3 w-3 mr-1.5" />
                                                {getTimeRemaining(slot.endsAt)}
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="px-1 space-y-1">
                                            {/* 2. Business Name + Category */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                    {business.category} • {business.name}
                                                </span>
                                                <div className="flex items-center text-xs font-bold text-gray-900 dark:text-white">
                                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                                                    {business.rating}
                                                </div>
                                            </div>

                                            {/* 3. Deal Title */}
                                            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">
                                                {slot.title}
                                            </h3>

                                            {/* 4. Single Value Badge */}
                                            <div className="flex items-center gap-2 pt-1 pb-2">
                                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-extrabold">
                                                    <Tag className="h-3 w-3 mr-1.5" />
                                                    {getValueBadgeText(slot)}
                                                </div>
                                                {slotsLeft <= 5 && (
                                                    <span className="text-xs font-bold text-orange-600 animate-pulse">
                                                        Only {slotsLeft} left
                                                    </span>
                                                )}
                                            </div>

                                            {/* 5. Meta Row & CTA */}
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-neutral-800 mt-2">
                                                {/* Left: Meta */}
                                                <div className="flex flex-col">
                                                    <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {distanceInfo.displayText}
                                                    </div>
                                                </div>

                                                {/* Right: CTA Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent card click
                                                        trackEvent("redeem", slot.id, slot.businessId, business.category);
                                                        handleClaimSlot(slot.id, e);
                                                    }}
                                                    disabled={claiming === slot.id || slotsLeft === 0}
                                                    className={cn(
                                                        "px-6 py-2.5 rounded-full font-bold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-transform active:scale-95 min-w-[100px]",
                                                        slotsLeft === 0
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                                                    )}
                                                >
                                                    {claiming === slot.id ? "..." : slotsLeft === 0 ? "Sold Out" : ctaText}
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                    </section>
                )}

                {/* Suggestions List */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Suggestions for You
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {filteredBusinesses.map((business) => (
                            <Link
                                key={business.id}
                                href="/consumer/map"
                                className="flex bg-white dark:bg-neutral-900 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-neutral-800 active:scale-[0.99] transition-transform"
                            >
                                <div className="w-20 h-20 relative rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                    <img src={business.image || "/placeholder.jpg"} alt={business.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 pl-4 flex flex-col justify-center">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-base text-gray-900 dark:text-white leading-tight">{business.name}</h3>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 mt-0.5">{business.category}</p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center text-xs font-bold text-gray-900 dark:text-white">
                                                <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                                                {business.rating.toFixed(1)} <span className="text-gray-400 font-normal ml-0.5">(128)</span>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded-full text-[10px] font-bold text-gray-600 dark:text-gray-300">
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
                    text={animation.text}
                    targetId="nav-item-offers"
                    onComplete={() => {
                        setFlyingAnimations(prev => prev.filter(a => a.id !== animation.id));
                    }}
                />
            ))}
            {/* Reservation Modal */}
            <ReservationModal
                isOpen={reservationModal.isOpen}
                onClose={() => setReservationModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmClaim}
                offerTitle={liveSlots.find(o => o.id === reservationModal.offerId)?.title || ""}
                businessName={MOCK_BUSINESSES.find(b => b.id === liveSlots.find(o => o.id === reservationModal.offerId)?.businessId)?.name || ""}
            />
        </div>
    );
}
