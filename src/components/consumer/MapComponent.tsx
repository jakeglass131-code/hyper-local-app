"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { type Map as MapLibreMap, type Marker, type StyleSpecification, type GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MOCK_BUSINESSES, CATEGORIES, type Business } from "@/lib/mockData";
import { useConsumerStore } from "@/store/consumerStore";
import { Navigation, Layers, X, SlidersHorizontal, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
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
  originalPrice?: number;
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
const BUSINESS_SOURCE_ID = "business-points";
const BUSINESS_HEAD_LAYER_ID = "business-pins-head";
const BUSINESS_CENTER_LAYER_ID = "business-pins-center";

function getOriginalOfferPrice(offer: ActiveOffer): number {
  return offer.originalPrice ?? 11.99;
}

function getDiscountedOfferPrice(offer: ActiveOffer): number {
  const base = getOriginalOfferPrice(offer);
  if (offer.discountType === "percent") {
    return base * (1 - offer.value / 100);
  }
  if (offer.discountType === "fixed") {
    return Math.max(base - offer.value, 1);
  }
  return base / 2;
}

function createUserMarkerElement() {
  const container = document.createElement("div");
  container.className = "relative flex items-center justify-center";
  container.style.width = "24px";
  container.style.height = "24px";

  const ripple = document.createElement("div");
  ripple.className = "absolute inset-0 rounded-full animate-ping";
  ripple.style.backgroundColor = "#3744D2";
  ripple.style.opacity = "0.3";
  container.appendChild(ripple);

  const marker = document.createElement("div");
  marker.style.width = "14px";
  marker.style.height = "14px";
  marker.style.borderRadius = "999px";
  marker.style.background = "#3744D2";
  marker.style.border = "2.5px solid #ffffff";
  marker.style.boxShadow = "0 0 20px rgba(79,70,229,0.5)";
  marker.style.position = "relative";
  marker.style.zIndex = "2";

  container.appendChild(marker);
  return container;
}

export default function MapComponent() {
  const searchParams = useSearchParams();
  const shouldAutoCenterOnOpenRef = useRef(searchParams.get("entry") === "tab");
  const {
    addToCart,
    setLocation,
    location,
    lastMapCenter,
    setLastMapCenter,
  } = useConsumerStore();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const hasCenteredToLiveLocationRef = useRef(false);

  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>("standard");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [offers, setOffers] = useState<ActiveOffer[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [flyingAnimations, setFlyingAnimations] = useState<
    Array<{ id: string; startPosition: { x: number; y: number } }>
  >([]);
  const [filters, setFilters] = useState(() => {
    let initialCategories: string[] = [];
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("categories");
      if (cat) {
        initialCategories = cat.split(",");
      }
    }
    return {
      categories: initialCategories,
      discountTier: "all" as DiscountTier,
    };
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
        const activeOffers = data
          .filter((offer) => offer.isActive)
          .map((offer) => ({
            ...offer,
            value: Number(offer.value),
          }))
          .filter((offer) => Number.isFinite(offer.value));
        setOffers(activeOffers);
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
        const currentValue = Number(current.value);
        const bestValue = Number(best.value);
        return currentValue > bestValue ? current : best;
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
        if (discount.value >= 50) return "#16A34A";
        if (discount.value >= 20) return "#F59E0B";
        return "#EF4444";
      }

      if (discount.value >= 10) return "#16A34A";
      if (discount.value >= 5) return "#F59E0B";
      return "#EF4444";
    },
    [getBestDiscount]
  );

  const getMarkerPriority = useCallback(
    (businessId: string) => {
      const discount = getBestDiscount(businessId);
      if (!discount) return 0;

      if (discount.type === "percent") {
        return discount.value;
      }

      return Math.min(discount.value * 5, 100);
    },
    [getBestDiscount]
  );

  const activeBusinessIds = useMemo(
    () => new Set(offers.map((offer) => offer.businessId)),
    [offers]
  );

  const filteredBusinesses = useMemo(() => {
    return MOCK_BUSINESSES.filter((business) => {
      if (!activeBusinessIds.has(business.id)) {
        return false;
      }

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
  }, [activeBusinessIds, filters, getBestDiscount]);

  const hasActiveFilters =
    filters.categories.length > 0 || filters.discountTier !== "all";

  const visibleBusinesses = useMemo(() => {
    return filteredBusinesses;
  }, [filteredBusinesses]);

  const businessFeatures = useMemo(
    () => ({
      type: "FeatureCollection",
      features: visibleBusinesses.map((business) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [business.lng, business.lat],
        },
        properties: {
          businessId: business.id,
          markerColor: getMarkerColor(business.id),
          markerPriority: getMarkerPriority(business.id),
        },
      })),
    }),
    [visibleBusinesses, getMarkerColor, getMarkerPriority]
  );

  const handleBusinessPointClick = useCallback((event: any) => {
    const feature = event.features?.[0];
    const businessId = feature?.properties?.businessId;
    if (!businessId) return;

    const business = MOCK_BUSINESSES.find((item) => item.id === businessId);
    if (business) setSelectedBusiness(business);
  }, []);

  const handleBusinessMouseEnter = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getCanvas().style.cursor = "pointer";
  }, []);

  const handleBusinessMouseLeave = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getCanvas().style.cursor = "";
  }, []);

  useEffect(() => {
    let disposed = false;

    if (!mapContainerRef.current || mapRef.current) return;

    const shouldAutoCenterOnOpen = shouldAutoCenterOnOpenRef.current;
    const initialCenter = shouldAutoCenterOnOpen && location
      ? [location.lng, location.lat]
      : initialCenterRef.current
        ? [initialCenterRef.current.lng, initialCenterRef.current.lat]
        : [PERTH_DEFAULT[1], PERTH_DEFAULT[0]];
    const initialZoom = shouldAutoCenterOnOpen && location ? 15 : (initialCenterRef.current?.zoom ?? 13);

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[initialStyleRef.current],
      center: initialCenter as [number, number],
      zoom: initialZoom,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      renderWorldCopies: false,
    });

    const onLoad = () => {
      if (disposed) return;

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

    if (location && shouldAutoCenterOnOpen) {
      hasCenteredToLiveLocationRef.current = true;
    }

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
      hasCenteredToLiveLocationRef.current = false;
    };
  }, [setLastMapCenter, setLocation]);

  useEffect(() => {
    if (!shouldAutoCenterOnOpenRef.current) return;
    if (!mapReady || !location || hasCenteredToLiveLocationRef.current) return;

    hasCenteredToLiveLocationRef.current = true;
    setLastMapCenter({ lat: location.lat, lng: location.lng, zoom: 15 });
    moveMapTo(location.lat, location.lng, 15);
  }, [location, mapReady, moveMapTo, setLastMapCenter]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    map.setStyle(MAP_STYLES[mapStyle]);
  }, [mapStyle, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const setupBusinessLayers = () => {
      if (!map.getSource(BUSINESS_SOURCE_ID)) {
        map.addSource(BUSINESS_SOURCE_ID, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
      }

      if (!map.getLayer(BUSINESS_HEAD_LAYER_ID)) {
        map.addLayer({
          id: BUSINESS_HEAD_LAYER_ID,
          type: "circle",
          source: BUSINESS_SOURCE_ID,
          layout: {
            "circle-sort-key": ["coalesce", ["get", "markerPriority"], 0],
          },
          paint: {
            "circle-radius": 10,
            "circle-color": ["get", "markerColor"],
            "circle-stroke-width": 2.5,
            "circle-stroke-color": "#ffffff",
            "circle-pitch-alignment": "map",
            "circle-pitch-scale": "map",
          },
        });
      }

      if (!map.getLayer(BUSINESS_CENTER_LAYER_ID)) {
        map.addLayer({
          id: BUSINESS_CENTER_LAYER_ID,
          type: "circle",
          source: BUSINESS_SOURCE_ID,
          layout: {
            "circle-sort-key": ["coalesce", ["get", "markerPriority"], 0],
          },
          paint: {
            "circle-radius": 3.2,
            "circle-color": "#ffffff",
            "circle-pitch-alignment": "map",
            "circle-pitch-scale": "map",
          },
        });
      }

      const source = map.getSource(BUSINESS_SOURCE_ID) as GeoJSONSource | undefined;
      if (source) {
        source.setData(businessFeatures as any);
      }

      map.off("click", BUSINESS_HEAD_LAYER_ID, handleBusinessPointClick);
      map.off("mouseenter", BUSINESS_HEAD_LAYER_ID, handleBusinessMouseEnter);
      map.off("mouseleave", BUSINESS_HEAD_LAYER_ID, handleBusinessMouseLeave);

      map.on("click", BUSINESS_HEAD_LAYER_ID, handleBusinessPointClick);
      map.on("mouseenter", BUSINESS_HEAD_LAYER_ID, handleBusinessMouseEnter);
      map.on("mouseleave", BUSINESS_HEAD_LAYER_ID, handleBusinessMouseLeave);
    };

    if (map.isStyleLoaded()) {
      setupBusinessLayers();
    } else {
      map.once("style.load", setupBusinessLayers);
    }

    return () => {
      map.off("click", BUSINESS_HEAD_LAYER_ID, handleBusinessPointClick);
      map.off("mouseenter", BUSINESS_HEAD_LAYER_ID, handleBusinessMouseEnter);
      map.off("mouseleave", BUSINESS_HEAD_LAYER_ID, handleBusinessMouseLeave);
    };
  }, [businessFeatures, handleBusinessMouseEnter, handleBusinessMouseLeave, handleBusinessPointClick, mapReady, mapStyle]);

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
    <div className="h-full w-full relative overflow-hidden">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 px-4 py-3 rounded-full shadow-xl border border-white/50 transition-all hover:scale-105 flex items-center gap-2"
      >
        <SlidersHorizontal className="h-5 w-5 text-brand" />
        <span className="text-sm font-semibold">Filters</span>
        {(filters.categories.length > 0 || filters.discountTier !== "all") && (
          <span className="bg-brand text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {filters.categories.length + (filters.discountTier !== "all" ? 1 : 0)}
          </span>
        )}
      </button>


      <button
        onClick={moveToCurrentLocation}
        disabled={locating}
        className="absolute top-20 right-4 z-[1000] bg-white/90 backdrop-blur-md hover:bg-white text-brand p-3.5 rounded-full shadow-xl border border-white/50 disabled:opacity-50 transition-all hover:scale-105"
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
                ? "bg-brand text-white shadow-md"
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
                      ? "bg-[#3744D2]/10 text-brand"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  {filters.categories.includes(category) ? (
                    <div className="w-4 h-4 rounded border border-brand bg-brand flex items-center justify-center">
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
              { id: "20-49", label: "20% - 49% off", color: "bg-amber-500" },
              { id: "under20", label: "Under 20% off", color: "bg-red-500" },
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
              })
            }
            className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 font-medium border-t border-gray-100 mt-2"
          >
            Reset All Filters
          </button>
        </div>
      )}

      <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />

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
              })
            }
            className="mt-2 text-xs font-semibold text-brand hover:text-brand-dark"
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
                <span className="w-2 h-2 bg-brand rounded-full"></span>
                Active Offers
              </h4>
              {getBusinessOffers(selectedBusiness.id).length > 0 ? (
                <div className="space-y-3">
                  {getBusinessOffers(selectedBusiness.id).map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-white border border-brand/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-block px-2 py-1 bg-[#3744D2]/10 text-brand text-xs font-bold rounded-lg">
                          {offer.discountType === "percent" ? `${offer.value}% OFF` : `$${offer.value} OFF`}
                        </span>
                        <span className="text-xs text-gray-500">
                          {offer.inventory - offer.claimedCount} left
                        </span>
                      </div>

                      <h5 className="font-bold text-gray-900 mb-1">{offer.title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-400 line-through">
                          ${getOriginalOfferPrice(offer).toFixed(2)}
                        </span>
                        <span className="text-lg font-black text-brand">
                          ${getDiscountedOfferPrice(offer).toFixed(2)}
                        </span>
                      </div>

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
                          className="flex-1 bg-brand text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
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
