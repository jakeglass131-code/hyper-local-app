"use client";

import { useState, useEffect } from "react";
import { X, Edit, Pause, Play, Trash2, Eye, Users, Clock } from "lucide-react";
import { Offer, Business } from "@/lib/store";

interface CurrentOffersModalProps {
    onClose: () => void;
}

export function CurrentOffersModal({ onClose }: CurrentOffersModalProps) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [offersRes, businessesRes] = await Promise.all([
                fetch("/api/offers"),
                fetch("/api/businesses"),
            ]);
            const offersData = await offersRes.json();
            const businessesData = await businessesRes.json();
            setOffers(offersData);
            setBusinesses(businessesData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleOfferStatus = async (offerId: string, currentStatus: boolean) => {
        try {
            await fetch(`/api/offers/${offerId}`, {
                method: "PATCH",
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const deleteOffer = async (offerId: string) => {
        if (!confirm("Are you sure you want to delete this offer?")) return;
        try {
            await fetch(`/api/offers/${offerId}`, { method: "DELETE" });
            fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const getTimeLeft = (endsAt: number) => {
        const now = Date.now();
        const diff = endsAt - now;
        if (diff < 0) return "Expired";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) return `${days}d ${hours}h left`;
        return `${hours}h left`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl flex flex-col">
                <div className="bg-neutral-900 border-b border-white/10 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Current Offers</h2>
                        <p className="text-sm text-white/60 mt-1">
                            {offers.filter((o) => o.isActive).length} active offers
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-12 text-white/60">Loading...</div>
                    ) : offers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-white/40 mb-2">No offers yet</div>
                            <p className="text-sm text-white/60">
                                Create your first offer to get started
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {offers.map((offer) => {
                                const business = businesses.find((b) => b.id === offer.businessId);
                                const progress = (offer.claimedCount / offer.inventory) * 100;

                                return (
                                    <div
                                        key={offer.id}
                                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-bold">{offer.title}</h3>
                                                    <span
                                                        className={`px-2 py-0.5 text-xs rounded-full ${offer.isActive
                                                                ? "bg-green-500/20 text-green-400"
                                                                : "bg-gray-500/20 text-gray-400"
                                                            }`}
                                                    >
                                                        {offer.isActive ? "Active" : "Paused"}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-white/60">{business?.name}</p>
                                                <p className="text-sm text-white/80 mt-2">{offer.description}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleOfferStatus(offer.id, offer.isActive)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title={offer.isActive ? "Pause" : "Activate"}
                                                >
                                                    {offer.isActive ? (
                                                        <Pause className="h-5 w-5" />
                                                    ) : (
                                                        <Play className="h-5 w-5" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => deleteOffer(offer.id)}
                                                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Eye className="h-4 w-4 text-white/40" />
                                                <span className="text-white/60">
                                                    {offer.claimedCount} views
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="h-4 w-4 text-white/40" />
                                                <span className="text-white/60">
                                                    {offer.redemptionCount} claims
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-white/40" />
                                                <span className="text-white/60">{getTimeLeft(offer.endsAt)}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs text-white/60 mb-1">
                                                <span>Inventory</span>
                                                <span>
                                                    {offer.claimedCount}/{offer.inventory}
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div
                                                    className="bg-indigo-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
