"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import {
    Bookmark,
    ChevronDown,
    MapPin,
    Search,
    SlidersHorizontal,
    Upload,
    User,
    X,
} from "lucide-react";
import { MOCK_BUSINESSES, CATEGORIES, type Business } from "@/lib/mockData";
import { useConsumerStore } from "@/store/consumerStore";
import { cn } from "@/lib/utils";
import { Offer } from "@/lib/store";
import { FlyingTicketAnimation } from "@/components/FlyingTicketAnimation";
import { calculateDistanceAndTime } from "@/lib/displayHelpers";

const userId = "user_123";
const DEFAULT_DISTANCE_KM = 10;
const NEAR_YOU_SECTOR_ID = "near-you";
type SectorFilter = {
    id: string;
    label: string;
    matches: (business: Business, offer: Offer) => boolean;
};
const SUB_SECTORS: Record<string, string[]> = {
    "food": ["Italian", "Asian", "Mexican", "Burgers", "Pizza", "Desserts", "Bakery"],
    "drinks": ["Cocktails", "Speakeasy", "Wine Bar", "Pub", "Rooftop", "Craft Beer", "Breweries"],
    "beauty": ["Nails", "Hair", "Makeup", "Skin Care", "Lashes", "Brows"],
    "boutiques": ["Clothing", "Vintage", "Accessories", "Home", "Gifts"],
    "apothecary": ["Skincare", "Vitamins", "Oils", "Supplements"],
    "health": ["Physio", "Chiro", "Massage", "Acupuncture", "Dental"],
};
const SUB_SECTOR_KEYWORDS: Record<string, string[]> = {
    Desserts: ["dessert", "desserts", "ice cream", "gelato", "sorbet", "donut", "doughnut", "cake", "pastry"],
};
const DIETARY_KEYWORDS = {
    vegan: ["vegan", "plant based", "plant-based", "dairy free", "dairy-free", "egg free", "egg-free"],
    vegetarian: ["vegetarian", "veggie", "meat free", "meat-free"],
};

const SECTOR_FILTERS: SectorFilter[] = [
    { id: NEAR_YOU_SECTOR_ID, label: "Near You", matches: () => true },
    { id: "food", label: "Food", matches: (business) => business.category === "Food" || business.category === "Coffee" },
    {
        id: "drinks",
        label: "Drinks",
        matches: (business, offer) =>
            business.category === "Drinks" ||
            includesKeyword(`${business.name} ${offer.title} ${offer.description}`, ["cocktail", "bar", "martini", "wine", "happy hour", "brewery", "breweries", "brew", "beer", "ale", "tap", "lager", "pint"]),
    },
    { id: "beauty", label: "Beauty", matches: (business) => business.category === "Beauty" },
    { id: "fitness", label: "Fitness", matches: (business) => business.category === "Fitness" },
    {
        id: "cinema",
        label: "Cinema",
        matches: (business, offer) =>
            business.category === "Entertainment" &&
            includesKeyword(`${business.name} ${offer.title} ${offer.description}`, ["cinema", "movie", "film", "screen", "ticket"]),
    },
    { id: "boutiques", label: "Boutiques", matches: (business) => business.category === "Retail" },
    {
        id: "apothecary",
        label: "Apothecary",
        matches: (business, offer) =>
            (business.category === "Wellness" || business.category === "Beauty") &&
            includesKeyword(`${business.name} ${offer.title} ${offer.description}`, ["apothecary", "skin", "skincare", "self-care", "spa", "wellness"]),
    },
    {
        id: "health",
        label: "Health",
        matches: (business, offer) =>
            business.category === "Wellness" ||
            includesKeyword(`${business.name} ${offer.title} ${offer.description}`, ["health", "recovery", "physio", "chiro", "clinic", "massage"]),
    },
];

function getDistanceLimitMeters(distanceKm: number): number {
    return distanceKm * 1000;
}

function formatKm(km: number): string {
    return km.toFixed(1).replace(/\.0$/, "");
}

function getOfferPrice(slot: Offer): string {
    const base = slot.originalPrice ?? 11.99;
    if (slot.discountType === "percent") {
        return `$${(base * (1 - slot.value / 100)).toFixed(2)}`;
    }
    if (slot.discountType === "fixed") {
        return `$${Math.max(base - slot.value, 1).toFixed(2)}`;
    }
    return `$${(base / 2).toFixed(2)}`;
}

function getOriginalOfferPrice(slot: Offer): string {
    return `$${(slot.originalPrice ?? 11.99).toFixed(2)}`;
}

function getOfferPriceNumber(slot: Offer): number {
    const base = slot.originalPrice ?? 11.99;
    if (slot.discountType === "percent") {
        return base * (1 - slot.value / 100);
    }
    if (slot.discountType === "fixed") {
        return Math.max(base - slot.value, 1);
    }
    return base / 2;
}

function includesKeyword(text: string, keywords: string[]): boolean {
    const value = text.toLowerCase();
    return keywords.some((keyword) => value.includes(keyword));
}

function getSubSectorKeywords(subSector: string): string[] {
    return SUB_SECTOR_KEYWORDS[subSector] ?? [subSector.toLowerCase()];
}

function getStableBucketIndex(seed: string, bucketCount: number): number {
    if (bucketCount <= 0) return 0;

    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return hash % bucketCount;
}

function matchesSelectedSubSector(
    selectedSectorId: string,
    selectedSubSectorId: string,
    business: Business,
    offer: Offer
): boolean {
    const haystack = `${business.name} ${business.category} ${offer.title} ${offer.description}`;
    if (includesKeyword(haystack, getSubSectorKeywords(selectedSubSectorId))) {
        return true;
    }

    // Generated mock businesses use generic copy, so keyword-only matching is too sparse.
    // Use a stable pseudo-assignment for Food sub-sectors to keep the UI populated.
    if (
        selectedSectorId === "food" &&
        business.id.startsWith("gen_b_") &&
        (business.category === "Food" || business.category === "Coffee")
    ) {
        const foodSubSectors = SUB_SECTORS.food ?? [];
        const bucket = getStableBucketIndex(business.id, foodSubSectors.length);
        return (foodSubSectors[bucket] ?? "").toLowerCase() === selectedSubSectorId.toLowerCase();
    }

    return false;
}

export default function HomePage() {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [liveSlots, setLiveSlots] = useState<Offer[]>([]);
    const [claiming, setClaiming] = useState<string | null>(null);
    const [distanceKm, setDistanceKm] = useState<number>(10);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [hasLoyalty, setHasLoyalty] = useState(false);
    const [acceptsBookings, setAcceptsBookings] = useState(false);
    const [showDistanceFilter, setShowDistanceFilter] = useState(false);
    const [showPriceFilter, setShowPriceFilter] = useState(false);
    const [flyingAnimations, setFlyingAnimations] = useState<Array<{ id: string; startPosition: { x: number; y: number } }>>([]);
    const [locationLabel, setLocationLabel] = useState("Locating...");
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedSectorId, setSelectedSectorId] = useState<string>(NEAR_YOU_SECTOR_ID);
    const [selectedSubSectorId, setSelectedSubSectorId] = useState<string | null>(null);
    const [dietaryFilters, setDietaryFilters] = useState({ vegan: false, vegetarian: false });
    const logoInputRef = useRef<HTMLInputElement | null>(null);

    const {
        preferences,
        setPreferences,
        toggleFavourite,
        isFavourite,
        addClaim,
        addToCart,
        location,
        setLocation,
    } = useConsumerStore();

    const userLoc = location || { lat: -31.9523, lng: 115.8613 };

    const businessById = useMemo(() => {
        return new Map(MOCK_BUSINESSES.map((business) => [business.id, business]));
    }, []);

    useEffect(() => {
        const savedLogo = localStorage.getItem("app-logo");
        if (savedLogo) {
            setLogoPreview(savedLogo);
        }
    }, []);

    useEffect(() => {
        fetchLiveSlots();
    }, []);

    useEffect(() => {
        if (typeof navigator === "undefined" || !navigator.geolocation) {
            setLocationLabel("Location unavailable");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.warn("Location access unavailable:", error.message);
                if (error.code === error.PERMISSION_DENIED) {
                    setLocationLabel("Enable location access");
                } else {
                    setLocationLabel("Current location");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
    }, [setLocation]);

    useEffect(() => {
        if (!location) return;

        const controller = new AbortController();
        const loadLocationName = async () => {
            try {
                setLocationLabel("Locating...");
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.lat}&lon=${location.lng}`,
                    { signal: controller.signal }
                );
                if (!res.ok) throw new Error(`Reverse geocode failed: ${res.status}`);

                const data = await res.json();
                const addr = data?.address || {};
                const name =
                    addr.city ||
                    addr.town ||
                    addr.village ||
                    addr.suburb ||
                    addr.county ||
                    addr.state ||
                    "Current location";

                setLocationLabel(name);
            } catch (error) {
                if ((error as Error).name === "AbortError") return;
                console.warn("Reverse geocoding failed:", error);
                setLocationLabel("Current location");
            }
        };

        loadLocationName();
        return () => controller.abort();
    }, [location]);

    const fetchLiveSlots = async () => {
        try {
            const res = await fetch("/api/offers");
            const offers: Offer[] = await res.json();
            const slots = offers.filter((offer) => offer.claimedCount < offer.inventory);
            setLiveSlots(slots);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClaimSlot = async (offerId: string, event: MouseEvent<HTMLButtonElement>) => {
        if (claiming) return;

        event.stopPropagation();

        const rect = event.currentTarget.getBoundingClientRect();
        const startPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };

        setFlyingAnimations((prev) => [...prev, { id: `${offerId}-${Date.now()}`, startPosition }]);
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

                const slot = liveSlots.find((item) => item.id === offerId);
                if (slot) {
                    setTimeout(() => {
                        addToCart(slot);
                    }, 1200);
                }

                fetchLiveSlots();
            } else {
                const error = await res.json();
                console.error("Failed to claim slot:", error.error);
            }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setClaiming(null);
        }
    };

    const filteredSlots = useMemo(() => {
        const searchLower = search.toLowerCase();
        const maxDistance = getDistanceLimitMeters(distanceKm);

        return liveSlots.filter((slot) => {
            const business = businessById.get(slot.businessId);
            if (!business) return false;

            if (search) {
                const slotMatch = slot.title.toLowerCase().includes(searchLower) || slot.description.toLowerCase().includes(searchLower);
                const businessMatch = business.name.toLowerCase().includes(searchLower) || business.category.toLowerCase().includes(searchLower);
                if (!slotMatch && !businessMatch) return false;
            }

            if (preferences.categories.length > 0 && !preferences.categories.includes(business.category)) {
                return false;
            }

            const { distanceMeters } = calculateDistanceAndTime(userLoc.lat, userLoc.lng, business.lat, business.lng);
            if (distanceMeters > maxDistance) return false;

            if (selectedPrice !== null && slot.value > selectedPrice) return false;

            if (acceptsBookings && !slot.bookingRequired) return false;

            return true;
        });
    }, [liveSlots, search, distanceKm, selectedPrice, acceptsBookings, preferences.categories, businessById, userLoc.lat, userLoc.lng]);

    const sectorById = useMemo(() => new Map(SECTOR_FILTERS.map((sector) => [sector.id, sector])), []);

    const businessesByTopOffer = useMemo(() => {
        const byBusiness = new Map<
            string,
            {
                business: (typeof MOCK_BUSINESSES)[number];
                topOffer: Offer;
                offerCount: number;
                slotsLeft: number;
                distanceText: string;
                distanceMeters: number;
            }
        >();

        filteredSlots.forEach((slot) => {
            const business = businessById.get(slot.businessId);
            if (!business) return;

            const distance = calculateDistanceAndTime(userLoc.lat, userLoc.lng, business.lat, business.lng);
            const remaining = Math.max((slot.inventory ?? 0) - (slot.claimedCount ?? 0), 0);
            const current = byBusiness.get(business.id);

            if (!current) {
                byBusiness.set(business.id, {
                    business,
                    topOffer: slot,
                    offerCount: 1,
                    slotsLeft: remaining,
                    distanceText: distance.displayText,
                    distanceMeters: distance.distanceMeters,
                });
                return;
            }

            const currentPrice = getOfferPriceNumber(current.topOffer);
            const candidatePrice = getOfferPriceNumber(slot);
            const shouldPromote = candidatePrice < currentPrice || (candidatePrice === currentPrice && slot.value > current.topOffer.value);

            byBusiness.set(business.id, {
                ...current,
                topOffer: shouldPromote ? slot : current.topOffer,
                offerCount: current.offerCount + 1,
                slotsLeft: current.slotsLeft + remaining,
            });
        });

        return Array.from(byBusiness.values()).sort(
            (left, right) =>
                left.distanceMeters - right.distanceMeters ||
                right.topOffer.value - left.topOffer.value ||
                right.offerCount - left.offerCount
        );
    }, [filteredSlots, businessById, userLoc.lat, userLoc.lng]);

    const sectorCounts = useMemo(() => {
        const counts = new Map<string, number>();
        SECTOR_FILTERS.forEach((sector) => counts.set(sector.id, 0));

        businessesByTopOffer.forEach(({ business, topOffer }) => {
            SECTOR_FILTERS.forEach((sector) => {
                if (sector.id === NEAR_YOU_SECTOR_ID) return;
                if (!sector.matches(business, topOffer)) return;
                counts.set(sector.id, (counts.get(sector.id) ?? 0) + 1);
            });
        });

        counts.set(NEAR_YOU_SECTOR_ID, businessesByTopOffer.length);
        return counts;
    }, [businessesByTopOffer]);

    const selectedSector = sectorById.get(selectedSectorId) ?? SECTOR_FILTERS[0];

    const visibleBusinesses = useMemo(() => {
        let base = businessesByTopOffer;

        if (selectedSector.id !== NEAR_YOU_SECTOR_ID) {
            base = base.filter(({ business, topOffer }) => selectedSector.matches(business, topOffer));
        }

        if (selectedSubSectorId) {
            base = base.filter(({ business, topOffer }) =>
                matchesSelectedSubSector(selectedSector.id, selectedSubSectorId, business, topOffer)
            );
        }

        if (selectedSector.id === "food" && (dietaryFilters.vegan || dietaryFilters.vegetarian)) {
            base = base.filter(({ business, topOffer }) => {
                const text = `${business.name} ${business.description || ""} ${business.category} ${topOffer.title} ${topOffer.description}`;
                const veganMatch = includesKeyword(text, DIETARY_KEYWORDS.vegan);
                const vegetarianMatch = includesKeyword(text, DIETARY_KEYWORDS.vegetarian) || veganMatch;

                if (dietaryFilters.vegan && dietaryFilters.vegetarian) return veganMatch || vegetarianMatch;
                if (dietaryFilters.vegan) return veganMatch;
                return vegetarianMatch;
            });
        }

        return base;
    }, [businessesByTopOffer, selectedSector, selectedSubSectorId, dietaryFilters.vegan, dietaryFilters.vegetarian]);



    const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                const result = reader.result;
                setLogoPreview(result);
                localStorage.setItem("app-logo", result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleGoToMap = () => {
        if (selectedSectorId === NEAR_YOU_SECTOR_ID) {
            router.push("/consumer/map");
            return;
        }

        const categoryMapping: Record<string, string[]> = {
            food: ["Food", "Coffee"],
            drinks: ["Drinks"],
            beauty: ["Beauty"],
            fitness: ["Fitness"],
            cinema: ["Entertainment"],
            boutiques: ["Retail"],
            apothecary: ["Wellness", "Beauty"],
            health: ["Wellness"],
        };

        const cats = categoryMapping[selectedSectorId];
        if (cats && cats.length > 0) {
            router.push(`/consumer/map?categories=${cats.join(",")}`);
        } else {
            router.push("/consumer/map");
        }
    };

    return (
        <div className="min-h-screen bg-white pb-28 text-[#1f2120]">
            <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 px-5 pb-4 pt-4 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                        <button className="flex items-center gap-1 text-[22px] font-black text-[#1f2120]">
                            <MapPin className="h-5 w-5 text-brand" />
                            {locationLabel}
                            <ChevronDown className="h-4 w-4 text-[#8a9791]" />
                        </button>
                        <div className="relative mt-0.5">
                            <button
                                onClick={() => {
                                    setShowDistanceFilter(!showDistanceFilter);
                                    setShowPriceFilter(false);
                                }}
                                className="text-[14px] font-bold text-[#6f7b76] hover:opacity-80 transition-opacity text-left"
                            >
                                within <span className="text-brand underline decoration-brand/30 underline-offset-4">{distanceKm} km</span>
                            </button>
                            {showDistanceFilter && (
                                <div className="absolute left-0 top-8 z-50 w-72 rounded-3xl border border-[#e1e8e2] bg-white p-5 shadow-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8a9791]">Max Distance</h4>
                                        <span className="text-sm font-bold text-brand">{distanceKm} km</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="50"
                                        step="1"
                                        value={distanceKm}
                                        onChange={(e) => setDistanceKm(Number(e.target.value))}
                                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#f1f5f1] accent-brand transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-md"
                                    />
                                    <div className="mt-3 flex justify-between text-[11px] font-bold text-[#a8b3ac]">
                                        <span>1km</span>
                                        <span>50km</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => logoInputRef.current?.click()}
                            className="flex h-10 items-center justify-center gap-2 rounded-full bg-gray-100 px-3 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                            aria-label="Upload logo"
                        >
                            {logoPreview ? (
                                <span
                                    className="h-5 w-5 rounded-full border border-gray-300 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${logoPreview})` }}
                                />
                            ) : (
                                <Upload className="h-4 w-4" />
                            )}
                            <span className="hidden sm:inline">{logoPreview ? "Brand" : "Setup"}</span>
                        </button>
                        <button
                            onClick={() => router.push("/consumer/profile")}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[#1f2a2a] hover:bg-gray-200 transition-all"
                            aria-label="Profile"
                        >
                            <User className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="relative mt-4 flex h-14 w-full rounded-2xl bg-gray-100 focus-within:ring-2 focus-within:ring-black/5 transition-all font-medium border border-transparent">
                    <div className="relative flex-1 flex items-center">
                        <Search className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search businesses..."
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                if (event.target.value && preferences.categories.length > 0) {
                                    setPreferences({ categories: [] });
                                }
                            }}
                            className="h-full w-full bg-transparent pl-12 pr-4 text-[16px] text-gray-900 outline-none placeholder:text-gray-500"
                        />
                    </div>

                    <div className="h-8 w-px bg-gray-300 my-auto" />

                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowPriceFilter(!showPriceFilter);
                                setShowDistanceFilter(false);
                            }}
                            className={cn(
                                "flex h-full items-center justify-center px-5 transition-colors font-bold text-lg",
                                selectedPrice !== null ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            $
                        </button>

                        {showPriceFilter && (
                            <div className="absolute right-0 top-16 z-50 w-64 rounded-3xl border border-gray-100 bg-white p-5 shadow-2xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">Max Price</h4>
                                    <span className="text-sm font-bold text-indigo-600">
                                        {selectedPrice ? `Under $${selectedPrice}` : "Any"}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={selectedPrice || 0}
                                    onChange={(event) => {
                                        const value = Number.parseInt(event.target.value, 10);
                                        setSelectedPrice(value === 0 ? null : value);
                                    }}
                                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-100 accent-indigo-600 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:shadow-md"
                                />
                                <div className="mt-3 flex justify-between text-[11px] font-bold text-gray-400">
                                    <span>Any</span>
                                    <span>$100+</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="space-y-5 px-4 py-5">
                <section>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {SECTOR_FILTERS.map((sector) => {
                            const isActive = selectedSectorId === sector.id;
                            const count = sectorCounts.get(sector.id) ?? 0;


                            return (
                                <button
                                    key={sector.id}
                                    onClick={() => {
                                        setSelectedSectorId(sector.id);
                                        setSelectedSubSectorId(null);
                                    }}
                                    className={cn(
                                        "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all",
                                        isActive
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    )}
                                >
                                    {sector.label}
                                    <span className={cn("text-[11px]", isActive ? "text-white/80" : "text-gray-500")}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {SUB_SECTORS[selectedSectorId] && (
                    <section className="-mt-2">
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            <button
                                onClick={() => setSelectedSubSectorId(null)}
                                className={cn(
                                    "inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs font-bold transition-all",
                                    selectedSubSectorId === null
                                        ? "bg-gray-800 text-white"
                                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                All
                            </button>
                            {SUB_SECTORS[selectedSectorId].map((sub) => (
                                <button
                                    key={sub}
                                    onClick={() => setSelectedSubSectorId(sub)}
                                    className={cn(
                                        "inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs font-bold transition-all",
                                        selectedSubSectorId === sub
                                            ? "bg-gray-800 text-white"
                                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                    )}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h2 className="text-[22px] font-black tracking-tight text-[#1f2a2a]">{selectedSector.label}</h2>
                                {selectedSectorId === "food" && (
                                    <div className="flex gap-1.5 ml-1">
                                        <button
                                            onClick={() => setDietaryFilters((prev) => ({ ...prev, vegetarian: !prev.vegetarian }))}
                                            className={cn(
                                                "inline-flex h-7 items-center rounded-full border px-2.5 text-[11px] font-black tracking-wide transition-all",
                                                dietaryFilters.vegetarian
                                                    ? "border-[#1f8f4d] bg-[#1f8f4d] text-white"
                                                    : "border-[#90d4a9] bg-[#e9f9ef] text-[#1f8f4d]"
                                            )}
                                            aria-label="Toggle vegetarian filter"
                                        >
                                            V
                                        </button>
                                        <button
                                            onClick={() => setDietaryFilters((prev) => ({ ...prev, vegan: !prev.vegan }))}
                                            className={cn(
                                                "inline-flex h-7 items-center rounded-full border px-2.5 text-[11px] font-black tracking-wide transition-all",
                                                dietaryFilters.vegan
                                                    ? "border-[#1f8f4d] bg-[#1f8f4d] text-white"
                                                    : "border-[#90d4a9] bg-[#e9f9ef] text-[#1f8f4d]"
                                            )}
                                            aria-label="Toggle vegan filter"
                                        >
                                            VG
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm font-medium text-[#6f7b76]">
                                {visibleBusinesses.length} {visibleBusinesses.length === 1 ? "business" : "businesses"} in this sector
                            </p>
                        </div>
                        <button onClick={handleGoToMap} className="text-[14px] font-bold text-brand">
                            See map ›
                        </button>
                    </div>

                    {visibleBusinesses.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-[#d6dfd8] bg-white px-4 py-8 text-center text-sm text-[#6f7b76]">
                            No businesses match this sector and filter combo.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {visibleBusinesses.map((entry) => {
                                const { business, topOffer, slotsLeft, distanceText, offerCount } = entry;
                                const canClaim = slotsLeft > 0;

                                return (
                                    <article key={business.id} className="rounded-[1.6rem] border border-[#dfe6df] bg-white p-3.5 shadow-[0_8px_20px_-18px_rgba(23,31,29,0.55)]">
                                        <div className="flex items-start gap-3">
                                            <button onClick={handleGoToMap} className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                                                <img src={business.image} alt={business.name} className="h-full w-full object-cover" />
                                            </button>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-base font-black tracking-tight text-[#1f2a2a]">{business.name}</p>
                                                        <p className="truncate text-xs font-bold uppercase tracking-[0.12em] text-[#7c8984]">
                                                            {business.category} · {distanceText}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (!isFavourite(topOffer.id)) {
                                                                toggleFavourite(topOffer.id);
                                                            }
                                                            router.push("/consumer/reservations/favourite-offers");
                                                        }}
                                                        className={cn(
                                                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all active:scale-95",
                                                            isFavourite(topOffer.id)
                                                                ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                                                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900"
                                                        )}
                                                        aria-label={`Save ${topOffer.title} and open saved offers`}
                                                    >
                                                        <Bookmark className="h-5 w-5" />
                                                    </button>
                                                </div>

                                                <p className="mt-1 line-clamp-1 text-sm font-semibold text-[#4f5e58]">{topOffer.title || "Surprise Bag"}</p>

                                                <div className="mt-2 flex items-end justify-between gap-3">
                                                    <div>
                                                        <p className="text-xs font-bold text-[#8a9791] line-through">{getOriginalOfferPrice(topOffer)}</p>
                                                        <p className="text-xl font-black leading-none tracking-tight text-brand">{getOfferPrice(topOffer)}</p>
                                                        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a9791]">
                                                            {offerCount} live {offerCount === 1 ? "offer" : "offers"} · {formatKm((entry.distanceMeters || 0) / 1000)} km
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={(event) => handleClaimSlot(topOffer.id, event)}
                                                        disabled={claiming === topOffer.id || !canClaim}
                                                        className={cn(
                                                            "rounded-full border px-5 py-2 text-sm font-bold transition-all active:scale-95",
                                                            canClaim
                                                                ? "border-[#d5ddd8] bg-white text-[#111c22] hover:bg-[#f7faf8]"
                                                                : "border-[#e5ebe7] bg-[#f5f7f6] text-[#9ca8a3]",
                                                            claiming === topOffer.id && "opacity-60"
                                                        )}
                                                    >
                                                        {claiming === topOffer.id ? "..." : "Book"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            {flyingAnimations.map((animation) => (
                <FlyingTicketAnimation
                    key={animation.id}
                    startPosition={animation.startPosition}
                    onComplete={() => {
                        setFlyingAnimations((prev) => prev.filter((item) => item.id !== animation.id));
                    }}
                />
            ))}
        </div>
    );
}
