"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, MapPin, QrCode } from "lucide-react";
import { Claim, Offer, Business, store } from "@/lib/store"; // We'll fetch from API but importing types
import { cn } from "@/lib/utils";
import { VoucherModal } from "@/components/consumer/VoucherModal";

// Since we can't import 'store' directly in client component, we'll fetch from an API
// For MVP speed, let's create a quick API to get my vouchers or just mock it here if store was accessible.
// Better: Create /api/claims/list?userId=... 

// Let's quickly create the API first? No, let's do the UI and fetch from a new endpoint.
export default function VouchersPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"active" | "history">("active");
    const [claims, setClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState<any | null>(null);

    // Mock User ID
    const userId = "user_123";

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            // We need an endpoint for this. 
            // For now, let's mock the data fetch since we haven't made the list endpoint yet
            // Wait, I can make a quick route or just use the pattern in other pages.
            // Let's assume there's a route /api/claims?userId=...
            const res = await fetch(`/api/claims?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setClaims(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const activeClaims = claims.filter(c => c.status === "issued" && c.expiresAt > Date.now());
    const historyClaims = claims.filter(c => c.status !== "issued" || c.expiresAt <= Date.now());

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800 px-5 py-4 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Vouchers</h1>
            </header>

            {/* Tabs */}
            <div className="px-5 py-4">
                <div className="bg-gray-200 dark:bg-neutral-800 p-1 rounded-xl flex">
                    <button
                        onClick={() => setActiveTab("active")}
                        className={cn(
                            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                            activeTab === "active"
                                ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                        )}
                    >
                        Active ({activeClaims.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={cn(
                            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                            activeTab === "history"
                                ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                        )}
                    >
                        History
                    </button>
                </div>
            </div>

            {/* List */}
            <main className="px-5 space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading vouchers...</div>
                ) : (activeTab === "active" ? activeClaims : historyClaims).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-100 dark:bg-neutral-800 p-6 rounded-full mb-4">
                            <QrCode className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            No {activeTab} vouchers
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px]">
                            {activeTab === "active"
                                ? "Explore offers to start saving!"
                                : "Your redeemed and expired vouchers will appear here."}
                        </p>
                        {activeTab === "active" && (
                            <button
                                onClick={() => router.push('/consumer/home')}
                                className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-none"
                            >
                                Browse Offers
                            </button>
                        )}
                    </div>
                ) : (
                    (activeTab === "active" ? activeClaims : historyClaims).map(claim => (
                        <div
                            key={claim.id}
                            onClick={() => {
                                if (activeTab === "active") setSelectedClaim(claim);
                            }}
                            className={cn(
                                "bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-100 dark:border-neutral-800 shadow-sm flex gap-4 transition-transform",
                                activeTab === "active" ? "active:scale-[0.98]" : "opacity-75 grayscale-[0.5]"
                            )}
                        >
                            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                {/* Placeholder for now, real app would fetch image */}
                                <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                    IMG
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2">
                                        {claim.offerTitle}
                                    </h3>
                                    {activeTab === "active" && (
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            READY
                                        </span>
                                    )}
                                    {claim.status === "redeemed" && (
                                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            USED
                                        </span>
                                    )}
                                    {claim.status === "expired" && (
                                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            EXPIRED
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mb-3">{claim.businessName}</p>

                                {activeTab === "active" ? (
                                    <div className="flex items-center text-orange-600 text-xs font-bold">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Expires in {Math.ceil((claim.expiresAt - Date.now()) / (1000 * 60))}m
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-400">
                                        {claim.status === "redeemed"
                                            ? `Redeemed on ${new Date(claim.redeemedAt).toLocaleDateString()}`
                                            : `Expired on ${new Date(claim.expiresAt).toLocaleDateString()}`}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </main>

            {/* Voucher Modal */}
            {selectedClaim && (
                <VoucherModal
                    isOpen={!!selectedClaim}
                    onClose={() => setSelectedClaim(null)}
                    voucherCode={selectedClaim.voucherCode}
                    expiresAt={selectedClaim.expiresAt}
                    offerTitle={selectedClaim.offerTitle}
                    businessName={selectedClaim.businessName}
                />
            )}
        </div>
    );
}
