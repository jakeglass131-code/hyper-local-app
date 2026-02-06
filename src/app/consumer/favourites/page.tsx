"use client";

import { useState } from "react";
import { MOCK_BUSINESSES, MOCK_OFFERS } from "@/lib/mockData";
import { useConsumerStore } from "@/store/consumerStore";
import { Heart, MapPin, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoHeader } from "@/components/consumer/LogoHeader";

export default function FavouritesPage() {
    const [tab, setTab] = useState<"businesses" | "offers">("businesses");
    const { favourites, toggleFavourite } = useConsumerStore();

    const favBusinesses = MOCK_BUSINESSES.filter((b) => favourites.includes(b.id));
    const favOffers = MOCK_OFFERS.filter((o) => favourites.includes(o.id));

    return (
        <div className="min-h-screen">
            <LogoHeader />
            <header className="bg-white px-4 py-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Favourites</h1>

                <div className="flex mt-4 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setTab("businesses")}
                        className={cn(
                            "flex-1 py-2 rounded-md text-sm font-medium transition-colors",
                            tab === "businesses" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                        )}
                    >
                        Businesses
                    </button>
                    <button
                        onClick={() => setTab("offers")}
                        className={cn(
                            "flex-1 py-2 rounded-md text-sm font-medium transition-colors",
                            tab === "offers" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                        )}
                    >
                        Offers
                    </button>
                </div>
            </header>

            <main className="px-4 py-6">
                {tab === "businesses" ? (
                    favBusinesses.length === 0 ? (
                        <div className="text-center py-12">
                            <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">No favourite businesses yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {favBusinesses.map((business) => (
                                <div key={business.id} className="flex bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                                    <div className="w-24 h-24 relative">
                                        <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{business.name}</h3>
                                                <p className="text-xs text-gray-500">{business.category} • {business.address}</p>
                                            </div>
                                            <button onClick={() => toggleFavourite(business.id)}>
                                                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
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
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    favOffers.length === 0 ? (
                        <div className="text-center py-12">
                            <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">No favourite offers yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {favOffers.map((offer) => {
                                const business = MOCK_BUSINESSES.find((b) => b.id === offer.businessId);
                                if (!business) return null;

                                return (
                                    <div key={`${offer.businessId}-${offer.id}`} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <img src={business.image} alt={business.name} className="h-10 w-10 rounded-full object-cover" />
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{business.name}</p>
                                                    <p className="text-xs text-gray-500">{business.category}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => toggleFavourite(offer.id)}>
                                                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                                            </button>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900 mb-1">{offer.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
                                        <div className="flex items-center text-xs font-medium text-red-500">
                                            <Clock className="mr-1 h-3 w-3" />
                                            Expires in 2h
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}
            </main>
        </div>
    );
}
