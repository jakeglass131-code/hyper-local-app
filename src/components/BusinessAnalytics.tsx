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
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                {/* Date Filter */}
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
                    {(["7d", "30d", "90d"] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => handleRangeChange(r)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${range === r ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {r === "7d" ? "1 Week" : r === "30d" ? "1 Month" : "3 Months"}
                        </button>
                    ))}
                    <div className="h-4 w-px bg-gray-200 mx-1" />
                    <button
                        onClick={() => handleRangeChange("custom")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${range === "custom" ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        Custom
                    </button>
                </div>

                {/* Custom Date Inputs */}
                {range === "custom" && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="text-sm border border-gray-200 rounded-md px-2 py-1.5"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="text-sm border border-gray-200 rounded-md px-2 py-1.5"
                        />
                        <button
                            onClick={applyCustomRange}
                            className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                        >
                            Apply
                        </button>
                    </div>
                )}

                {/* View Toggle */}
                <div className="bg-gray-100 p-1 rounded-lg inline-flex ml-auto">
                    <button
                        onClick={() => setView("dashboard")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === "dashboard" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setView("calendar")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === "calendar" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Revenue Calendar
                    </button>
                </div>
            </div>

            {view === "dashboard" ? (
                <div className="space-y-8">
                    {/* Top Level Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <MetricCard
                            title="Total Revenue"
                            value={`$${overview.totalRevenue}`}
                            icon={DollarSign}
                            trend="+12%"
                            color="green"
                        />
                        <MetricCard
                            title="Total Redemptions"
                            value={overview.totalRedemptions}
                            icon={ShoppingBag}
                            trend="+5%"
                            color="blue"
                        />
                        <MetricCard
                            title="Impressions"
                            value={overview.totalImpressions}
                            icon={Activity}
                            trend="+8%"
                            color="purple"
                        />
                        <MetricCard
                            title="ROI"
                            value={overview.roi}
                            icon={TrendingUp}
                            trend="+15%"
                            color="indigo"
                        />
                    </div>

                    {/* Detailed Funnel */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Conversion Funnel</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center relative">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Impressions</div>
                                <div className="text-2xl font-bold">{overview.totalImpressions}</div>
                                <div className="text-xs text-gray-400 mt-1">Total Views</div>
                            </div>
                            <div className="hidden md:block absolute top-1/2 left-[22%] w-[6%] border-t-2 border-dashed border-gray-200" />
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Clicks</div>
                                <div className="text-2xl font-bold">{overview.totalClicks}</div>
                                <div className="text-xs text-green-600 mt-1">
                                    {((overview.totalClicks / overview.totalImpressions) * 100).toFixed(1)}% CTR
                                </div>
                            </div>
                            <div className="hidden md:block absolute top-1/2 left-[47%] w-[6%] border-t-2 border-dashed border-gray-200" />
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Redemptions</div>
                                <div className="text-2xl font-bold">{overview.totalRedemptions}</div>
                                <div className="text-xs text-green-600 mt-1">
                                    {((overview.totalRedemptions / overview.totalClicks) * 100).toFixed(1)}% Conv.
                                </div>
                            </div>
                            <div className="hidden md:block absolute top-1/2 left-[72%] w-[6%] border-t-2 border-dashed border-gray-200" />
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Revenue</div>
                                <div className="text-2xl font-bold text-green-600">${overview.totalRevenue}</div>
                                <div className="text-xs text-gray-400 mt-1">Total Sales</div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Customer Insights */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                Customer Insights
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">New vs Returning</span>
                                    <span className="font-medium">{overview.newVsReturning}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "30%" }} />
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                    <span className="text-sm text-gray-600">Avg Order Value</span>
                                    <span className="font-medium">${overview.aov}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                    <span className="text-sm text-gray-600">Avg Visits/Customer</span>
                                    <span className="font-medium">2.4</span>
                                </div>
                            </div>
                        </div>

                        {/* Financial Health */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-green-500" />
                                Financial Health
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Gross Revenue</span>
                                    <span className="font-medium">${overview.totalRevenue}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Discount Cost</span>
                                    <span className="font-medium text-red-500">-${overview.costOfDiscounts}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                    <span className="text-sm font-medium text-gray-900">Net Revenue</span>
                                    <span className="font-bold text-green-600">${overview.netRevenue}</span>
                                </div>
                            </div>
                        </div>

                        {/* Loyalty Metrics */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award className="h-5 w-5 text-purple-500" />
                                Loyalty Program
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">New Signups</span>
                                    <span className="font-medium">+{overview.loyaltySignups}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Rewards Redeemed</span>
                                    <span className="font-medium">{overview.rewardsRedeemed}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                    <span className="text-sm text-gray-600">Active Members</span>
                                    <span className="font-medium">142</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Revenue Calendar */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-indigo-500" />
                            Revenue Calendar
                        </h3>

                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-400 uppercase">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {calendar.map((day, i) => {
                                const intensity = day.revenue > 400 ? 'bg-indigo-600 text-white' :
                                    day.revenue > 200 ? 'bg-indigo-400 text-white' :
                                        day.revenue > 100 ? 'bg-indigo-200 text-indigo-900' :
                                            'bg-gray-50 text-gray-400';

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(day)}
                                        className={`aspect-square rounded-lg p-2 flex flex-col items-center justify-center transition-all hover:scale-105 ${intensity} ${selectedDate?.date === day.date ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                                            }`}
                                    >
                                        <span className="text-xs font-medium">{new Date(day.date).getDate()}</span>
                                        <span className="text-[10px] font-bold mt-1">${day.revenue}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Detail Panel */}
                    {selectedDate && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">
                                    Details for {new Date(selectedDate.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h3>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="text-sm text-gray-500 hover:text-gray-900"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Revenue</div>
                                    <div className="text-xl font-bold text-green-600">${selectedDate.revenue}</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Redemptions</div>
                                    <div className="text-xl font-bold text-blue-600">{selectedDate.redemptions}</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Impressions</div>
                                    <div className="text-xl font-bold">{selectedDate.impressions}</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Clicks</div>
                                    <div className="text-xl font-bold">{selectedDate.clicks}</div>
                                </div>
                            </div>

                            <h4 className="font-semibold text-gray-900 mb-4">Offer Performance</h4>
                            <div className="space-y-3">
                                {selectedDate.offers.map((offer: any) => (
                                    <div key={offer.offerId} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                        <div>
                                            <div className="font-medium text-gray-900">{offer.offerName}</div>
                                            <div className="text-xs text-gray-500">{offer.redemptions} redemptions</div>
                                        </div>
                                        <div className="font-bold text-green-600">
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
    const colors: any = {
        green: "bg-green-100 text-green-600",
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
        indigo: "bg-indigo-100 text-indigo-600",
        red: "bg-red-100 text-red-600",
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${colors[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {trend}
                </span>
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
        </div>
    );
}
