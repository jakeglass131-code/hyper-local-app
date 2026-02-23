"use client";

import { useState } from "react";
import { MOCK_BUSINESSES, MOCK_OFFERS } from "@/lib/mockData";
import { useConsumerStore } from "@/store/consumerStore";
import { Heart, MapPin, Star, Clock, ArrowLeft, Tag, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getTimeRemaining } from "@/lib/displayHelpers";

export default function FavouritesPage() {
    const router = useRouter();
    const [tab, setTab] = useState<"businesses" | "offers">("businesses");
    const { favourites, toggleFavourite } = useConsumerStore();

    // Filter Logic
    const favBusinesses = MOCK_BUSINESSES.filter((b) => favourites.includes(b.id));
    const favOffers = MOCK_OFFERS.filter((o) => favourites.includes(o.id));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-24">
            {/* Header */}
            <header className="bg-white dark:bg-neutral-900 sticky top-0 z-10 px-4 py-3 shadow-sm border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Favourites</h1>
                <div className="w-9" /> {/* Spacer */}
            </header>

            <main className="px-4 pt-4 space-y-6">
                {/* Tabs */}
                <div className="bg-gray-200 dark:bg-neutral-800 p-1 rounded-xl flex">
                    <button
                        onClick={() => setTab("businesses")}
                        className={cn(
                            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                            tab === "businesses"
                                ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                        )}
                    >
                        Businesses
                    </button>
                    <button
                        onClick={() => setTab("offers")}
                        className={cn(
                            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                            tab === "offers"
                                ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                        )}
                    >
                        Offers
                    </button>
                </div>

                {/* Content */}
                {tab === "businesses" ? (
                    favBusinesses.length === 0 ? (
                        <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-300">
                            <div className="bg-pink-50 dark:bg-pink-900/10 p-6 rounded-full inline-block mb-4">
                                <Heart className="h-12 w-12 text-pink-400 fill-pink-100 dark:fill-pink-900/20" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No favourites yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-[250px] mx-auto leading-relaxed">
                                Save places you love to find them quickly later.
                            </p>
                            <button
                                onClick={() => router.push('/consumer/map')}
                                className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform"
                            >
                                Explore Map
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {favBusinesses.map((business) => (
                                <div key={business.id} className="flex bg-white dark:bg-neutral-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-neutral-800 active:scale-[0.99] transition-transform">
                                    <div className="w-28 h-28 relative shrink-0">
                                        <img src={business.image || "/placeholder.jpg"} alt={business.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center shadow-sm">
                                            <Star className="h-2.5 w-2.5 text-yellow-500 fill-yellow-500 mr-1" />
                                            {business.rating}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-3 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1">{business.name}</h3>
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{business.category}</p>
                                            </div>
                                            <button
                                                onClick={() => toggleFavourite(business.id)}
                                                className="p-1.5 -mr-1.5 -mt-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between text-xs mt-2">
                                            <div className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800 px-2 py-1 rounded-md">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                0.8 km
                                            </div>
                                            <button className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    favOffers.length === 0 ? (
                        <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-300">
                            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-full inline-block mb-4">
                                <Tag className="h-12 w-12 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No saved offers</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-[250px] mx-auto leading-relaxed">
                                Keep track of deals you don't want to miss.
                            </p>
                            <button
                                onClick={() => router.push('/consumer/home')}
                                className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform"
                            >
                                Browse Offers
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {favOffers.map((offer) => {
                                const business = MOCK_BUSINESSES.find((b) => b.id === offer.businessId);
                                if (!business) return null;

                                return (
                                    <div key={`${offer.businessId}-${offer.id}`} className="bg-white dark:bg-neutral-900 rounded-2xl p-0 shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden">
                                        <div className="h-32 relative bg-gray-200">
                                            <img src={business.image || "/placeholder.jpg"} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" alt={business.name} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <button
                                                    onClick={() => toggleFavourite(offer.id)}
                                                    className="p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                                                >
                                                    <Heart className="h-4 w-4 fill-white" />
                                                </button>
                                            </div>

                                            <div className="absolute bottom-3 left-3 right-3">
                                                <span className="text-xs font-bold text-white/90 uppercase tracking-wide mb-0.5 block">
                                                    {business.category}
                                                </span>
                                                <h3 className="text-lg font-extrabold text-white leading-tight shadow-black drop-shadow-md">
                                                    {offer.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center">
                                                    <Tag className="h-3 w-3 mr-1.5" />
                                                    {offer.discountType === 'percent' ? `Save ${offer.value}%` : `Save $${offer.value}`}
                                                </div>
                                                <div className="flex items-center text-xs text-orange-600 font-bold bg-orange-50 dark:bg-orange-900/10 px-2 py-1 rounded-lg">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {getTimeRemaining(offer.expiresAt || Date.now() + 86400000)}
                                                </div>
                                            </div>
                                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                                                View
                                            </button>
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
