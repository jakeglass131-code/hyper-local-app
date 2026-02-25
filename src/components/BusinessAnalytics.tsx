"use client";

import { useMemo, useState } from "react";
import {
    Activity,
    Award,
    Calendar,
    DollarSign,
    MousePointer,
    ShoppingBag,
    TrendingUp,
    Users,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Numeric = number | string;

type OfferBreakdown = {
    offerId: string;
    offerName: string;
    revenue: number;
    redemptions: number;
};

type CalendarDay = {
    date: string;
    revenue: number;
    redemptions: number;
    impressions: number;
    clicks: number;
    newCustomers: number;
    returningCustomers: number;
    offers: OfferBreakdown[];
};

type AnalyticsOverview = {
    totalImpressions: number;
    totalClicks: number;
    totalRedemptions: number;
    conversionRate: Numeric;
    totalRevenue: number;
    aov: Numeric;
    newVsReturning: string;
    roi: Numeric;
    costOfDiscounts: number;
    netRevenue: number;
    loyaltySignups: number;
    rewardsRedeemed: number;
};

interface BusinessAnalyticsProps {
    data: {
        overview: AnalyticsOverview;
        calendar: CalendarDay[];
    };
    onFilterChange: (startDate: number, endDate: number) => void;
}

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function asNumber(value: Numeric): number {
    if (typeof value === "number") return value;
    const parsed = Number(value.toString().replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
}

function percent(part: number, whole: number): number {
    if (!whole) return 0;
    return (part / whole) * 100;
}

function formatMoney(value: number): string {
    return `$${Math.round(value).toLocaleString()}`;
}

export function BusinessAnalytics({ data, onFilterChange }: BusinessAnalyticsProps) {
    const [view, setView] = useState<"dashboard" | "calendar">("dashboard");
    const [selectedDate, setSelectedDate] = useState<CalendarDay | null>(null);
    const [range, setRange] = useState<"7d" | "30d" | "90d" | "custom">("30d");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const { overview, calendar } = data;

    const derived = useMemo(() => {
        const totalNewCustomers = calendar.reduce((sum, day) => sum + day.newCustomers, 0);
        const totalReturningCustomers = calendar.reduce((sum, day) => sum + day.returningCustomers, 0);
        const totalCustomers = totalNewCustomers + totalReturningCustomers;

        const totalRevenue = overview.totalRevenue;
        const totalClicks = overview.totalClicks;
        const totalImpressions = overview.totalImpressions;
        const totalRedemptions = overview.totalRedemptions;
        const discountCost = overview.costOfDiscounts;

        const ctr = percent(totalClicks, totalImpressions);
        const clickToRedeem = percent(totalRedemptions, totalClicks);
        const repeatRate = percent(totalReturningCustomers, totalCustomers);
        const cpm = totalImpressions ? (discountCost / totalImpressions) * 1000 : 0;
        const cpc = totalClicks ? discountCost / totalClicks : 0;
        const costPerRedemption = totalRedemptions ? discountCost / totalRedemptions : 0;
        const revenuePerClick = totalClicks ? totalRevenue / totalClicks : 0;
        const avgOrderValue = asNumber(overview.aov);

        const avgDailyRevenue = calendar.length ? totalRevenue / calendar.length : 0;
        const avgDailyRedemptions = calendar.length ? totalRedemptions / calendar.length : 0;
        const peakDay = calendar.reduce<CalendarDay | null>((best, current) => {
            if (!best || current.revenue > best.revenue) return current;
            return best;
        }, null);

        const weekdayData = weekdayLabels.map((label, index) => {
            const days = calendar.filter((entry) => new Date(entry.date).getDay() === index);
            const revenue = days.reduce((sum, day) => sum + day.revenue, 0);
            const redemptions = days.reduce((sum, day) => sum + day.redemptions, 0);
            const impressions = days.reduce((sum, day) => sum + day.impressions, 0);
            return {
                label,
                revenue,
                redemptions,
                conversion: percent(redemptions, impressions),
            };
        });

        const offerMap = new Map<string, { name: string; revenue: number; redemptions: number; days: number }>();
        calendar.forEach((day) => {
            day.offers.forEach((offer) => {
                const existing = offerMap.get(offer.offerId);
                if (existing) {
                    existing.revenue += offer.revenue;
                    existing.redemptions += offer.redemptions;
                    existing.days += 1;
                } else {
                    offerMap.set(offer.offerId, {
                        name: offer.offerName,
                        revenue: offer.revenue,
                        redemptions: offer.redemptions,
                        days: 1,
                    });
                }
            });
        });

        const topOffers = [...offerMap.values()]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        return {
            ctr,
            clickToRedeem,
            repeatRate,
            cpm,
            cpc,
            costPerRedemption,
            revenuePerClick,
            avgOrderValue,
            totalNewCustomers,
            totalReturningCustomers,
            avgDailyRevenue,
            avgDailyRedemptions,
            peakDay,
            weekdayData,
            topOffers,
        };
    }, [calendar, overview]);

    const handleRangeChange = (newRange: "7d" | "30d" | "90d" | "custom") => {
        setRange(newRange);
        const now = new Date().getTime();
        let start = now;

        if (newRange === "7d") start = now - 7 * 24 * 60 * 60 * 1000;
        if (newRange === "30d") start = now - 30 * 24 * 60 * 60 * 1000;
        if (newRange === "90d") start = now - 90 * 24 * 60 * 60 * 1000;

        if (newRange !== "custom") {
            onFilterChange(start, now);
            setSelectedDate(null);
        }
    };

    const applyCustomRange = () => {
        if (customStart && customEnd) {
            const start = new Date(customStart).getTime();
            const end = new Date(customEnd).getTime();
            onFilterChange(start, end);
            setSelectedDate(null);
        }
    };

    const maxWeekdayRevenue = Math.max(...derived.weekdayData.map((day) => day.revenue), 1);

    return (
        <div className="space-y-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                    {(["7d", "30d", "90d"] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => handleRangeChange(r)}
                            className={cn(
                                "rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                range === r
                                    ? "bg-[#3744D2] text-white shadow-lg shadow-[#3744D2]/20"
                                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                            )}
                        >
                            {r === "7d" ? "1W" : r === "30d" ? "1M" : "3M"}
                        </button>
                    ))}
                    <div className="mx-1 h-4 w-px bg-slate-200" />
                    <button
                        onClick={() => handleRangeChange("custom")}
                        className={cn(
                            "rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                            range === "custom"
                                ? "bg-[#3744D2] text-white shadow-lg shadow-[#3744D2]/20"
                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                        )}
                    >
                        Custom
                    </button>
                </div>

                {range === "custom" && (
                    <div className="animate-in fade-in slide-in-from-left-4 flex items-center gap-3">
                        <input
                            type="date"
                            value={customStart}
                            onChange={(event) => setCustomStart(event.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 outline-none transition-all focus:border-[#3744D2]"
                        />
                        <span className="text-slate-300">/</span>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(event) => setCustomEnd(event.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 outline-none transition-all focus:border-[#3744D2]"
                        />
                        <button
                            onClick={applyCustomRange}
                            className="rounded-xl bg-[#3744D2] px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:brightness-110"
                        >
                            Sync
                        </button>
                    </div>
                )}

                <div className="ml-auto inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                    <button
                        onClick={() => setView("dashboard")}
                        className={cn(
                            "rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all",
                            view === "dashboard"
                                ? "bg-[#3744D2] text-white shadow-lg shadow-[#3744D2]/20"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Intelligence
                    </button>
                    <button
                        onClick={() => setView("calendar")}
                        className={cn(
                            "rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all",
                            view === "calendar"
                                ? "bg-[#3744D2] text-white shadow-lg shadow-[#3744D2]/20"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        Revenue Calendar
                    </button>
                </div>
            </div>

            {view === "dashboard" ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 xl:grid-cols-6">
                        <MetricCard title="Revenue" value={formatMoney(overview.totalRevenue)} icon={DollarSign} trend="+12%" />
                        <MetricCard title="Net Revenue" value={formatMoney(overview.netRevenue)} icon={TrendingUp} trend="+10%" />
                        <MetricCard title="Redemptions" value={overview.totalRedemptions.toLocaleString()} icon={ShoppingBag} trend="+5%" />
                        <MetricCard title="CTR" value={`${derived.ctr.toFixed(1)}%`} icon={MousePointer} trend="+4%" />
                        <MetricCard title="Click -> Redeem" value={`${derived.clickToRedeem.toFixed(1)}%`} icon={Activity} trend="+3%" />
                        <MetricCard title="Repeat Rate" value={`${derived.repeatRate.toFixed(1)}%`} icon={Users} trend="+6%" />
                    </div>

                    <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl">
                        <h3 className="mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3744D2]" />
                            Dynamic Conversion Pipeline
                        </h3>

                        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-4">
                            <PipelineNode label="Exposures" value={overview.totalImpressions.toLocaleString()} sub="Reach intensity" />
                            <PipelineNode
                                label="Interactions"
                                value={overview.totalClicks.toLocaleString()}
                                sub={`${percent(overview.totalClicks, overview.totalImpressions).toFixed(1)}% click yield`}
                            />
                            <PipelineNode
                                label="Redemptions"
                                value={overview.totalRedemptions.toLocaleString()}
                                sub={`${percent(overview.totalRedemptions, overview.totalClicks).toFixed(1)}% from clicks`}
                            />
                            <PipelineNode label="Revenue" value={formatMoney(overview.totalRevenue)} sub="Gross settlement" accent />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <article className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl">
                            <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Unit Economics</h3>
                            <div className="space-y-4">
                                <StatLine label="Average order value" value={`$${derived.avgOrderValue.toFixed(2)}`} />
                                <StatLine label="Cost per redemption" value={`$${derived.costPerRedemption.toFixed(2)}`} />
                                <StatLine label="Cost per click" value={`$${derived.cpc.toFixed(2)}`} />
                                <StatLine label="CPM" value={`$${derived.cpm.toFixed(2)}`} />
                                <StatLine label="Revenue per click" value={`$${derived.revenuePerClick.toFixed(2)}`} strong />
                            </div>
                        </article>

                        <article className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl">
                            <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer Quality</h3>
                            <div className="mb-5">
                                <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
                                    <span>New vs returning</span>
                                    <span>{derived.totalNewCustomers}/{derived.totalReturningCustomers}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-[#3744D2]"
                                        style={{ width: `${percent(derived.totalNewCustomers, derived.totalNewCustomers + derived.totalReturningCustomers)}%` }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <StatLine label="Repeat customer rate" value={`${derived.repeatRate.toFixed(1)}%`} strong />
                                <StatLine label="Loyalty signups" value={overview.loyaltySignups.toLocaleString()} />
                                <StatLine label="Rewards redeemed" value={overview.rewardsRedeemed.toLocaleString()} />
                                <StatLine label="ROI index" value={`${asNumber(overview.roi).toFixed(0)}%`} />
                            </div>
                        </article>

                        <article className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl">
                            <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Daily Cadence</h3>
                            <div className="space-y-4">
                                <StatLine label="Average daily revenue" value={formatMoney(derived.avgDailyRevenue)} strong />
                                <StatLine label="Average daily redemptions" value={derived.avgDailyRedemptions.toFixed(1)} />
                                <StatLine
                                    label="Peak day"
                                    value={
                                        derived.peakDay
                                            ? `${new Date(derived.peakDay.date).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                            })} (${formatMoney(derived.peakDay.revenue)})`
                                            : "-"
                                    }
                                />
                                <StatLine label="Discount cost" value={formatMoney(overview.costOfDiscounts)} />
                            </div>
                        </article>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <article className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl">
                            <h3 className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <Award className="h-4 w-4 text-[#3744D2]" />
                                Top Performing Offers
                            </h3>
                            <div className="space-y-3">
                                {derived.topOffers.map((offer, index) => (
                                    <div key={`${offer.name}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                                        <div className="mb-1 flex items-center justify-between gap-3">
                                            <p className="truncate text-sm font-black text-slate-900">{offer.name}</p>
                                            <span className="text-xs font-black text-[#3744D2]">#{index + 1}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>{offer.redemptions} redemptions</span>
                                            <span>{formatMoney(offer.revenue)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl">
                            <h3 className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <Calendar className="h-4 w-4 text-[#3744D2]" />
                                Weekday Performance
                            </h3>
                            <div className="space-y-3">
                                {derived.weekdayData.map((day) => (
                                    <div key={day.label}>
                                        <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
                                            <span>{day.label}</span>
                                            <span>
                                                {formatMoney(day.revenue)} · {day.redemptions} redemptions
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-[#3744D2]"
                                                style={{ width: `${(day.revenue / maxWeekdayRevenue) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl">
                        <h3 className="mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            <Calendar className="h-5 w-5 text-[#3744D2]" />
                            Temporal Activity Heatmap
                        </h3>

                        <div className="mb-4 grid grid-cols-7 gap-3">
                            {weekdayLabels.map((day) => (
                                <div key={day} className="text-center text-[10px] font-black tracking-widest text-slate-300">
                                    {day.toUpperCase()}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-4">
                            {calendar.map((day, index) => {
                                const intensityClass =
                                    day.revenue > 400
                                        ? "bg-[#3744D2] shadow-[0_0_20px_rgba(55,68,210,0.35)]"
                                        : day.revenue > 200
                                            ? "bg-[#3744D2]/60"
                                            : day.revenue > 100
                                                ? "bg-[#3744D2]/30"
                                                : "bg-slate-50 hover:bg-slate-100";

                                const isSelected = selectedDate?.date === day.date;

                                return (
                                    <button
                                        key={`${day.date}-${index}`}
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            "group relative aspect-square rounded-[1.25rem] border border-slate-100 shadow-sm transition-all duration-300 hover:scale-105",
                                            intensityClass,
                                            isSelected && "ring-2 ring-[#3744D2] ring-offset-4 ring-offset-white"
                                        )}
                                    >
                                        <div className="flex h-full flex-col items-center justify-center">
                                            <span className={cn("text-[10px] font-black", day.revenue > 100 ? "text-white" : "text-slate-400")}>
                                                {new Date(day.date).getDate()}
                                            </span>
                                            {day.revenue > 0 && (
                                                <span className={cn("mt-1 text-[8px] font-black", day.revenue > 100 ? "text-white/85" : "text-[#3744D2]")}>
                                                    ${day.revenue}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedDate && (
                        <div className="animate-in slide-in-from-bottom-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl duration-500">
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-[#3744D2]">Temporal Audit</p>
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">
                                        {new Date(selectedDate.date).toLocaleDateString(undefined, {
                                            weekday: "long",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="rounded-xl bg-slate-100 p-3 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-5">
                                <DetailCard label="Revenue" value={`$${selectedDate.revenue}`} accent />
                                <DetailCard label="Redemptions" value={selectedDate.redemptions.toString()} />
                                <DetailCard label="Impressions" value={selectedDate.impressions.toString()} />
                                <DetailCard label="Clicks" value={selectedDate.clicks.toString()} />
                                <DetailCard
                                    label="Daily Conversion"
                                    value={`${percent(selectedDate.redemptions, selectedDate.impressions).toFixed(1)}%`}
                                />
                            </div>

                            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Offer Breakdown</h4>
                            <div className="grid gap-3">
                                {selectedDate.offers.map((offer) => (
                                    <div key={offer.offerId} className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:bg-slate-50">
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-tight text-slate-900">{offer.offerName}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                {offer.redemptions} successful validations
                                            </p>
                                        </div>
                                        <p className="font-mono text-xl font-black tracking-tighter text-[#3744D2]">${offer.revenue}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function MetricCard({
    title,
    value,
    icon: Icon,
    trend,
}: {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    trend: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl transition-all hover:border-[#3744D2]/20">
            <div className="pointer-events-none absolute -right-4 -top-4 opacity-[0.03] transition-transform duration-700 group-hover:scale-110">
                <Icon className="h-28 w-28 text-[#3744D2]" />
            </div>
            <div className="mb-8 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3744D2]/10 text-[#3744D2]">
                    <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-[#3744D2]/10 bg-[#3744D2]/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#3744D2]">
                    {trend}
                </span>
            </div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{title}</p>
            <p className="text-3xl font-black tracking-tighter text-slate-900">{value}</p>
        </div>
    );
}

function PipelineNode({
    label,
    value,
    sub,
    accent,
}: {
    label: string;
    value: string;
    sub: string;
    accent?: boolean;
}) {
    return (
        <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <p className={cn("text-4xl font-black tracking-tighter text-slate-900", accent && "text-[#3744D2]")}>{value}</p>
            <p className={cn("mt-2 text-[10px] font-black uppercase tracking-widest text-slate-300", accent && "text-[#3744D2]/60")}>{sub}</p>
        </div>
    );
}

function StatLine({
    label,
    value,
    strong,
}: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <span className={cn("text-sm font-black text-slate-900", strong && "text-[#3744D2]")}>{value}</span>
        </div>
    );
}

function DetailCard({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent?: boolean;
}) {
    return (
        <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6 shadow-sm">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
            <p className={cn("text-2xl font-black tracking-tighter text-slate-900", accent && "text-[#3744D2]")}>{value}</p>
        </div>
    );
}
