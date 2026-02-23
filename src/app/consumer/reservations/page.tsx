"use client";

import { useConsumerStore } from "@/store/consumerStore";
import { MOCK_BUSINESSES } from "@/lib/mockData";
import { LogoHeader } from "@/components/consumer/LogoHeader";
import { Ticket, MapPin, Clock, Trash2, Tag, ChevronLeft, Calendar as CalendarIcon, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";
import { Offer } from "@/lib/store";

const userId = "user_123"; // TODO: Replace with auth

export default function ReservationsPage() {
    const router = useRouter();
    const { cart, removeFromCart } = useConsumerStore();
    const [selectedOffer, setSelectedOffer] = useState<any>(null);
    const [claims, setClaims] = useState<any[]>([]);
    const [offers, setOffers] = useState<Map<string, Offer>>(new Map());
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState<"upcoming" | "past">("upcoming");
    const [tokenData, setTokenData] = useState<{ token: string; shortCode: string } | null>(null);
    const [loadingToken, setLoadingToken] = useState(false);

    const handleRedeemClick = async (item: any) => {
        // Item can be an Offer (from Cart) or a Claim (already claimed)
        // If it's just an offer, we might typically claim it first.
        // But for this "Reservation" page, likely we are dealing with Claims.

        if (item.voucherCode) {
            // It is a Claim
            setSelectedOffer(item);
            // No need to fetch token, we have the code.
            setTokenData({ token: item.voucherCode, shortCode: item.voucherCode });
        } else {
            // It is an Offer (Cart)
            // We should probably claim it now? Or just show a detail modal?
            // For MVP flow, let's just assume we want to CLAIM it if configured as such, 
            // OR generate a temporary token.
            // Let's mimic the old behavior for "Tokens" if it's not a voucher.
            const offer = item;
            setSelectedOffer(offer);
            setLoadingToken(true);
            try {
                // ... old token logic ...
                const res = await fetch(`/api/token/offer`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ offerId: offer.id }),
                });
                const data = await res.json();
                if (res.ok) {
                    setTokenData(data);
                } else {
                    setTokenData({ token: `mock-${offer.id}`, shortCode: "1234" });
                }
            } catch (e) {
                setTokenData({ token: `mock-${offer.id}`, shortCode: "1234" });
            } finally {
                setLoadingToken(false);
            }
        }
    };

    // Fetch claims on mount
    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const res = await fetch(`/api/claims?userId=${userId}`);
            const claimsData = await res.json();
            setClaims(claimsData);

            // Fetch associated offers
            const offerIds = [...new Set(claimsData.map((c: any) => c.offerId))];
            if (offerIds.length > 0) {
                const offersRes = await fetch("/api/offers");
                const allOffers: Offer[] = await offersRes.json();
                const offersMap = new Map();
                allOffers.forEach((o) => {
                    if (offerIds.includes(o.id)) offersMap.set(o.id, o);
                });
                setOffers(offersMap);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClaim = async (claimId: string) => {
        if (!confirm("Cancel this claim?")) return;

        try {
            await fetch(`/api/claims/${claimId}`, {
                method: "DELETE",
            });
            // Optimistically remove
            setClaims(prev => prev.filter(c => c.id !== claimId));
        } catch (e) {
            alert("Failed to cancel claim");
        }
    };

    const upcomingItems = [...cart, ...claims.filter(c => !c.redeemed)]; // Assuming claims have 'redeemed' field, or just all claims for now
    const pastItems = claims.filter(c => c.redeemed || c.status === 'expired'); // Mock logic for now

    // Mock header data
    const activeCount = upcomingItems.length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-24">
            {/* Simple Header */}
            <header className="bg-white dark:bg-neutral-900 sticky top-0 z-10 px-4 py-3 shadow-sm border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                >
                    <ChevronLeft className="h-5 w-5 text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">My Wallet</h1>
                <div className="w-9" /> {/* Spacer for balance */}
            </header>

            <main className="px-4 pt-4 space-y-6">

                {/* Tabs */}
                <div className="bg-gray-200 dark:bg-neutral-800 p-1 rounded-xl flex">
                    <button
                        onClick={() => setCurrentTab("upcoming")}
                        className={cn(
                            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                            currentTab === "upcoming"
                                ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                        )}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setCurrentTab("past")}
                        className={cn(
                            "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                            currentTab === "past"
                                ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                        )}
                    >
                        History
                    </button>
                </div>

                {/* Content */}
                {currentTab === "upcoming" ? (
                    <div className="space-y-6">
                        {upcomingItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-300">
                                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-neutral-800 dark:to-neutral-800 p-8 rounded-full mb-6 relative">
                                    <Ticket className="h-16 w-16 text-indigo-500 relative z-10" />
                                    <div className="absolute inset-0 bg-white/40 blur-xl rounded-full"></div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Your wallet is empty</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-[280px] leading-relaxed">
                                    Book local experiences and find exclusive deals. They'll live here.
                                </p>
                                <button
                                    onClick={() => router.push('/consumer/home')}
                                    className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Find Offers
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingItems.map((item, idx) => {
                                    // Handle Cart Items vs Claims differently if needed
                                    // For simplicity treating them visually similar but with different actions
                                    const isClaim = 'offerId' in item;
                                    const offer = isClaim ? offers.get(item.offerId) : item as Offer;

                                    if (!offer) return null; // Loading or missing ref
                                    const business = MOCK_BUSINESSES.find(b => b.id === offer.businessId);
                                    if (!business) return null;

                                    return (
                                        <div
                                            key={isClaim ? item.id : `${item.id}-${idx}`}
                                            className="group bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-all duration-300"
                                        >
                                            {/* Ticket Header Style */}
                                            <div className="relative h-28 overflow-hidden bg-gray-100">
                                                <img
                                                    src={business.image}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    alt={business.name}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <h3 className="text-white font-bold text-lg leading-tight mb-0.5">{offer.title}</h3>
                                                            <p className="text-white/80 text-sm font-medium">{business.name}</p>
                                                        </div>
                                                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-bold border border-white/20">
                                                            {offer.discountType === 'percent' ? `${offer.value}% OFF` : `$${offer.value} SAVING`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ticket Body */}
                                            <div className="p-4 relative">
                                                {/* Dashed Line */}
                                                <div className="absolute -top-[1px] left-0 right-0 border-t-2 border-dashed border-white/30 w-full h-1"></div>
                                                {/* Cutouts */}
                                                <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-50 dark:bg-black rounded-full z-10"></div>
                                                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-50 dark:bg-black rounded-full z-10"></div>

                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 mt-2">
                                                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span className="font-medium">Valid today</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        <span className="font-medium">0.8km</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleRedeemClick(isClaim ? item : offer)}
                                                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Ticket className="h-4 w-4" />
                                                        {isClaim ? "View Code" : "Reserve"}
                                                    </button>
                                                    <button
                                                        onClick={() => isClaim ? handleCancelClaim(item.id) : removeFromCart(item.id)}
                                                        className="p-3 bg-gray-50 dark:bg-neutral-800 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    // Past Tab
                    <div className="space-y-4 opacity-60">
                        <div className="text-center py-10">
                            <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No past history yet.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* QR Code Modal */}
            {selectedOffer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative">
                        <button
                            onClick={() => { setSelectedOffer(null); setTokenData(null); }}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <XCircle className="h-6 w-6 text-gray-500" />
                        </button>

                        <div className="p-8 flex flex-col items-center text-center">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedOffer?.offerTitle || selectedOffer?.title}</h3>
                                {/* Determine Business Name properly */}
                                <p className="text-gray-500 font-medium">Scan to Redeem</p>
                            </div>

                            <div className="bg-white p-4 rounded-3xl border-2 border-dashed border-indigo-100 mb-8 shadow-sm">
                                {loadingToken ? (
                                    <div className="h-[200px] w-[200px] flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                                    </div>
                                ) : (
                                    <QRCodeSVG
                                        value={tokenData?.token || "demo"}
                                        size={200}
                                        level="H"
                                        includeMargin={false}
                                        className="rounded-lg"
                                    />
                                )}
                            </div>

                            <div className="w-full bg-indigo-50 rounded-2xl p-6 mb-2 text-center">
                                <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase mb-2">Voucher Code</p>
                                <p className="text-4xl font-mono font-black text-indigo-900 tracking-wider">
                                    {tokenData?.token || "----"}
                                </p>
                            </div>

                            <p className="text-xs text-gray-400 mt-4">
                                Show this to the staff at the venue.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
