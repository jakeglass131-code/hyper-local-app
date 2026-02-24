"use client";

import { useState } from "react";
import {
    TrendingUp, Users, MousePointer, DollarSign,
    ShoppingBag, Percent, Activity, Calendar,
    ArrowUpRight, ArrowDownRight, CreditCard, Award
} from "lucide-react";

interface BusinessAnalyticsProps {
    data: {
        overview: any;
        calendar: any[];
    };
    onFilterChange: (startDate: number, endDate: number) => void;
}

export function BusinessAnalytics({ data, onFilterChange }: BusinessAnalyticsProps) {
    const [view, setView] = useState<"dashboard" | "calendar">("dashboard");
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [range, setRange] = useState<"7d" | "30d" | "90d" | "custom">("30d");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const handleRangeChange = (newRange: "7d" | "30d" | "90d" | "custom") => {
        setRange(newRange);
        const now = Date.now();
        let start = now;

        if (newRange === "7d") start = now - 7 * 24 * 60 * 60 * 1000;
        if (newRange === "30d") start = now - 30 * 24 * 60 * 60 * 1000;
        if (newRange === "90d") start = now - 90 * 24 * 60 * 60 * 1000;

        if (newRange !== "custom") {
            onFilterChange(start, now);
        }
    };

    const applyCustomRange = () => {
        if (customStart && customEnd) {
            const start = new Date(customStart).getTime();
            const end = new Date(customEnd).getTime();
            onFilterChange(start, end);
        }
    };

    const { overview, calendar } = data;

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                {/* Date Filter */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
                    {(["7d", "30d", "90d"] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => handleRangeChange(r)}
                            className={`px-4 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${range === r ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-white/40 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {r === "7d" ? "1W" : r === "30d" ? "1M" : "3M"}
                        </button>
                    ))}
                    <div className="h-4 w-px bg-white/10 mx-1" />
                    <button
                        onClick={() => handleRangeChange("custom")}
                        className={`px-4 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${range === "custom" ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-white/40 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        Custom
                    </button>
                </div>

                {/* Custom Date Inputs */}
                {range === "custom" && (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-brand transition-all"
                        />
                        <span className="text-white/20">/</span>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-brand transition-all"
                        />
                        <button
                            onClick={applyCustomRange}
                            className="px-4 py-2 bg-brand text-white text-xs font-black rounded-xl hover:brightness-110 transition-all uppercase tracking-widest"
                        >
                            Sync
                        </button>
                    </div>
                )}

                {/* View Toggle */}
                <div className="bg-white/5 p-1 rounded-2xl inline-flex ml-auto border border-white/10">
                    <button
                        onClick={() => setView("dashboard")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${view === "dashboard" ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-white/40 hover:text-white"
                            }`}
                    >
                        Intelligence
                    </button>
                    <button
                        onClick={() => setView("calendar")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${view === "calendar" ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-white/40 hover:text-white"
                            }`}
                    >
                        Heatmap
                    </button>
                </div>
            </div>

            {view === "dashboard" ? (
                <div className="space-y-8">
                    {/* Top Level Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Revenue"
                            value={`$${overview.totalRevenue}`}
                            icon={DollarSign}
                            trend="+12%"
                            color="brand"
                        />
                        <MetricCard
                            title="Total Redemptions"
                            value={overview.totalRedemptions}
                            icon={ShoppingBag}
                            trend="+5%"
                            color="accent"
                        />
                        <MetricCard
                            title="Impressions"
                            value={overview.totalImpressions}
                            icon={Activity}
                            trend="+8%"
                            color="brand"
                        />
                        <MetricCard
                            title="ROI INDEX"
                            value={overview.roi}
                            icon={TrendingUp}
                            trend="+15%"
                            color="accent"
                        />
                    </div>

                    {/* Detailed Funnel */}
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={120} className="text-brand" />
                        </div>
                        <h3 className="text-sm font-black text-white mb-10 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                            Dynamic Conversion Pipeline
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative">
                            <div className="relative z-10">
                                <div className="text-[10px] font-black text-white/40 mb-2 uppercase tracking-[0.2em]">Exposures</div>
                                <div className="text-4xl font-black text-white tracking-tighter">{overview.totalImpressions}</div>
                                <div className="text-[10px] text-white/20 mt-2 font-bold uppercase">Reach Intensity</div>
                            </div>
                            <div className="hidden md:block absolute top-[40%] left-[21%] w-[8%] border-t border-dashed border-white/10" />
                            <div className="relative z-10">
                                <div className="text-[10px] font-black text-white/40 mb-2 uppercase tracking-[0.2em]">Interactions</div>
                                <div className="text-4xl font-black text-white tracking-tighter">{overview.totalClicks}</div>
                                <div className="text-[10px] text-accent mt-2 font-black uppercase tracking-widest">
                                    {((overview.totalClicks / overview.totalImpressions) * 100).toFixed(1)}% Yield
                                </div>
                            </div>
                            <div className="hidden md:block absolute top-[40%] left-[46%] w-[8%] border-t border-dashed border-white/10" />
                            <div className="relative z-10">
                                <div className="text-[10px] font-black text-white/40 mb-2 uppercase tracking-[0.2em]">Conversions</div>
                                <div className="text-4xl font-black text-white tracking-tighter">{overview.totalRedemptions}</div>
                                <div className="text-[10px] text-brand mt-2 font-black uppercase tracking-widest">
                                    {((overview.totalRedemptions / overview.totalClicks) * 100).toFixed(1)}% Flow
                                </div>
                            </div>
                            <div className="hidden md:block absolute top-[40%] left-[71%] w-[8%] border-t border-dashed border-white/10" />
                            <div className="relative z-10">
                                <div className="text-[10px] font-black text-white/40 mb-2 uppercase tracking-[0.2em]">Capital Flow</div>
                                <div className="text-4xl font-black text-brand tracking-tighter">${overview.totalRevenue}</div>
                                <div className="text-[10px] text-white/20 mt-2 font-bold uppercase underline decoration-brand/30">Gross Settlement</div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Customer Insights */}
                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                            <h3 className="text-xs font-black text-white/40 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Users className="h-4 w-4 text-brand" />
                                Demographics
                            </h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-white/60">Retention Flux</span>
                                    <span className="text-xl font-black text-white tracking-tighter">{overview.newVsReturning}</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-brand h-full rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)]" style={{ width: "65%" }} />
                                </div>
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Avg Transaction</span>
                                        <span className="text-sm font-black text-white">${overview.aov}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white/40">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Velocity Rating</span>
                                        <span className="text-sm font-black text-brand">2.4x</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Health */}
                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                            <h3 className="text-xs font-black text-white/40 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-accent" />
                                Fiscal Radar
                            </h3>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Gross Liquidity</span>
                                    <span className="text-sm font-black text-white tracking-tight">${overview.totalRevenue}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Burn / Discounts</span>
                                    <span className="text-sm font-black text-red-500">-${overview.costOfDiscounts}</span>
                                </div>
                                <div className="pt-5 border-t border-white/5 mt-5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Net Settlement</span>
                                        <span className="text-2xl font-black text-accent tracking-tighter">${overview.netRevenue}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Loyalty Metrics */}
                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                            <h3 className="text-xs font-black text-white/40 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Award className="h-4 w-4 text-brand" />
                                Ecosystem Loyalty
                            </h3>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">New Recruits</span>
                                    <span className="text-sm font-black text-accent">+{overview.loyaltySignups}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Claimed Tokens</span>
                                    <span className="text-sm font-black text-white">{overview.rewardsRedeemed}</span>
                                </div>
                                <div className="pt-5 border-t border-white/5 mt-5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Node Base</span>
                                        <span className="text-lg font-black text-white">142</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Revenue Heatmap */}
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                        <h3 className="text-sm font-black text-white mb-8 uppercase tracking-widest flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-brand" />
                            Activity Heatmap
                        </h3>

                        <div className="grid grid-cols-7 gap-3 mb-4">
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                <div key={day} className="text-center text-[10px] font-black text-white/20 tracking-widest">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-3">
                            {calendar.map((day, i) => {
                                const intensity = day.revenue > 400 ? 'bg-brand shadow-[0_0_15px_rgba(124,58,237,0.4)]' :
                                    day.revenue > 200 ? 'bg-brand/60' :
                                        day.revenue > 100 ? 'bg-brand/30' :
                                            'bg-white/5 hover:bg-white/10';

                                const isSelected = selectedDate?.date === day.date;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(day)}
                                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105 group relative ${intensity} ${isSelected ? 'ring-2 ring-brand ring-offset-4 ring-offset-[#0B0B0F]' : ''
                                            }`}
                                    >
                                        <span className={`text-[10px] font-black ${day.revenue > 200 ? 'text-white' : 'text-white/40'}`}>{new Date(day.date).getDate()}</span>
                                        {day.revenue > 0 && (
                                            <span className={`text-[8px] font-black mt-1 ${day.revenue > 200 ? 'text-white/80' : 'text-brand'}`}>${day.revenue}</span>
                                        )}
                                        <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Detail Panel */}
                    {selectedDate && (
                        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <p className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-1">Temporal Audit</p>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                                        {new Date(selectedDate.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"
                                >
                                    <ArrowDownRight className="w-5 h-5 rotate-45" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Liquidity</div>
                                    <div className="text-2xl font-black text-accent tracking-tighter">${selectedDate.revenue}</div>
                                </div>
                                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Events</div>
                                    <div className="text-2xl font-black text-brand tracking-tighter">{selectedDate.redemptions}</div>
                                </div>
                                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Visibility</div>
                                    <div className="text-2xl font-black text-white tracking-tighter">{selectedDate.impressions}</div>
                                </div>
                                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Interests</div>
                                    <div className="text-2xl font-black text-white tracking-tighter">{selectedDate.clicks}</div>
                                </div>
                            </div>

                            <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-6">Campaign Performance Hierarchy</h4>
                            <div className="grid gap-3">
                                {selectedDate.offers.map((offer: any) => (
                                    <div key={offer.offerId} className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-brand group-hover:animate-ping" />
                                            <div>
                                                <div className="text-sm font-black text-white uppercase tracking-tight">{offer.offerName}</div>
                                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{offer.redemptions} Successful Validations</div>
                                            </div>
                                        </div>
                                        <div className="text-xl font-black text-accent tracking-tighter">
                                            ${offer.revenue}
                                        </div>
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

function MetricCard({ title, value, icon: Icon, trend, color }: any) {
    const isBrand = color === "brand";

    return (
        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl group hover:border-white/20 transition-all relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                <Icon size={120} />
            </div>
            <div className="flex items-center justify-between mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${isBrand ? "bg-brand/20 text-brand" : "bg-accent/20 text-accent"
                    }`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'text-accent bg-accent/10' : 'text-red-500 bg-red-500/10'}`}>
                        {trend}
                    </span>
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">{title}</p>
                <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
            </div>
        </div>
    );
}
