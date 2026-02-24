"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronDown,
    Clock3,
    Heart,
    MapPin,
    Search,
    SlidersHorizontal,
    Star,
    Store,
    Upload,
    User,
    X,
} from "lucide-react";
import { MOCK_BUSINESSES, CATEGORIES } from "@/lib/mockData";
import { useConsumerStore } from "@/store/consumerStore";
import { cn } from "@/lib/utils";
import { Offer } from "@/lib/store";
import { FlyingTicketAnimation } from "@/components/FlyingTicketAnimation";
import { calculateDistanceAndTime } from "@/lib/displayHelpers";

const userId = "user_123";
const DISTANCE_OPTIONS = ["500m", "1km", "5km", "10km+"] as const;
const DEFAULT_DISTANCE = "10km+" as const;

function getDistanceLimitMeters(distance: (typeof DISTANCE_OPTIONS)[number]): number {
    if (distance === "500m") return 500;
    if (distance === "1km") return 1000;
    if (distance === "5km") return 5000;
    return 10_000;
}

function formatKm(km: number): string {
    return km.toFixed(1).replace(/\.0$/, "");
}

function getHeaderRadius(distance: (typeof DISTANCE_OPTIONS)[number]): string {
    if (distance === "500m") return "within 0.5 km";
    if (distance === "1km") return "within 1 km";
    if (distance === "5km") return "within 5 km";
    return "within 10 km";
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

export default function HomePage() {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [liveSlots, setLiveSlots] = useState<Offer[]>([]);
    const [claiming, setClaiming] = useState<string | null>(null);
    const [selectedDistance, setSelectedDistance] = useState<(typeof DISTANCE_OPTIONS)[number]>(DEFAULT_DISTANCE);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [hasLoyalty, setHasLoyalty] = useState(false);
    const [acceptsBookings, setAcceptsBookings] = useState(false);
    const [flyingAnimations, setFlyingAnimations] = useState<Array<{ id: string; startPosition: { x: number; y: number } }>>([]);
    const [locationLabel, setLocationLabel] = useState("Locating...");
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
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
        const maxDistance = getDistanceLimitMeters(selectedDistance);

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
    }, [liveSlots, search, selectedDistance, selectedPrice, acceptsBookings, preferences.categories, businessById, userLoc.lat, userLoc.lng]);

    const recommended = useMemo(() => {
        return [...filteredSlots]
            .sort((a, b) => b.claimedCount - a.claimedCount)
            .slice(0, 10);
    }, [filteredSlots]);

    const endingSoon = useMemo(() => {
        return [...filteredSlots]
            .sort((a, b) => a.endsAt - b.endsAt)
            .slice(0, 10);
    }, [filteredSlots]);

    const tomorrow = useMemo(() => {
        const now = new Date();
        const tomorrowDate = new Date(now);
        tomorrowDate.setDate(now.getDate() + 1);

        const tomorrowKey = tomorrowDate.toDateString();

        const slots = filteredSlots.filter((slot) => new Date(slot.startsAt).toDateString() === tomorrowKey);
        if (slots.length > 0) {
            return slots.sort((a, b) => a.startsAt - b.startsAt).slice(0, 10);
        }

        return [...filteredSlots].sort((a, b) => a.startsAt - b.startsAt).slice(0, 10);
    }, [filteredSlots]);

    const sections = [
        { title: "Recommended for you", items: recommended },
        { title: "Save before it's too late", items: endingSoon },
        { title: "Pick up tomorrow", items: tomorrow },
    ];

    const activeFilterCount =
        preferences.categories.length +
        (selectedDistance !== DEFAULT_DISTANCE ? 1 : 0) +
        (selectedPrice !== null ? 1 : 0) +
        (hasLoyalty ? 1 : 0) +
        (acceptsBookings ? 1 : 0);

    const resetFilters = () => {
        setPreferences({ categories: [], liveDealsOnly: false });
        setSelectedDistance(DEFAULT_DISTANCE);
        setSelectedPrice(null);
        setHasLoyalty(false);
        setAcceptsBookings(false);
    };

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

    return (
        <div className="min-h-screen bg-[#f6f8f5] pb-28 text-[#1f2a2a]">
            <header className="sticky top-0 z-20 border-b border-[#dfe6df] bg-[#f6f8f5]/95 px-5 pb-5 pt-4 backdrop-blur-xl">
                <div className="mb-7 flex items-center">
                    <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => logoInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#d6dfd8] bg-white px-3 py-2 text-[#1f2a2a] shadow-sm hover:bg-[#f1f5f1] transition-all active:scale-95"
                        aria-label="Upload logo"
                    >
                        {logoPreview ? (
                            <span
                                className="h-6 w-6 rounded-md border border-[#ff6b3d]/40 bg-cover bg-center"
                                style={{ backgroundImage: `url(${logoPreview})` }}
                            />
                        ) : (
                            <Upload className="h-4 w-4 text-[#ff6b3d]" />
                        )}
                        <span className="text-sm font-bold tracking-tight">
                            {logoPreview ? "Sync Brand" : "Setup Brand"}
                        </span>
                    </button>
                </div>

                <div className="flex items-start justify-between gap-3">
                    <div>
                        <button className="flex items-center gap-1 text-[22px] font-bold text-[#1f2a2a]">
                            <MapPin className="h-5 w-5 text-[#ff6b3d]" />
                            {locationLabel}
                            <ChevronDown className="h-4 w-4 text-[#8a9791]" />
                        </button>
                        <p className="text-[14px] font-medium text-[#6f7b76]">{getHeaderRadius(selectedDistance)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(true)}
                            className="relative overflow-hidden rounded-xl border border-[#d6dfd8] bg-white px-3 py-2 text-[#1f2a2a] shadow-sm active:scale-95 transition-all"
                            aria-label="Open filters"
                        >
                            <div className="absolute inset-0 bg-[#ff6b3d]/10 opacity-0 hover:opacity-100 transition-opacity" />
                            <SlidersHorizontal className="h-4 w-4 relative z-10" />
                            {activeFilterCount > 0 && (
                                <span className="absolute -right-1 -top-1 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff6b3d] text-[10px] font-bold text-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => router.push("/consumer/profile")}
                            className="relative group rounded-xl border border-[#d6dfd8] bg-white px-3.5 py-2.5 text-[#1f2a2a] shadow-sm active:scale-95 transition-all overflow-hidden"
                            aria-label="Profile"
                        >
                            <div className="absolute inset-0 bg-[#ff6b3d]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <User className="h-5 w-5 text-[#ff6b3d] relative z-10" />
                        </button>

                    </div>
                </div>

                <div className="relative mt-5">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a9791]" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            if (event.target.value && preferences.categories.length > 0) {
                                setPreferences({ categories: [] });
                            }
                        }}
                        className="h-14 w-full rounded-2xl border border-[#d6dfd8] bg-white pl-12 pr-4 text-[16px] text-[#1f2a2a] outline-none placeholder:text-[#8a9791] focus:ring-2 focus:ring-[#ff6b3d]/25 transition-all font-medium"
                    />
                </div>
            </header>

            <main className="space-y-6 px-4 py-5">
                {sections.map((section) => (
                    <section key={section.title}>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-[18px] font-bold text-[#1f2a2a] tracking-tight">{section.title}</h2>
                            <button
                                onClick={() => router.push("/consumer/map")}
                                className="text-[14px] font-bold text-[#ff6b3d]"
                            >
                                See all ›
                            </button>
                        </div>

                        {section.items.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-[#d6dfd8] bg-white px-4 py-8 text-center text-sm text-[#6f7b76]">
                                No offers match your filters.
                            </div>
                        ) : (
                            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                {section.items.map((slot) => {
                                    const business = businessById.get(slot.businessId);
                                    if (!business) return null;

                                    const slotsLeft = Math.max(slot.inventory - slot.claimedCount, 0);
                                    const distanceInfo = calculateDistanceAndTime(
                                        userLoc.lat,
                                        userLoc.lng,
                                        business.lat,
                                        business.lng
                                    );

                                    return (
                                        <article
                                            key={`${section.title}-${slot.id}`}
                                            className="w-[62vw] max-w-[250px] shrink-0 overflow-hidden rounded-2xl border border-[#dfe6df] bg-white shadow-[0_10px_30px_-18px_rgba(23,31,29,0.25)] transition-all hover:bg-[#f9fbf9] sm:w-[280px] sm:max-w-[280px]"
                                        >
                                            <div
                                                className="relative h-28 cursor-pointer overflow-hidden sm:h-32"
                                                onClick={() => router.push("/consumer/map")}
                                            >
                                                <img src={business.image} alt={business.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                <span className="absolute left-2.5 top-2.5 rounded-full bg-[#ffe1d8] px-2 py-0.5 text-[10px] font-black text-[#b93812] sm:text-xs">
                                                    {slotsLeft} LEFT
                                                </span>

                                                <div className="absolute bottom-2.5 left-3 right-3">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="line-clamp-1 min-w-0 flex-1 text-base font-bold text-white tracking-tight">{business.name}</p>
                                                        <button
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                toggleFavourite(business.id);
                                                            }}
                                                            className={cn(
                                                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all active:scale-90",
                                                                isFavourite(business.id)
                                                                    ? "border-[#ff6b3d] bg-[#ff6b3d] text-white"
                                                                    : "border-white/50 bg-black/30 text-white backdrop-blur-md"
                                                            )}
                                                            aria-label={`Toggle favourite business ${business.name}`}
                                                        >
                                                            <Store className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 px-3.5 pb-3.5 pt-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="line-clamp-1 min-w-0 flex-1 text-[15px] font-bold text-[#1f2a2a]">{slot.title || "Surprise Bag"}</h3>
                                                    <button
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            toggleFavourite(slot.id);
                                                        }}
                                                        className={cn(
                                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all active:scale-90",
                                                            isFavourite(slot.id)
                                                                ? "border-[#ff6b3d]/40 bg-[#ff6b3d]/15 text-[#ff6b3d]"
                                                                : "border-[#d6dfd8] bg-[#f4f7f4] text-[#8a9791]"
                                                        )}
                                                        aria-label={`Toggle favourite offer ${slot.title || "Surprise Bag"}`}
                                                    >
                                                        <Heart className={cn("h-4 w-4", isFavourite(slot.id) && "fill-current")} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between pt-1">
                                                    <div className="flex items-center gap-2 text-[11px] text-[#6f7b76]">
                                                        <span className="inline-flex items-center gap-1 font-black text-[#ff6b3d]">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            {business.rating.toFixed(1)}
                                                        </span>
                                                        <span className="text-[#d3dbd5]">|</span>
                                                        <span className="font-medium">{formatKm(distanceInfo.distanceMeters / 1000)} km</span>
                                                        <span className="inline-flex items-center gap-1 text-[#ff6b3d] font-bold">
                                                            <Clock3 className="h-3 w-3" />
                                                            {Math.max(1, Math.ceil((slot.endsAt - Date.now()) / (1000 * 60 * 60)))}h
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-1.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[11px] text-[#b8c2bc] line-through">${(slot.originalPrice || 11.99).toFixed(2)}</span>
                                                            <span className="text-xl font-black leading-none text-[#1f2a2a] tracking-tighter">{getOfferPrice(slot)}</span>
                                                        </div>
                                                        <button
                                                            onClick={(event) => handleClaimSlot(slot.id, event)}
                                                            disabled={claiming === slot.id || slotsLeft === 0}
                                                            className="rounded-lg bg-[#ff6b3d] px-4 py-1.5 text-[11px] font-black text-white transition-all hover:brightness-95 disabled:opacity-50 active:scale-95"
                                                        >
                                                            {claiming === slot.id ? "..." : "CLAIM"}
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
                ))}
            </main>

            {showFilters && (
                <>
                    <div
                        className="fixed inset-0 z-[10000] bg-black/25"
                        onClick={() => setShowFilters(false)}
                    />

                    <div className="fixed inset-x-2 bottom-[72px] z-[10001] flex max-h-[68vh] flex-col overflow-hidden rounded-[2.5rem] border border-[#dfe6df] bg-[#f9fbf9] text-[#1f2a2a] shadow-2xl backdrop-blur-3xl sm:bottom-4 sm:top-20 sm:max-h-[calc(100vh-6rem)]">
                        <div className="sticky top-0 border-b border-[#e1e8e2] bg-[#f9fbf9]/95 px-4 py-4 backdrop-blur-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold tracking-tight text-[#1f2a2a]">Filters</h3>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={resetFilters}
                                        className="text-xs font-bold uppercase tracking-widest text-[#ff6b3d] hover:opacity-80 transition-opacity"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="rounded-xl bg-white p-2 text-[#1f2a2a] hover:bg-[#f0f5f1] transition-all border border-[#d6dfd8]"
                                        aria-label="Close filters"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 no-scrollbar">
                            <section>
                                <h4 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#8a9791]">Categories</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                const current = preferences.categories;
                                                const updated = current.includes(cat)
                                                    ? current.filter((item) => item !== cat)
                                                    : [...current, cat];
                                                setPreferences({ categories: updated });
                                            }}
                                            className={cn(
                                                "rounded-xl px-4 py-2 text-sm font-bold transition-all border",
                                                preferences.categories.includes(cat)
                                                    ? "border-[#ff6b3d] bg-[#ff6b3d] text-white shadow-[0_8px_18px_-10px_rgba(255,107,61,0.9)]"
                                                    : "bg-white border-[#d6dfd8] text-[#4f5e58] hover:bg-[#f4f8f4]"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h4 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#8a9791]">Distance</h4>
                                <div className="grid grid-cols-4 gap-2.5">
                                    {DISTANCE_OPTIONS.map((dist) => (
                                        <button
                                            key={dist}
                                            onClick={() => setSelectedDistance(dist)}
                                            className={cn(
                                                "rounded-xl py-2.5 text-sm font-bold transition-all border",
                                                selectedDistance === dist
                                                    ? "border-[#ff6b3d] bg-[#ff6b3d] text-white shadow-[0_8px_18px_-10px_rgba(255,107,61,0.9)]"
                                                    : "bg-white border-[#d6dfd8] text-[#4f5e58] hover:bg-[#f4f8f4]"
                                            )}
                                        >
                                            {dist}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="mb-4 flex items-center justify-between">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#8a9791]">Max Price</h4>
                                    <span className="text-sm font-bold text-[#ff6b3d]">
                                        {selectedPrice ? `Under $${selectedPrice}` : "Any"}
                                    </span>
                                </div>
                                <div className="relative px-2">
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
                                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#e0e7e1] accent-[#ff6b3d] transition-all"
                                    />
                                    <div className="mt-3 flex justify-between text-[10px] font-bold text-[#a8b3ac] uppercase tracking-tighter">
                                        <span>$0</span>
                                        <span>$25</span>
                                        <span>$50</span>
                                        <span>$75</span>
                                        <span>$100+</span>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#8a9791]">Preferences</h4>

                                <ToggleRow
                                    label="Has Loyalty Program"
                                    enabled={hasLoyalty}
                                    onClick={() => setHasLoyalty((prev) => !prev)}
                                />
                                <ToggleRow
                                    label="Accepts Bookings"
                                    enabled={acceptsBookings}
                                    onClick={() => setAcceptsBookings((prev) => !prev)}
                                />
                            </section>
                        </div>

                        <div className="border-t border-[#e1e8e2] bg-[#f9fbf9]/95 p-5 pb-safe backdrop-blur-xl">
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full rounded-2xl bg-[#ff6b3d] py-4 text-sm font-black text-white shadow-xl shadow-[#ff6b3d]/20 active:scale-[0.98] transition-all hover:brightness-95"
                            >
                                UPDATE RESULTS
                            </button>
                        </div>
                    </div>
                </>
            )}

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

function ToggleRow({ label, enabled, onClick }: { label: string; enabled: boolean; onClick: () => void }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#52615b]">{label}</span>
            <button
                onClick={onClick}
                className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300",
                    enabled ? "bg-[#ff6b3d]" : "bg-[#d6dfd8]"
                )}
                aria-label={label}
            >
                <span
                    className={cn(
                        "inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300",
                        enabled ? "translate-x-6" : "translate-x-1"
                    )}
                />
            </button>
        </div>
    );
}
