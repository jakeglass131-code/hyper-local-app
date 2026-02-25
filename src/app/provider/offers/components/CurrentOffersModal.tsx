"use client";

import { useEffect, useState } from "react";
import { Clock, Eye, Pause, Play, Trash2, Users, X } from "lucide-react";
import { Business, Offer } from "@/lib/store";

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
        } catch (error) {
            console.error(error);
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
        } catch (error) {
            console.error(error);
        }
    };

    const deleteOffer = async (offerId: string) => {
        if (!confirm("Delete this offer?")) return;
        try {
            await fetch(`/api/offers/${offerId}`, { method: "DELETE" });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const getTimeLeft = (endsAt: number) => {
        const now = Date.now();
        const diff = endsAt - now;
        if (diff < 0) return "Expired";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) return `${days}d ${hours}h left`;
        return `${Math.max(hours, 1)}h left`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Live Offers</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            {offers.filter((offer) => offer.isActive).length} active campaigns
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    {loading && <div className="py-12 text-center text-sm text-slate-500">Loading offers...</div>}

                    {!loading && offers.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-sm font-semibold text-slate-900">No offers found</p>
                            <p className="mt-1 text-sm text-slate-500">Create your first campaign to begin tracking performance.</p>
                        </div>
                    )}

                    {!loading && offers.length > 0 && (
                        <div className="grid gap-4">
                            {offers.map((offer) => {
                                const business = businesses.find((item) => item.id === offer.businessId);
                                const progress = (offer.claimedCount / Math.max(offer.inventory, 1)) * 100;

                                return (
                                    <article key={offer.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                                        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <h3 className="truncate text-base font-bold text-slate-900">{offer.title}</h3>
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                                            offer.isActive
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-slate-200 text-slate-600"
                                                        }`}
                                                    >
                                                        {offer.isActive ? "Active" : "Paused"}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600">{business?.name ?? "Unassigned business"}</p>
                                                <p className="mt-1 text-sm text-slate-700">{offer.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleOfferStatus(offer.id, offer.isActive)}
                                                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:border-[#3744D2]/35 hover:text-[#3744D2]"
                                                    title={offer.isActive ? "Pause" : "Activate"}
                                                >
                                                    {offer.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                </button>
                                                <button
                                                    onClick={() => deleteOffer(offer.id)}
                                                    className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                                            <div className="inline-flex items-center gap-1.5">
                                                <Eye className="h-4 w-4" />
                                                {offer.claimedCount} views
                                            </div>
                                            <div className="inline-flex items-center gap-1.5">
                                                <Users className="h-4 w-4" />
                                                {offer.redemptionCount} claims
                                            </div>
                                            <div className="inline-flex items-center gap-1.5">
                                                <Clock className="h-4 w-4" />
                                                {getTimeLeft(offer.endsAt)}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                                                <span>Inventory usage</span>
                                                <span>
                                                    {offer.claimedCount}/{offer.inventory}
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-full bg-slate-200">
                                                <div
                                                    className="h-2 rounded-full bg-[#3744D2]"
                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
