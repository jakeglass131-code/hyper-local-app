"use client";

import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { MOCK_BUSINESSES, CATEGORIES } from "@/lib/mockData";
import { useConsumerStore } from "@/store/consumerStore";
import L from "leaflet";
import { Navigation, Layers, X, SlidersHorizontal, ShoppingCart, Heart, Calendar, Ticket, Coffee, Utensils, ShoppingBag, Zap, Sparkles, Dumbbell, Music, Palette, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FlyingTicketAnimation } from "@/components/FlyingTicketAnimation";
import { renderToString } from "react-dom/server";

// --- Custom Category Icons ---
const getCategoryIcon = (category: string) => {
    switch (category) {
        case "Coffee": return <Coffee className="w-4 h-4 text-white" />;
        case "Food": return <Utensils className="w-4 h-4 text-white" />;
        case "Retail": return <ShoppingBag className="w-4 h-4 text-white" />;
        case "Wellness": return <Sparkles className="w-4 h-4 text-white" />;
        case "Fitness": return <Dumbbell className="w-4 h-4 text-white" />;
        case "Entertainment": return <Music className="w-4 h-4 text-white" />;
        case "Beauty": return <Palette className="w-4 h-4 text-white" />;
        default: return <Zap className="w-4 h-4 text-white" />;
    }
};

const getCategoryColor = (category: string) => {
    switch (category) {
        case "Coffee": return "#78350f"; // Brown
        case "Food": return "#ea580c"; // Orange
        case "Retail": return "#0f766e"; // Teal
        case "Wellness": return "#7c3aed"; // Violet
        case "Fitness": return "#be123c"; // Rose
        case "Entertainment": return "#0369a1"; // Sky
        case "Beauty": return "#db2777"; // Pink
        default: return "#4f46e5"; // Indigo
    }
};

const createClusterCustomIcon = function (cluster: any) {
    return L.divIcon({
        html: `
            <div style="
                background-color: #111;
                color: white;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                font-weight: bold;
                font-size: 14px;
                border: 2px solid white;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            ">
                ${cluster.getChildCount()}
            </div>
        `,
        className: 'custom-marker-cluster',
        iconSize: L.point(36, 36, true),
    });
};

const userIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 16px;
        height: 16px;
        background: #4f46e5;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

const PERTH_DEFAULT: [number, number] = [-31.9523, 115.8613];

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

function LocationMarker() {
    const { location } = useConsumerStore();
    return location ? <Marker position={[location.lat, location.lng]} icon={userIcon} /> : null;
}

export default function MapComponent() {
    const router = useRouter();
    const { addToCart, cart, toggleFavourite, favourites } = useConsumerStore();
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

    // Memoized marker cache - only recreate when businesses or offers change
    const markerCache = useMemo(() => {
        const cache = new Map();
        MOCK_BUSINESSES.forEach(business => {
            const hasOffer = businessesWithOffers.has(business.id);
            const color = getCategoryColor(business.category);
            const iconSvg = renderToString(getCategoryIcon(business.category));

            cache.set(business.id, L.divIcon({
                className: "custom-business-marker",
                html: `
                    <div style="position: relative; width: 44px; height: 44px;">
                        <div style="
                            width: 32px; 
                            height: 32px; 
                            background: ${color}; 
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center;
                            border: 3px solid white;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                            position: absolute;
                            top: 6px;
                            left: 6px;
                            z-index: 10;
                        ">
                            ${iconSvg}
                        </div>
                        ${hasOffer ? `
                            <div style="
                                position: absolute;
                                top: 0;
                                right: 0;
                                background: #ef4444;
                                width: 14px;
                                height: 14px;
                                border-radius: 50%;
                                border: 2px solid white;
                                z-index: 20;
                            "></div>
                        ` : ''}
                    </div>
                `,
                iconSize: [44, 44],
                iconAnchor: [22, 22],
                popupAnchor: [0, -22],
            }));
        });
        return cache;
    }, [businessesWithOffers]);

    // Filter businesses based on selected filters - MEMOIZED
    const filteredBusinesses = useMemo(() => {
        return MOCK_BUSINESSES.filter(business => {
            // Category filter
            if (filters.categories.length > 0 && !filters.categories.includes(business.category)) {
                return false;
            }
            return true;
        });
    }, [filters]);

    return (
        <div className="h-[calc(100vh-180px)] w-full relative overflow-hidden rounded-xl bg-gray-100">


            {/* Filter Button - Top Right */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 px-4 py-3 rounded-full shadow-lg border border-white/50 transition-all hover:scale-105 flex items-center gap-2"
            >
                <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-semibold">Filters</span>
                {(filters.categories.length > 0) && (
                    <span className="bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {filters.categories.length}
                    </span>
                )}
            </button>

            {/* Filter Panel - Right Side */}
            {showFilters && (
                <div className="absolute top-16 right-4 z-[1000] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72 max-h-[70vh] overflow-y-auto animate-in slide-in-from-right-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-base">Filters</h3>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="space-y-2 mb-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        const newCategories = filters.categories.includes(category)
                                            ? filters.categories.filter((c) => c !== category)
                                            : [...filters.categories, category];
                                        setFilters({ ...filters, categories: newCategories });
                                    }}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                        filters.categories.includes(category)
                                            ? "bg-black text-white border-black"
                                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
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
                        className="w-full py-2 text-xs text-red-500 hover:text-red-700 font-bold border-t border-gray-100 mt-4"
                    >
                        Reset All Filters
                    </button>
                </div>
            )}

            <MapContainer
                center={PERTH_DEFAULT}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <LocateOnLoad />
                <LocateMeButton />
                <LocationMarker />

                <MarkerClusterGroup
                    chunkedLoading
                    iconCreateFunction={createClusterCustomIcon}
                    maxClusterRadius={60}
                    spiderfyOnMaxZoom={true}
                >
                    {filteredBusinesses.map((business) => (
                        <Marker
                            key={business.id}
                            position={[business.lat, business.lng]}
                            icon={markerCache.get(business.id)}
                            eventHandlers={{
                                click: () => setSelectedBusiness(business),
                            }}
                        />
                    ))}
                </MarkerClusterGroup>
            </MapContainer>

            {/* Business Detail Popup */}
            {selectedBusiness && (
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-gray-100 p-6 z-[1000] animate-in slide-in-from-bottom-6 max-h-[75vh] overflow-y-auto">
                    <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-gray-100">
                            <img
                                src={selectedBusiness.image}
                                alt={selectedBusiness.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{selectedBusiness.name}</h3>
                                    <p className="text-sm font-medium text-gray-500">{selectedBusiness.category}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedBusiness(null)}
                                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3 mt-3">
                                <span className="flex items-center text-sm font-bold text-gray-900">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                    {selectedBusiness.rating}
                                </span>
                                <span className="text-sm text-gray-400">•</span>
                                <span className="text-sm text-gray-500">0.8 km</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            className="flex-1 bg-black text-white font-bold py-3.5 rounded-xl shadow-lg shadow-gray-200 active:scale-[0.98] transition-all"
                            onClick={() => {
                                // In a real app, this would navigate to business detail page
                                alert("Navigate to Business Detail Page");
                            }}
                        >
                            View Details
                        </button>
                        <button
                            onClick={() => toggleFavourite(selectedBusiness.id)}
                            className="p-3.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <Heart
                                className={cn(
                                    "h-6 w-6 transition-colors",
                                    favourites.includes(selectedBusiness.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                                )}
                            />
                        </button>
                    </div>

                    {/* Active Offers Section */}
                    {businessesWithOffers.has(selectedBusiness.id) && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-indigo-600" />
                                Active Offers
                            </h4>
                            <div className="space-y-3">
                                {getBusinessOffers(selectedBusiness.id).map((offer) => (
                                    <div
                                        key={offer.id}
                                        className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-bold text-gray-900">{offer.title}</h5>
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold">
                                                {offer.discountType === "percent" ? `Save ${offer.value}%` : `Save $${offer.value}`}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{offer.description}</p>
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
                                            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
                                        >
                                            Claim Offer
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Flying Animations */}
            {flyingAnimations.map((animation) => (
                <FlyingTicketAnimation
                    key={animation.id}
                    targetId="nav-offers"
                    startPosition={animation.startPosition}
                    onComplete={() => {
                        setFlyingAnimations(prev => prev.filter(a => a.id !== animation.id));
                    }}
                />
            ))}
        </div>
    );
}
