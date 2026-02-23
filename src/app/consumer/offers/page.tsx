"use client";

import { useState, useEffect } from "react";
import { MOCK_BUSINESSES, MOCK_OFFERS, CATEGORIES } from "@/lib/mockData";
import { useConsumerStore } from "@/store/consumerStore";
import { Heart, Tag, Clock, Ticket, ArrowLeft, History, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getTimeRemaining } from "@/lib/displayHelpers";
import { VoucherModal } from "@/components/consumer/VoucherModal";
import Link from "next/link";

export default function OffersPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"saved" | "upcoming" | "history">("upcoming");
    const { favourites, toggleFavourite } = useConsumerStore();
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loadingVouchers, setLoadingVouchers] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<any | null>(null);

    // Fetch Vouchers for "upcoming" tab
    useEffect(() => {
        if (activeTab === "upcoming" || activeTab === "history") {
            fetchVouchers();
        }
    }, [activeTab]);

    const fetchVouchers = async () => {
        setLoadingVouchers(true);
        try {
            // In a real app, userId would be dynamic
            const res = await fetch(`/api/claims?userId=user_123`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setVouchers(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error("Failed to fetch vouchers", e);
        } finally {
            setLoadingVouchers(false);
        }
    };

    const handleCancelClaim = async (claimId: string) => {
        if (!confirm("Are you sure you want to cancel this reservation?")) return;

        try {
            const res = await fetch("/api/claims/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ claimId, userId: "user_123" }),
            });

            if (res.ok) {
                // Refresh list
                fetchVouchers();
            } else {
                alert("Failed to cancel reservation");
            }
        } catch (e) {
            console.error("Error cancelling claim", e);
        }
    };

    // Filter Logic
    const favOffers = MOCK_OFFERS.filter((o) => favourites.includes(o.id));

    // Derived Vouchers
    const activeVouchers = vouchers.filter(v => v.status === 'issued');
    const pastVouchers = vouchers.filter(v => v.status !== 'issued'); // redeemed, expired, cancelled

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-24">
            {/* Header */}
            <header className="bg-white dark:bg-neutral-900 sticky top-0 z-10 px-4 py-3 shadow-sm border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Offers</h1>
                <div className="w-9" />
            </header>

            <main className="px-4 pt-4 space-y-6">
                {/* Tabs */}
                <div className="bg-white dark:bg-neutral-900 p-1 rounded-xl flex shadow-sm border border-gray-100 dark:border-neutral-800">
                    <button
                        onClick={() => setActiveTab("saved")}
                        className={cn(
                            "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
                            activeTab === "saved"
                                ? "bg-indigo-50 text-indigo-600 dark:bg-neutral-800 dark:text-white"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                        )}
                    >
                        Saved
                    </button>
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={cn(
                            "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
                            activeTab === "upcoming"
                                ? "bg-indigo-50 text-indigo-600 dark:bg-neutral-800 dark:text-white"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                        )}
                    >
                        Upcoming Reservations
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={cn(
                            "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
                            activeTab === "history"
                                ? "bg-indigo-50 text-indigo-600 dark:bg-neutral-800 dark:text-white"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                        )}
                    >
                        History
                    </button>
                </div>

                {/* Content: SAVED */}
                {activeTab === "saved" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        {favOffers.length === 0 ? (
                            <EmptyState
                                icon={Heart}
                                title="No saved offers"
                                description="Tap the heart icon on any offer to save it for later."
                                actionLabel="Browse Offers"
                                onAction={() => router.push('/consumer/home')}
                            />
                        ) : (
                            <div className="grid gap-4">
                                {favOffers.map((offer) => {
                                    const business = MOCK_BUSINESSES.find((b) => b.id === offer.businessId);
                                    if (!business) return null;

                                    return (
                                        <div key={`${offer.businessId}-${offer.id}`} className="bg-white dark:bg-neutral-900 rounded-2xl p-0 shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden">
                                            <div className="h-32 relative bg-gray-200">
                                                <img src={business.image || "/placeholder.jpg"} className="w-full h-full object-cover opacity-90" alt={business.name} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <div className="absolute top-3 right-3">
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
                                                    <h3 className="text-lg font-extrabold text-white leading-tight">
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
                                                </div>
                                                <button
                                                    onClick={() => router.push('/consumer/home')}
                                                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                                                >
                                                    View Deal
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Content: UPCOMING RESERVATIONS */}
                {activeTab === "upcoming" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {loadingVouchers ? (
                            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
                        ) : activeVouchers.length === 0 ? (
                            <EmptyState
                                icon={Ticket}
                                title="No upcoming reservations"
                                description="Claim offers from the home page to see them here."
                                actionLabel="Find Deals"
                                onAction={() => router.push('/consumer/home')}
                            />
                        ) : (
                            <div className="space-y-4">
                                {activeVouchers.map((voucher) => (
                                    <VoucherCard
                                        key={voucher.id}
                                        voucher={voucher}
                                        onClick={() => setSelectedVoucher(voucher)}
                                        onCancel={() => handleCancelClaim(voucher.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Content: HISTORY */}
                {activeTab === "history" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {loadingVouchers ? (
                            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
                        ) : pastVouchers.length === 0 ? (
                            <EmptyState
                                icon={History}
                                title="No history"
                                description="Your redeemed and expired vouchers will appear here."
                            />
                        ) : (
                            <div className="space-y-4 opacity-75">
                                {pastVouchers.map((voucher) => (
                                    <VoucherCard
                                        key={voucher.id}
                                        voucher={voucher}
                                        isHistory
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Voucher Modal */}
            {selectedVoucher && (
                <VoucherModal
                    isOpen={!!selectedVoucher}
                    onClose={() => setSelectedVoucher(null)}
                    voucherCode={selectedVoucher.voucherCode}
                    expiresAt={selectedVoucher.expiresAt}
                    offerTitle={selectedVoucher.offer?.title || "Special Offer"}
                    businessName={selectedVoucher.business?.name || "Partner Business"}
                />
            )}
        </div>
    );
}

// Helper Components

function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: any) {
    return (
        <div className="text-center py-16 px-4">
            <div className="bg-gray-100 dark:bg-neutral-800 p-6 rounded-full inline-flex mb-4">
                <Icon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-[250px] mx-auto leading-relaxed text-sm">
                {description}
            </p>
            {actionLabel && (
                <button
                    onClick={onAction}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:scale-105 transition-transform"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

function VoucherCard({ voucher, onClick, onCancel, isHistory }: any) {
    const { offer, business } = voucher;

    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-neutral-800",
                !isHistory && "active:scale-[0.98] transition-transform cursor-pointer"
            )}
        >
            <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
                    {/* Fallback if business data missing, though backend should provide it */}
                    {business?.image && (
                        <img src={business.image || "/placeholder.jpg"} className="w-full h-full object-cover" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white truncate pr-2">{offer?.title || "Unknown Offer"}</h4>
                            <p className="text-xs text-gray-500">{business?.name || "Unknown Business"}</p>
                        </div>
                        {isHistory ? (
                            <span className={cn(
                                "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                                voucher.status === 'redeemed' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                            )}>
                                {voucher.status}
                            </span>
                        ) : (
                            <div className="text-center bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase block leading-none mb-0.5">Code</span>
                                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{voucher.voucherCode?.substring(0, 4)}...</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            {/* Reservation Name */}
                            {voucher.reservationName && (
                                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Reservation Name: <span className="text-gray-900 dark:text-white">{voucher.reservationName}</span>
                                </div>
                            )}

                            <div className="flex items-center text-xs text-orange-600 font-bold bg-orange-50 dark:bg-orange-900/10 px-2 py-1 rounded-lg w-fit">
                                <Clock className="h-3 w-3 mr-1" />
                                {isHistory ? (
                                    <span>{new Date(voucher.redeemedAt || voucher.expiresAt).toLocaleDateString()}</span>
                                ) : (
                                    <span>Expires {getTimeRemaining(voucher.expiresAt)}</span>
                                )}
                            </div>
                        </div>

                        {!isHistory && (
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCancel();
                                    }}
                                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClick();
                                    }}
                                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition-colors"
                                >
                                    Claim with Code
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
