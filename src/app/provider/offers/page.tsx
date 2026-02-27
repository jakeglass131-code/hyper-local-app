"use client";

import { useMemo, useState } from "react";
import {
    CalendarDays,
    CircleGauge,
    Clock3,
    PlusCircle,
    Rocket,
    Sparkles,
    Ticket,
    Wallet,
} from "lucide-react";
import { CreateOfferModal } from "./components/CreateOfferModal";
import { CurrentOffersModal } from "./components/CurrentOffersModal";
import { useMerchantStore } from "@/store/merchantStore";

export default function ProviderOffersPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCurrentModal, setShowCurrentModal] = useState(false);
    const { analytics } = useMerchantStore();

    const snapshot = useMemo(() => {
        const views = Math.max(analytics.totalViews, 1);
        const claims = analytics.totalClaims;
        const redemptions = analytics.totalRedemptions;

        return {
            activeOffers: 4,
            avgClaimRate: ((claims / views) * 100).toFixed(1),
            redeemRate: ((redemptions / Math.max(claims, 1)) * 100).toFixed(1),
            revenuePerOffer: Math.round((redemptions * 24) / 4),
        };
    }, [analytics]);

    const templates = [
        { name: "Lunch Rush", detail: "2-hour urgency campaign", uplift: "+14% claims" },
        { name: "Movie Night", detail: "Evening conversion stack", uplift: "+10% redemptions" },
        { name: "Gym Partner", detail: "Post-workout cashback", uplift: "+8% repeat rate" },
        { name: "Beauty Pop", detail: "High-value local push", uplift: "+12% ticket size" },
    ];

    return (
        <>
            <div className="min-h-screen pb-28 pt-6">
                <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008A5E]">Campaign Studio</p>
                        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Offers Command Center</h1>
                        <p className="mt-1 text-sm text-slate-600">Build, launch, and monitor every promotion from one place.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#008A5E] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#008A5E]/25"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Create New Offer
                    </button>
                </header>

                <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SnapshotCard label="Active Offers" value={snapshot.activeOffers.toString()} icon={<Ticket className="h-4 w-4" />} />
                    <SnapshotCard label="Avg Claim Rate" value={`${snapshot.avgClaimRate}%`} icon={<CircleGauge className="h-4 w-4" />} />
                    <SnapshotCard label="Redeem Rate" value={`${snapshot.redeemRate}%`} icon={<Rocket className="h-4 w-4" />} />
                    <SnapshotCard label="Revenue / Offer" value={`$${snapshot.revenuePerOffer}`} icon={<Wallet className="h-4 w-4" />} />
                </section>

                <section className="mb-6 grid gap-4 lg:grid-cols-5">
                    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Offer Workflows</h2>
                            <Sparkles className="h-4 w-4 text-[#008A5E]" />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="rounded-2xl border border-[#008A5E]/20 bg-[#008A5E]/5 p-4 text-left transition hover:border-[#008A5E]/40"
                            >
                                <p className="text-sm font-bold text-slate-900">Launch new campaign</p>
                                <p className="mt-1 text-sm text-slate-600">Set inventory, geofence, and duration in guided steps.</p>
                            </button>
                            <button
                                onClick={() => setShowCurrentModal(true)}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-[#008A5E]/30"
                            >
                                <p className="text-sm font-bold text-slate-900">Manage current offers</p>
                                <p className="mt-1 text-sm text-slate-600">Pause, activate, or remove live campaigns quickly.</p>
                            </button>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-sm font-bold text-slate-900">Smart expiry guidance</p>
                                <p className="mt-1 text-sm text-slate-600">20-30 min windows currently perform best in your district.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <p className="text-sm font-bold text-slate-900">Category diversity</p>
                                <p className="mt-1 text-sm text-slate-600">Mix food, fitness, entertainment, and beauty offers weekly.</p>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">This Week Planner</h2>
                            <CalendarDays className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="space-y-3">
                            <PlannerRow day="Wed" window="12:00 - 14:00" status="Lunch Rush" />
                            <PlannerRow day="Thu" window="17:00 - 20:00" status="Movie + Dinner" />
                            <PlannerRow day="Fri" window="18:00 - 22:00" status="Weekend Drive" />
                            <PlannerRow day="Sat" window="09:00 - 12:00" status="Gym Recovery" />
                        </div>
                    </article>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Template Library</h2>
                        <Clock3 className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {templates.map((template) => (
                            <article key={template.name} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                                <p className="text-sm font-bold text-slate-900">{template.name}</p>
                                <p className="mt-1 text-sm text-slate-600">{template.detail}</p>
                                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#008A5E]">{template.uplift}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>

            {showCreateModal && <CreateOfferModal onClose={() => setShowCreateModal(false)} />}
            {showCurrentModal && <CurrentOffersModal onClose={() => setShowCurrentModal(false)} />}
        </>
    );
}

function SnapshotCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 inline-flex rounded-lg bg-[#008A5E]/10 p-2 text-[#008A5E]">{icon}</div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">{value}</p>
        </article>
    );
}

function PlannerRow({ day, window, status }: { day: string; window: string; status: string }) {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
            <div>
                <p className="text-sm font-bold text-slate-900">{status}</p>
                <p className="text-xs text-slate-500">{window}</p>
            </div>
            <span className="rounded-full bg-[#008A5E]/10 px-2 py-0.5 text-xs font-bold text-[#008A5E]">{day}</span>
        </div>
    );
}
