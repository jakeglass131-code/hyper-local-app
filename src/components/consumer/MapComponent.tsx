"use client";

import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MOCK_BUSINESSES, CATEGORIES } from "@/lib/mockData";
import { useConsumerStore } from "@/store/consumerStore";
import L from "leaflet";
import { Navigation, Layers, X, SlidersHorizontal, ShoppingCart, Heart, Calendar, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FlyingTicketAnimation } from "@/components/FlyingTicketAnimation";

// Clean, minimal marker icons
const createCustomIcon = (color: string) => {
    return L.divIcon({
        className: "custom-marker",
        html: `
      <div style="
        width: 12px;
        height: 12px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>
    `,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    });
};

const userIcon = createCustomIcon("#6366f1"); // Indigo
const businessIcon = createCustomIcon("#10b981"); // Green

const PERTH_DEFAULT: [number, number] = [-31.9523, 115.8613];

type MapStyle = "light" | "dark" | "satellite";

const MAP_STYLES = {
    light: {
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        label: "Street",
    },
    dark: {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        label: "Dark",
    },
    satellite: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: 'Tiles &copy; Esri',
        label: "Satellite",
    },
};

const LocateOnLoad = memo(function LocateOnLoad() {
    const map = useMap();
    const { setLocation, lastMapCenter, setLastMapCenter } = useConsumerStore();
    const [attempted, setAttempted] = useState(false);

    useEffect(() => {
        if (attempted) return;
        setAttempted(true);

        if (lastMapCenter) {
            map.setView([lastMapCenter.lat, lastMapCenter.lng], lastMapCenter.zoom);
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 15);
                    setLocation({ lat: latitude, lng: longitude });
                    setLastMapCenter({ lat: latitude, lng: longitude, zoom: 15 });
                },
                (error) => {
                    map.setView(PERTH_DEFAULT, 13);
                    setLastMapCenter({ lat: PERTH_DEFAULT[0], lng: PERTH_DEFAULT[1], zoom: 13 });
                }
            );
        } else {
            map.setView(PERTH_DEFAULT, 13);
            setLastMapCenter({ lat: PERTH_DEFAULT[0], lng: PERTH_DEFAULT[1], zoom: 13 });
        }
    }, [map, setLocation, lastMapCenter, setLastMapCenter, attempted]);

    useEffect(() => {
        const handleMoveEnd = () => {
            const center = map.getCenter();
            const zoom = map.getZoom();
            setLastMapCenter({ lat: center.lat, lng: center.lng, zoom });
        };

        map.on("moveend", handleMoveEnd);
        return () => {
            map.off("moveend", handleMoveEnd);
        };
    }, [map, setLastMapCenter]);

    return null;
});

const LocateMeButton = memo(function LocateMeButton() {
    const map = useMap();
    const { setLocation, setLastMapCenter } = useConsumerStore();
    const [locating, setLocating] = useState(false);

    const handleLocate = useCallback(() => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported");
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 15);
                setLocation({ lat: latitude, lng: longitude });
                setLastMapCenter({ lat: latitude, lng: longitude, zoom: 15 });
                setLocating(false);
            },
            () => {
                alert("Unable to retrieve location");
                setLocating(false);
            }
        );
    }, [map, setLocation, setLastMapCenter]);

    return (
        <button
            onClick={handleLocate}
            disabled={locating}
            className="absolute top-20 right-4 z-[1000] bg-white/90 backdrop-blur-md hover:bg-white text-indigo-600 p-3.5 rounded-full shadow-xl border border-white/50 disabled:opacity-50 transition-all hover:scale-105"
            title="My Location"
        >
            <Navigation className={cn("h-5 w-5", locating && "animate-spin")} />
        </button>
    );
});

function MapStyleToggle({
    style,
    setStyle,
}: {
    style: MapStyle;
    setStyle: (style: MapStyle) => void;
}) {
    const styles: { value: MapStyle; label: string }[] = [
        { value: "light", label: "Standard" },
        { value: "satellite", label: "Satellite" },
    ];

    return (
        <div className="absolute bottom-40 left-4 z-[1000] bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-1.5 flex flex-col gap-1">
            {styles.map((s) => (
                <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={cn(
                        "p-2.5 rounded-xl transition-all text-xs font-medium",
                        style === s.value
                            ? "bg-indigo-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                    )}
                    title={s.label}
                >
                    <Layers className="h-4 w-4" />
                </button>
            ))}
        </div>
    );
}

function LocationMarker() {
    const { location } = useConsumerStore();
    return location ? <Marker position={[location.lat, location.lng]} icon={userIcon} /> : null;
}

export default function MapComponent() {
    const router = useRouter();
    const { addToCart, cart, toggleFavourite, favourites } = useConsumerStore();
    const [mapStyle, setMapStyle] = useState<MapStyle>("light");
    const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
    const [offers, setOffers] = useState<any[]>([]);
    const [businessesWithOffers, setBusinessesWithOffers] = useState<Set<string>>(new Set());
    const [showFilters, setShowFilters] = useState(false);
    const [flyingAnimations, setFlyingAnimations] = useState<Array<{ id: string; startPosition: { x: number; y: number } }>>([]);
    const [filters, setFilters] = useState({
        categories: [] as string[],
        discountTier: "all" as "all" | "50+" | "20-49" | "under20",
        openNow: false,
    });

    // Fetch active offers on mount
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch("/api/offers");
                const data = await res.json();
                const activeOffers = data.filter((o: any) => o.isActive);
                setOffers(activeOffers);

                // Create a set of business IDs that have active offers
                const businessIds = new Set<string>(activeOffers.map((o: any) => o.businessId));
                setBusinessesWithOffers(businessIds);
            } catch (e) {
                console.error("Failed to fetch offers:", e);
            }
        };
        fetchOffers();
    }, []);

    // Get offers for a specific business
    const getBusinessOffers = (businessId: string) => {
        return offers.filter(o => o.businessId === businessId);
    };

    // Get best discount for a business
    const getBestDiscount = (businessId: string) => {
        const businessOffers = getBusinessOffers(businessId);
        if (businessOffers.length === 0) return null;

        // Find highest value offer
        const bestOffer = businessOffers.reduce((best, current) => {
            return current.value > best.value ? current : best;
        });

        return {
            value: bestOffer.value,
            type: bestOffer.discountType,
            display: bestOffer.discountType === "percent"
                ? `${bestOffer.value}% `
                : `$${bestOffer.value} `
        };
    };

    // Get border color based on discount value
    const getBorderColor = useCallback((businessId: string) => {
        const discount = getBestDiscount(businessId);

        if (!discount) return '#ffffff'; // White for no discount

        // Only use percentage for color coding
        if (discount.type === "percent") {
            if (discount.value >= 50) return '#10b981'; // Green for 50%+
            if (discount.value >= 20) return '#f59e0b'; // Orange for 20-49%
            return '#eab308'; // Yellow for under 20%
        }

        // For fixed discounts, use orange as default
        return '#f59e0b';
    }, [offers]); // Only recreate if offers change

    // Memoized marker cache - only recreate when businesses or offers change
    const markerCache = useMemo(() => {
        const cache = new Map();
        MOCK_BUSINESSES.forEach(business => {
            const hasOffer = businessesWithOffers.has(business.id);
            const borderColor = getBorderColor(business.id);

            cache.set(business.id, L.divIcon({
                className: "custom-business-marker",
                html: `
                    <div style="position: relative; width: 50px; height: 50px;">
                        <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden; border: ${hasOffer ? `3px solid ${borderColor}` : 'none'}; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                            <img src="${business.image}" style="width: 100%; height: 100%; object-fit: cover;" alt="${business.name}" />
                        </div>
                    </div>
                `,
                iconSize: [50, 50],
                iconAnchor: [25, 50],
                popupAnchor: [0, -50],
            }));
        });
        return cache;
    }, [businessesWithOffers, getBorderColor]);

    // Filter businesses based on selected filters - MEMOIZED
    const filteredBusinesses = useMemo(() => {
        return MOCK_BUSINESSES.filter(business => {
            // Only show businesses with active offers
            if (!businessesWithOffers.has(business.id)) {
                return false;
            }

            // Category filter
            if (filters.categories.length > 0 && !filters.categories.includes(business.category)) {
                return false;
            }

            // Discount tier filter
            if (filters.discountTier !== "all") {
                const discount = getBestDiscount(business.id);
                if (!discount || discount.type !== "percent") return false;

                if (filters.discountTier === "50+" && discount.value < 50) return false;
                if (filters.discountTier === "20-49" && (discount.value < 20 || discount.value >= 50)) return false;
                if (filters.discountTier === "under20" && discount.value >= 20) return false;
            }

            return true;
        });
    }, [filters, businessesWithOffers, getBestDiscount]); // Only recompute when filters or offers change

    return (
        <div className="h-[calc(100vh-180px)] w-full relative overflow-hidden rounded-xl">
            {/* Reservations Button - Top Left */}
            <button
                onClick={() => router.push('/consumer/reservations')}
                className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 p-3 rounded-full shadow-xl border border-white/50 transition-all hover:scale-105"
                data-reservations-button
            >
                <div className="relative">
                    <Ticket className="h-6 w-6 text-indigo-600" />
                    {cart?.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                            {cart.length}
                        </span>
                    )}
                </div>
            </button>

            {/* Filter Button - Top Right */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 px-4 py-3 rounded-full shadow-xl border border-white/50 transition-all hover:scale-105 flex items-center gap-2"
            >
                <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-semibold">Filters</span>
                {(filters.categories.length > 0 || filters.discountTier !== "all") && (
                    <span className="bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {filters.categories.length + (filters.discountTier !== "all" ? 1 : 0)}
                    </span>
                )}
            </button>

            {/* Filter Panel - Right Side */}
            {showFilters && (
                <div className="absolute top-16 right-4 z-[1000] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80 max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-base">Filters</h3>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Open Now Toggle */}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-medium text-gray-700">Open Now</span>
                        <button
                            onClick={() => setFilters({ ...filters, openNow: !filters.openNow })}
                            className={cn(
                                "w-11 h-6 rounded-full transition-colors relative",
                                filters.openNow ? "bg-green-500" : "bg-gray-200"
                            )}
                        >
                            <span
                                className={cn(
                                    "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform",
                                    filters.openNow ? "translate-x-5" : "translate-x-0"
                                )}
                            />
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4 mb-6">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</h4>
                        {Object.entries(CATEGORIES).map(([category, subcategories]) => (
                            <div key={category} className="space-y-2">
                                <button
                                    onClick={() => {
                                        const newCategories = filters.categories.includes(category)
                                            ? filters.categories.filter((c) => c !== category)
                                            : [...filters.categories, category];
                                        setFilters({ ...filters, categories: newCategories });
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        filters.categories.includes(category)
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "hover:bg-gray-50 text-gray-700"
                                    )}
                                >
                                    {filters.categories.includes(category) ? (
                                        <div className="w-4 h-4 rounded border border-indigo-600 bg-indigo-600 flex items-center justify-center">
                                            <X className="h-3 w-3 text-white" />
                                        </div>
                                    ) : (
                                        <div className="w-4 h-4 rounded border border-gray-300" />
                                    )}
                                    {category}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Discount Type */}
                    <div className="space-y-3 mb-6">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Discount</h4>
                        {[
                            { id: "50+", label: "50% off or more", color: "bg-green-500" },
                            { id: "20-49", label: "20% - 49% off", color: "bg-orange-500" },
                            { id: "under20", label: "Under 20% off", color: "bg-yellow-500" },
                        ].map((tier) => (
                            <button
                                key={tier.id}
                                onClick={() =>
                                    setFilters({
                                        ...filters,
                                        discountTier: filters.discountTier === tier.id ? "all" : (tier.id as any),
                                    })
                                }
                                className={cn(
                                    "flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                                    filters.discountTier === tier.id
                                        ? "bg-gray-100 font-medium"
                                        : "hover:bg-gray-50 text-gray-600"
                                )}
                            >
                                <div className={cn("w-3 h-3 rounded-full", tier.color)} />
                                {tier.label}
                            </button>
                        ))}
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={() =>
                            setFilters({
                                categories: [],
                                discountTier: "all",
                                openNow: false,
                            })
                        }
                        className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 font-medium border-t border-gray-100 mt-2"
                    >
                        Reset All Filters
                    </button>
                </div>
            )}

            <MapContainer
                center={PERTH_DEFAULT}
                zoom={13}
                scrollWheelZoom={true}
                className="h-[calc(100vh-180px)] w-full"
                zoomControl={false}
                attributionControl={false}
                zoomAnimation={true}
                fadeAnimation={true}
                markerZoomAnimation={true}
                zoomSnap={0.25}
                zoomDelta={0.25}
                wheelPxPerZoomLevel={480}
                doubleClickZoom={true}
                touchZoom={true}
                boxZoom={false}
            >
                <TileLayer
                    attribution={MAP_STYLES[mapStyle].attribution}
                    url={MAP_STYLES[mapStyle].url}
                />
                <LocateOnLoad />
                <LocateMeButton />
                <MapStyleToggle style={mapStyle} setStyle={setMapStyle} />
                <LocationMarker />
                {filteredBusinesses.map((business) => {
                    const hasOffer = businessesWithOffers.has(business.id);
                    return (
                        <Marker
                            key={business.id}
                            position={[business.lat, business.lng]}
                            icon={markerCache.get(business.id) || businessIcon}
                            eventHandlers={{
                                click: () => setSelectedBusiness(business),
                            }}
                        />
                    );
                })}
            </MapContainer>

            {/* Bottom Sheet / Popup */}
            {selectedBusiness && (
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 p-6 z-[1000] animate-in slide-in-from-bottom-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                                <img
                                    src={selectedBusiness.image}
                                    alt={selectedBusiness.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{selectedBusiness.name}</h3>
                                        <p className="text-sm text-gray-500">{selectedBusiness.category}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => toggleFavourite(selectedBusiness.id)}
                                            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                                        >
                                            <Heart
                                                className={cn(
                                                    "h-6 w-6 transition-colors",
                                                    favourites.includes(selectedBusiness.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                                                )}
                                            />
                                        </button>
                                        <button
                                            onClick={() => setSelectedBusiness(null)}
                                            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                                        >
                                            <X className="h-5 w-5 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                                        ⭐ {selectedBusiness.rating}
                                    </span>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                        Open Now
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Active Offers */}
                        {
                            businessesWithOffers.has(selectedBusiness.id) && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                        Active Offers
                                    </h4>
                                    <div className="space-y-3">
                                        {getBusinessOffers(selectedBusiness.id).map((offer) => (
                                            <div
                                                key={offer.id}
                                                className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg">
                                                        {offer.discountType === "percent"
                                                            ? `${offer.value}% OFF`
                                                            : `$${offer.value} OFF`}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {offer.inventory - offer.claimedCount} left
                                                    </span>
                                                </div>

                                                <h5 className="font-bold text-gray-900 mb-1">{offer.title}</h5>
                                                <p className="text-sm text-gray-600 mb-3">{offer.description}</p>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            const startPosition = {
                                                                x: rect.left + rect.width / 2,
                                                                y: rect.top + rect.height / 2,
                                                            };
                                                            setFlyingAnimations(prev => [...prev, { id: `${offer.id}-${Date.now()}`, startPosition }]);
                                                            addToCart(offer);
                                                        }}
                                                        className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                                    >
                                                        <Ticket className="h-4 w-4" />
                                                        Reserve Now
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    </div >
                </div >
            )
            }

            {/* Flying Ticket Animations */}
            {
                flyingAnimations.map((animation) => (
                    <FlyingTicketAnimation
                        key={animation.id}
                        startPosition={animation.startPosition}
                        onComplete={() => {
                            setFlyingAnimations(prev => prev.filter(a => a.id !== animation.id));
                        }}
                    />
                ))
            }
        </div >
    );
}
