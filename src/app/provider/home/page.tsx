"use client";

import { useMemo } from "react";
import {
    ArrowRight,
    BadgeCheck,
    BarChart3,
    Bell,
    Camera,
    CircleDollarSign,
    Clock3,
    Gift,
    Sparkles,
    Ticket,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMerchantStore } from "@/store/merchantStore";

export default function ProviderHomePage() {
    const { analytics } = useMerchantStore();
    const router = useRouter();

    const totals = useMemo(() => {
        const views = Math.max(analytics.totalViews, 1);
        const claims = Math.max(analytics.totalClaims, 1);
        const redemptions = analytics.totalRedemptions;
        const claimRate = ((claims / views) * 100).toFixed(1);
        const redemptionRate = ((redemptions / claims) * 100).toFixed(1);
        const estRevenue = redemptions * 24;
        return {
            claimRate,
            redemptionRate,
            estRevenue,
            views,
            claims,
            redemptions,
        };
    }, [analytics]);

    const actionQueue = [
        {
            priority: "High",
            title: "Boost 3-5PM foot traffic",
            detail: "Launch a 2-hour discovery bonus in a 2km radius.",
        },
        {
            priority: "Medium",
            title: "Refill low inventory offer",
            detail: "After-work combo has 8 redemptions left.",
        },
        {
            priority: "Low",
            title: "Profile trust upgrade",
            detail: "Add store banner and trading hours for higher map taps.",
        },
    ];

    return (
        <div className="min-h-screen pb-28 pt-6">
            <header className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008A5E]">Provider Console</p>
                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Main Street Coffee</h1>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#008A5E]/20 bg-[#008A5E]/5 px-3 py-1 text-xs font-semibold text-[#008A5E]">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Open now • 4 campaigns active
                    </div>
                </div>
                <button
                    onClick={() => router.push("/provider/analytics")}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-[#008A5E]/40 hover:text-[#008A5E]"
                >
                    <BarChart3 className="h-4 w-4" />
                    Deep Analytics
                </button>
            </header>

            <section className="mb-6 overflow-hidden rounded-3xl border border-[#008A5E]/15 bg-gradient-to-r from-[#008A5E] to-[#10b981] p-6 text-white shadow-xl shadow-[#008A5E]/20">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Recommended Move</p>
                        <h2 className="mt-1 text-2xl font-black tracking-tight">Run a lunchtime smart drop today</h2>
                        <p className="mt-2 text-sm text-white/90">
                            Based on your last 14 days, a 12:00-2:00 PM campaign is forecast to lift redemptions by 11-15%.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/provider/offers")}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#008A5E] hover:bg-slate-100"
                    >
                        Launch Offer
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </section>

            <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Reach Today" value={totals.views.toLocaleString()} note="Map views in radius" icon={<Users className="h-4 w-4" />} />
                <MetricCard label="Claims" value={totals.claims.toLocaleString()} note={`${totals.claimRate}% view-to-claim`} icon={<Ticket className="h-4 w-4" />} />
                <MetricCard label="Redemptions" value={totals.redemptions.toLocaleString()} note={`${totals.redemptionRate}% claim-to-redeem`} icon={<Gift className="h-4 w-4" />} />
                <MetricCard label="Est. Revenue" value={`$${totals.estRevenue.toLocaleString()}`} note="From tracked redemptions" icon={<CircleDollarSign className="h-4 w-4" />} />
            </section>

            <section className="mb-6 grid gap-4 lg:grid-cols-2">
                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Conversion Funnel</h3>
                    <p className="mt-1 text-sm text-slate-600">Simple view of where to improve conversion this week.</p>
                    <div className="mt-5 space-y-4">
                        <FunnelRow label="Seen" value={100} caption={`${totals.views.toLocaleString()} views`} />
                        <FunnelRow label="Claimed" value={Math.max(Number(totals.claimRate), 2)} caption={`${totals.claims.toLocaleString()} claims`} />
                        <FunnelRow label="Redeemed" value={Math.max(Number(totals.redemptionRate), 2)} caption={`${totals.redemptions.toLocaleString()} redemptions`} />
                    </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Audience Performance</h3>
                    <p className="mt-1 text-sm text-slate-600">Highest converting categories near your location.</p>
                    <div className="mt-5 space-y-4">
                        <SegmentRow label="Gym & wellness" conversion={13.4} share={29} />
                        <SegmentRow label="Movie & events" conversion={11.1} share={24} />
                        <SegmentRow label="Food & drinks" conversion={9.7} share={31} />
                        <SegmentRow label="Beauty & nails" conversion={8.2} share={16} />
                    </div>
                </article>
            </section>

            <section className="mb-6 grid gap-4 lg:grid-cols-5">
                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Priority Action Queue</h3>
                        <Sparkles className="h-4 w-4 text-[#008A5E]" />
                    </div>
                    <div className="mt-4 space-y-3">
                        {actionQueue.map((item) => (
                            <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                <div className="mb-1 flex items-center justify-between gap-3">
                                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${item.priority === "High"
                                            ? "bg-rose-100 text-rose-700"
                                            : item.priority === "Medium"
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-slate-200 text-slate-700"
                                            }`}
                                    >
                                        {item.priority}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Execution Focus</h3>
                        <Clock3 className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="mt-4 space-y-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-3">
                            <p className="text-sm font-semibold text-slate-900">Refill top campaign inventory</p>
                            <p className="mt-1 text-xs text-slate-500">Keep your highest-performing offer in market during peak lunch traffic.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-3">
                            <p className="text-sm font-semibold text-slate-900">Narrow radius for conversion quality</p>
                            <p className="mt-1 text-xs text-slate-500">Testing 1.8km to 2.2km radius improves redemption quality.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-3">
                            <p className="text-sm font-semibold text-slate-900">Prepare staff for 12:00-2:00 PM peak</p>
                            <p className="mt-1 text-xs text-slate-500">Average claim-to-arrival window is currently 7 minutes.</p>
                        </div>
                        <div className="rounded-2xl border border-[#008A5E]/20 bg-[#008A5E]/5 p-3">
                            <p className="text-sm font-semibold text-slate-900">Goal: +10% redemption lift this week</p>
                            <p className="mt-1 text-xs text-slate-600">Use one lunch campaign and one after-work campaign with capped inventory.</p>
                        </div>
                    </div>
                </article>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Operations Shortcuts</h3>
                        <p className="mt-1 text-sm text-slate-600">Daily tools for front-of-house teams.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <QuickAction label="Open scanner" icon={<Camera className="h-4 w-4" />} onClick={() => router.push("/provider/scanner")} />
                        <QuickAction label="Create campaign" icon={<Bell className="h-4 w-4" />} onClick={() => router.push("/provider/create-offer")} />
                    </div>
                </div>
            </section>
        </div>
    );
}

function MetricCard({
    label,
    value,
    note,
    icon,
}: {
    label: string;
    value: string;
    note: string;
    icon: React.ReactNode;
}) {
    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 inline-flex rounded-lg bg-[#008A5E]/10 p-2 text-[#008A5E]">{icon}</div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{note}</p>
        </article>
    );
}

function FunnelRow({ label, value, caption }: { label: string; value: number; caption: string }) {
    return (
        <div>
            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>{label}</span>
                <span>{caption}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-[#008A5E] to-[#34d399]"
                    style={{ width: `${Math.min(value, 100)}%` }}
                />
            </div>
        </div>
    );
}

function SegmentRow({ label, conversion, share }: { label: string; conversion: number; share: number }) {
    return (
        <div>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <p className="font-semibold text-slate-800">{label}</p>
                <p className="font-bold text-[#008A5E]">{conversion}%</p>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#008A5E]/80" style={{ width: `${share}%` }} />
            </div>
        </div>
    );
}

function QuickAction({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-[#008A5E]/40 hover:text-[#008A5E]"
        >
            {icon}
            {label}
        </button>
    );
}
