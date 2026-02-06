"use client";

import { useConsumerStore } from "@/store/consumerStore";
import { MOCK_BUSINESSES } from "@/lib/mockData";
import { LogoHeader } from "@/components/consumer/LogoHeader";
import { Ticket, MapPin, Clock, Trash2, Tag, Users } from "lucide-react";
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
    const [showClaimedSlots, setShowClaimedSlots] = useState(true);
    const [tokenData, setTokenData] = useState<{ token: string; shortCode: string } | null>(null);
    const [loadingToken, setLoadingToken] = useState(false);

    const handleRedeemClick = async (offer: Offer) => {
        setSelectedOffer(offer);
        setLoadingToken(true);
        try {
            const res = await fetch(`/api/token/offer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ offerId: offer.id }),
            });
            const data = await res.json();
            if (res.ok) {
                setTokenData(data);
            } else {
                alert("Failed to generate redemption token");
                setSelectedOffer(null);
            }
        } catch (e) {
            console.error(e);
            alert("Network error");
            setSelectedOffer(null);
        } finally {
            setLoadingToken(false);
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
            const offersRes = await fetch("/api/offers");
            const allOffers: Offer[] = await offersRes.json();

            const offersMap = new Map();
            allOffers.forEach((o) => {
                if (offerIds.includes(o.id)) offersMap.set(o.id, o);
            });
            setOffers(offersMap);
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
            fetchClaims();
        } catch (e) {
            alert("Failed to cancel claim");
        }
    };

    const totalItems = cart.length + claims.length;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <LogoHeader />

            <header className="bg-white px-4 py-6 border-b border-gray-200 sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-gray-900">My Reservations</h1>
                <p className="text-sm text-gray-500 mt-1">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} active
                </p>
            </header>

            <main className="px-4 py-6">
                {totalItems === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-indigo-50 p-6 rounded-full mb-6">
                            <Ticket className="h-12 w-12 text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Reservations</h2>
                        <p className="text-gray-500 mb-8 max-w-xs">
                            You haven't reserved any offers yet. Explore the map to find great deals nearby!
                        </p>
                        <button
                            onClick={() => router.push('/consumer/map')}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition-colors"
                        >
                            Explore Map
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Reserved Offers/Slots (from cart) */}
                        {cart.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">
                                    {(() => {
                                        const firstBusiness = MOCK_BUSINESSES.find((b) => b.id === cart[0]?.businessId);
                                        const isFoodBeverage = firstBusiness?.category === "Food & Beverage" ||
                                            firstBusiness?.category === "Restaurant" ||
                                            firstBusiness?.category === "Cafe";
                                        return isFoodBeverage ? "Reserved Offers" : "Reserved Slots";
                                    })()}
                                </h2>
                                <div className="space-y-4">
                                    {cart.map((offer, index) => {
                                        const business = MOCK_BUSINESSES.find((b) => b.id === offer.businessId);
                                        if (!business) return null;

                                        return (
                                            <div
                                                key={`${offer.id}-${index}`}
                                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                                            >
                                                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                                                    <div className="relative z-10 flex justify-between items-start">
                                                        <div>
                                                            <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-bold mb-2">
                                                                RESERVATION #{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                                                            </span>
                                                            <h3 className="font-bold text-lg leading-tight">{offer.title}</h3>
                                                        </div>
                                                        <div className="bg-white text-indigo-600 px-3 py-1 rounded-lg font-bold text-sm shadow-sm">
                                                            {offer.discountType === "percent"
                                                                ? `${offer.value}% OFF`
                                                                : `$${offer.value} OFF`}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                                            <img
                                                                src={business.image}
                                                                alt={business.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-gray-900">{business.name}</h4>
                                                            <p className="text-sm text-gray-500 mb-2">{business.category}</p>
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <MapPin className="h-3 w-3 mr-1" />
                                                                {business.address}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl mb-4">
                                                        <Clock className="h-4 w-4 text-indigo-600" />
                                                        <span>Valid until <strong>Today, 10:00 PM</strong></span>
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => setSelectedOffer(offer)}
                                                            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                                                        >
                                                            Redeem
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromCart(offer.id)}
                                                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-gray-200"
                                                            title="Cancel Reservation"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Active Claimed Offers */}
                        {claims.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-gray-900">My Active Offers</h2>
                                    <span className="text-sm text-indigo-600 font-medium">{claims.length} ready to redeem</span>
                                </div>

                                {showClaimedSlots && (
                                    <div className="space-y-4">
                                        {claims.map((claim) => {
                                            const offer = offers.get(claim.offerId);
                                            if (!offer) return null;
                                            const business = MOCK_BUSINESSES.find((b) => b.id === offer.businessId);
                                            if (!business) return null;

                                            return (
                                                <div
                                                    key={claim.id}
                                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-indigo-100 hover:shadow-md transition-shadow"
                                                >
                                                    {/* Offer Header */}
                                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="bg-white/20 p-2 rounded-full">
                                                                <Ticket className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-lg">{offer.title}</h3>
                                                                <p className="text-sm text-white/80">{business.name}</p>
                                                            </div>
                                                            <span className="bg-green-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                                ACTIVE
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Offer Body */}
                                                    <div className="p-4">
                                                        <div className="flex items-start gap-3 mb-4">
                                                            <img
                                                                src={business.image}
                                                                alt={business.name}
                                                                className="h-16 w-16 rounded-xl object-cover"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                                    <MapPin className="h-4 w-4 text-indigo-600" />
                                                                    {business.address}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <Tag className="h-4 w-4 text-indigo-600" />
                                                                    {offer.discountType === "percent" ? `${offer.value}% off` : `$${offer.value} off`}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl mb-4">
                                                            <Clock className="h-4 w-4 text-indigo-600" />
                                                            <span>Valid until <strong>Today, 10:00 PM</strong></span>
                                                        </div>

                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() => handleRedeemClick(offer)}
                                                                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                                                            >
                                                                <Ticket className="h-5 w-5" />
                                                                Redeem Now
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancelClaim(claim.id)}
                                                                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-gray-200"
                                                                title="Cancel Offer"
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
                        )}
                    </div>
                )}

                {/* QR Code Modal */}
                {selectedOffer && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Redeem Offer</h3>
                                <p className="text-gray-500 text-sm mb-6">Show this QR code to the merchant</p>

                                {loadingToken ? (
                                    <div className="py-12 flex justify-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 inline-block mb-6">
                                            <QRCodeSVG
                                                value={tokenData?.token || ""}
                                                size={200}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>

                                        <p className="text-xs text-gray-400 mb-2 font-mono">
                                            MANUAL CODE
                                        </p>
                                        <p className="text-3xl font-bold text-indigo-600 mb-6 font-mono tracking-widest">
                                            {tokenData?.shortCode}
                                        </p>
                                    </>
                                )}

                                <button
                                    onClick={() => {
                                        setSelectedOffer(null);
                                        setTokenData(null);
                                    }}
                                    className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
