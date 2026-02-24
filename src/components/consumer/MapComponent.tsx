"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { type Map as MapLibreMap, type Marker, type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MOCK_BUSINESSES, CATEGORIES, type Business } from "@/lib/mockData";
import { useConsumerStore } from "@/store/consumerStore";
import { Navigation, Layers, X, SlidersHorizontal, Heart, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FlyingTicketAnimation } from "@/components/FlyingTicketAnimation";

const PERTH_DEFAULT: [number, number] = [-31.9523, 115.8613];

type MapStyle = "standard" | "satellite";
type DiscountTier = "all" | "50+" | "20-49" | "under20";

type ActiveOffer = {
  id: string;
  businessId: string;
  isActive: boolean;
  value: number;
  discountType: "percent" | "fixed";
  title: string;
  description: string;
  inventory: number;
  claimedCount: number;
};

const STANDARD_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    base: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [{ id: "base", type: "raster", source: "base" }],
};

const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: "raster",
      tiles: [
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "Tiles &copy; Esri",
    },
  },
  layers: [{ id: "satellite", type: "raster", source: "satellite" }],
};

const MAP_STYLES: Record<MapStyle, StyleSpecification> = {
  standard: STANDARD_STYLE,
  satellite: SATELLITE_STYLE,
};

function getCategoryGlyph(category: string) {
  const glyphs: Record<string, string> = {
    Food: "F",
    Coffee: "C",
    Drinks: "D",
    Wellness: "W",
    Beauty: "B",
    Fitness: "G",
    Retail: "R",
    Entertainment: "E",
  };

  return glyphs[category] ?? "•";
}

function createBusinessMarkerElement(
  business: Business,
  color: string,
  hasOffer: boolean,
  onSelect: () => void
) {
  const container = document.createElement("div");
  container.style.width = "56px";
  container.style.height = "56px";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.position = "relative";
  container.style.cursor = "pointer";

  // Pulse effect for offers
  if (hasOffer) {
    const pulse = document.createElement("div");
    pulse.style.position = "absolute";
    pulse.style.inset = "0";
    pulse.style.borderRadius = "999px";
    pulse.style.backgroundColor = color;
    pulse.style.opacity = "0.4";
    // Using a standard animation if available, otherwise just a glow
    pulse.className = "animate-ping";
    container.appendChild(pulse);
  }

  const button = document.createElement("button");
  button.type = "button";
  button.title = business.name;
  button.style.width = "48px";
  button.style.height = "48px";
  button.style.borderRadius = "14px";
  button.style.border = `2.5px solid ${hasOffer ? color : "#ffffff"}`;
  button.style.background = "#e2e8f0"; // Fallback color
  button.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.cursor = "pointer";
  button.style.transition = "all 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275)";
  button.style.overflow = "hidden";
  button.style.position = "relative";
  button.style.padding = "0";

  // Business Image / Logo
  const img = document.createElement("img");
  img.src = business.image;
  img.alt = business.name;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  button.appendChild(img);

  // Category Badge
  const badge = document.createElement("div");
  badge.textContent = getCategoryGlyph(business.category);
  badge.style.position = "absolute";
  badge.style.bottom = "-2px";
  badge.style.right = "-2px";
  badge.style.width = "18px";
  badge.style.height = "18px";
  badge.style.background = color;
  badge.style.color = "white";
  badge.style.borderRadius = "6px";
  badge.style.fontSize = "10px";
  badge.style.fontWeight = "bold";
  badge.style.display = "flex";
  badge.style.alignItems = "center";
  badge.style.justifyContent = "center";
  badge.style.border = "2px solid white";
  badge.style.zIndex = "20";

  button.appendChild(badge);
  container.appendChild(button);

  button.addEventListener("mouseenter", () => {
    button.style.transform = "scale(1.15) translateY(-4px)";
    button.style.boxShadow = "0 12px 24px rgba(0,0,0,0.25)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "scale(1) translateY(0)";
    button.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
  });

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect();
  });

  return container;
}

function createUserMarkerElement() {
  const container = document.createElement("div");
  container.className = "relative flex items-center justify-center";
  container.style.width = "24px";
  container.style.height = "24px";

  const ripple = document.createElement("div");
  ripple.className = "absolute inset-0 rounded-full animate-ping";
  ripple.style.backgroundColor = "#4F46E5";
  ripple.style.opacity = "0.3";
  container.appendChild(ripple);

  const marker = document.createElement("div");
  marker.style.width = "14px";
  marker.style.height = "14px";
  marker.style.borderRadius = "999px";
  marker.style.background = "#4F46E5";
  marker.style.border = "2.5px solid #ffffff";
  marker.style.boxShadow = "0 0 20px rgba(79,70,229,0.5)";
  marker.style.position = "relative";
  marker.style.zIndex = "2";

  container.appendChild(marker);
  return container;
}

export default function MapComponent() {
  const router = useRouter();
  const {
    addToCart,
    cart,
    toggleFavourite,
    favourites,
    setLocation,
    location,
    lastMapCenter,
    setLastMapCenter,
  } = useConsumerStore();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const userMarkerRef = useRef<Marker | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>("standard");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [offers, setOffers] = useState<ActiveOffer[]>([]);
  const [businessesWithOffers, setBusinessesWithOffers] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [flyingAnimations, setFlyingAnimations] = useState<
    Array<{ id: string; startPosition: { x: number; y: number } }>
  >([]);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    discountTier: "all" as DiscountTier,
    openNow: false,
  });

  const initialCenterRef = useRef(lastMapCenter);
  const initialStyleRef = useRef(mapStyle);

  const moveMapTo = useCallback((lat: number, lng: number, zoom: number) => {
    const map = mapRef.current;
    if (!map) return;

    map.easeTo({ center: [lng, lat], zoom, duration: 600 });
  }, []);

  const moveToCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported on this device.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLastMapCenter({ lat: latitude, lng: longitude, zoom: 15 });
        moveMapTo(latitude, longitude, 15);
        setLocating(false);
      },
      () => {
        alert("Unable to retrieve your location.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [moveMapTo, setLastMapCenter, setLocation]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/offers");
        const data = (await res.json()) as ActiveOffer[];
        const activeOffers = data.filter((offer) => offer.isActive);
        setOffers(activeOffers);

        const businessIds = new Set<string>(activeOffers.map((offer) => offer.businessId));
        setBusinessesWithOffers(businessIds);
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      }
    };

    fetchOffers();
  }, []);

  const getBusinessOffers = useCallback(
    (businessId: string) => offers.filter((offer) => offer.businessId === businessId),
    [offers]
  );

  const getBestDiscount = useCallback(
    (businessId: string) => {
      const businessOffers = getBusinessOffers(businessId);
      if (businessOffers.length === 0) return null;

      const bestOffer = businessOffers.reduce((best, current) => {
        return current.value > best.value ? current : best;
      });

      return {
        value: bestOffer.value,
        type: bestOffer.discountType,
        display: bestOffer.discountType === "percent" ? `${bestOffer.value}%` : `$${bestOffer.value}`,
      };
    },
    [getBusinessOffers]
  );

  const getMarkerColor = useCallback(
    (businessId: string) => {
      const discount = getBestDiscount(businessId);
      if (!discount) return "#9CA3AF";

      if (discount.type === "percent") {
        if (discount.value >= 50) return "#10B981";
        if (discount.value >= 20) return "#F59E0B";
        return "#EAB308";
      }

      return "#F59E0B";
    },
    [getBestDiscount]
  );

  const filteredBusinesses = useMemo(() => {
    return MOCK_BUSINESSES.filter((business) => {
      if (filters.categories.length > 0 && !filters.categories.includes(business.category)) {
        return false;
      }

      if (filters.discountTier !== "all") {
        const discount = getBestDiscount(business.id);
        if (!discount || discount.type !== "percent") return false;

        if (filters.discountTier === "50+" && discount.value < 50) return false;
        if (
          filters.discountTier === "20-49" &&
          (discount.value < 20 || discount.value >= 50)
        ) {
          return false;
        }
        if (filters.discountTier === "under20" && discount.value >= 20) return false;
      }

      return true;
    });
  }, [filters, getBestDiscount]);

  const hasActiveFilters =
    filters.categories.length > 0 || filters.discountTier !== "all" || filters.openNow;

  const visibleBusinesses = useMemo(() => {
    // Keep default view populated even if offer data is delayed.
    if (!hasActiveFilters && filteredBusinesses.length === 0) return MOCK_BUSINESSES;
    return filteredBusinesses;
  }, [filteredBusinesses, hasActiveFilters]);

  useEffect(() => {
    let disposed = false;

    if (!mapContainerRef.current || mapRef.current) return;

    const initialCenter = initialCenterRef.current
      ? [initialCenterRef.current.lng, initialCenterRef.current.lat]
      : [PERTH_DEFAULT[1], PERTH_DEFAULT[0]];
    const initialZoom = initialCenterRef.current?.zoom ?? 13;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[initialStyleRef.current],
      center: initialCenter as [number, number],
      zoom: initialZoom,
      attributionControl: {},
      dragRotate: false,
      pitchWithRotate: false,
    });

    const onLoad = () => {
      if (disposed) return;

      // Show the full business area on load so all markers are visible.
      if (MOCK_BUSINESSES.length > 0) {
        const lats = MOCK_BUSINESSES.map((business) => business.lat);
        const lngs = MOCK_BUSINESSES.map((business) => business.lng);

        map.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          { padding: 56, duration: 0, maxZoom: 13 }
        );
      }

      setMapReady(true);
    };

    const onMoveEnd = () => {
      const center = map.getCenter();
      setLastMapCenter({
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom(),
      });
    };

    const onError = (error: unknown) => {
      console.error("Map render warning:", error);
    };

    map.on("load", onLoad);
    map.on("moveend", onMoveEnd);
    map.on("error", onError);

    mapRef.current = map;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        () => { },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    return () => {
      disposed = true;

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }

      map.off("load", onLoad);
      map.off("moveend", onMoveEnd);
      map.off("error", onError);
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [moveMapTo, setLastMapCenter, setLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    map.setStyle(MAP_STYLES[mapStyle]);
  }, [mapStyle, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((marker) => marker.remove());

    const nextMarkers = visibleBusinesses.map((business) => {
      const markerEl = createBusinessMarkerElement(
        business,
        getMarkerColor(business.id),
        businessesWithOffers.has(business.id),
        () => setSelectedBusiness(business)
      );

      return new maplibregl.Marker({ element: markerEl, anchor: "center" })
        .setLngLat([business.lng, business.lat])
        .addTo(map);
    });

    markersRef.current = nextMarkers;
  }, [businessesWithOffers, getMarkerColor, mapReady, mapStyle, visibleBusinesses]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (!location) return;

    userMarkerRef.current = new maplibregl.Marker({
      element: createUserMarkerElement(),
      anchor: "center",
    })
      .setLngLat([location.lng, location.lat])
      .addTo(map);
  }, [location, mapReady, mapStyle]);

  return (
    <div className="h-[calc(100vh-180px)] w-full relative overflow-hidden rounded-xl">
      <button
        onClick={() => router.push("/consumer/reservations")}
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

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md text-gray-700 px-3 py-1.5 rounded-full shadow-lg border border-white/50 text-xs font-semibold">
        {visibleBusinesses.length} businesses
      </div>

      <button
        onClick={moveToCurrentLocation}
        disabled={locating}
        className="absolute top-20 right-4 z-[1000] bg-white/90 backdrop-blur-md hover:bg-white text-indigo-600 p-3.5 rounded-full shadow-xl border border-white/50 disabled:opacity-50 transition-all hover:scale-105"
        title="My Location"
      >
        <Navigation className={cn("h-5 w-5", locating && "animate-spin")} />
      </button>

      <div className="absolute bottom-40 left-4 z-[1000] bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-1.5 flex flex-col gap-1">
        {[
          { value: "standard" as MapStyle, label: "Standard" },
          { value: "satellite" as MapStyle, label: "Satellite" },
        ].map((style) => (
          <button
            key={style.value}
            onClick={() => setMapStyle(style.value)}
            className={cn(
              "p-2.5 rounded-xl transition-all text-xs font-medium",
              mapStyle === style.value
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            )}
            title={style.label}
          >
            <Layers className="h-4 w-4" />
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="absolute top-16 right-4 z-[1000] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

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

          <div className="space-y-4 mb-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</h4>
            {CATEGORIES.map((category) => (
              <div key={category} className="space-y-2">
                <button
                  onClick={() => {
                    const newCategories = filters.categories.includes(category)
                      ? filters.categories.filter((item) => item !== category)
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
                    discountTier: filters.discountTier === tier.id ? "all" : (tier.id as DiscountTier),
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

      <div ref={mapContainerRef} className="h-[calc(100vh-180px)] w-full" />

      {!mapReady && (
        <div className="absolute inset-0 z-[900] flex items-center justify-center bg-white/75 backdrop-blur-sm">
          <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-lg border border-gray-200">
            Loading map...
          </div>
        </div>
      )}

      {hasActiveFilters && filteredBusinesses.length === 0 && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl px-4 py-3 text-center">
          <p className="text-sm font-medium text-gray-800">No businesses match filters</p>
          <button
            onClick={() =>
              setFilters({
                categories: [],
                discountTier: "all",
                openNow: false,
              })
            }
            className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Reset filters
          </button>
        </div>
      )}

      {selectedBusiness && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 p-6 z-[1000] animate-in slide-in-from-bottom-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                <div
                  aria-label={selectedBusiness.name}
                  role="img"
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${selectedBusiness.image})` }}
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
                          favourites.includes(selectedBusiness.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
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

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                Active Offers
              </h4>
              {businessesWithOffers.has(selectedBusiness.id) ? (
                <div className="space-y-3">
                  {getBusinessOffers(selectedBusiness.id).map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg">
                          {offer.discountType === "percent" ? `${offer.value}% OFF` : `$${offer.value} OFF`}
                        </span>
                        <span className="text-xs text-gray-500">
                          {offer.inventory - offer.claimedCount} left
                        </span>
                      </div>

                      <h5 className="font-bold text-gray-900 mb-1">{offer.title}</h5>
                      <p className="text-sm text-gray-600 mb-3">{offer.description}</p>

                      <div className="flex gap-2">
                        <button
                          onClick={(event) => {
                            const rect = event.currentTarget.getBoundingClientRect();
                            const startPosition = {
                              x: rect.left + rect.width / 2,
                              y: rect.top + rect.height / 2,
                            };
                            setFlyingAnimations((prev) => [
                              ...prev,
                              { id: `${offer.id}-${Date.now()}`, startPosition },
                            ]);
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
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-600">
                  No active offers right now for this business.
                </div>
              )}
            </div>
          </div>
        </div>
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
