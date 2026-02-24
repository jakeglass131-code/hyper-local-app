"use client";

import { Offer, Business, Program } from "@/lib/store";
import { Edit, Pause, Play, Trash2, Eye, Users, Clock, TrendingUp, ChevronDown, MessageCircle, Sparkles, Coffee, Sandwich, Award } from "lucide-react";
import { useState, useEffect } from "react";

import { getBusinessInsights } from "@/lib/aiInsights";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface BusinessHomeProps {
    offers: Offer[];
    businesses: Business[];
    analytics: any;
    program: Program | null;
    onSaveProgram: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    onRemoveProgram: () => Promise<void>;
    onUpdateProgram: (program: Partial<Program>) => void;
    onNavigate: (tab: string, subTab?: string) => void;
}

export function BusinessHome({ offers, businesses, analytics, program, onSaveProgram, onRemoveProgram, onUpdateProgram, onNavigate }: BusinessHomeProps) {
    const activeOffers = offers.filter((o) => o.isActive);
    const overview = analytics?.overview || {};
    const [selectedLocation, setSelectedLocation] = useState(businesses[0]?.id || "");
    const [currentTime, setCurrentTime] = useState(new Date());

    const currentBusiness = businesses.find(b => b.id === selectedLocation) || businesses[0];

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Dynamic AI Insights
    const { busyTimes, recommendation } = useMemo(() => {
        if (!currentBusiness) return {
            busyTimes: [],
            recommendation: { text: "Add a business to see insights.", action: "Add Business" }
        };
        return getBusinessInsights(currentBusiness, currentTime);
    }, [currentBusiness, currentTime]);

    // Mock data for best performing offer
    const topOffer = {
        name: "Large Iced Tea",
        redemptions: 42,
        revenue: 680
    };

    const [newProgramLogo, setNewProgramLogo] = useState<string>("");
    const [newProgramColor, setNewProgramColor] = useState<string>("");

    return (
        <div className="space-y-6">
            {/* Location Switcher - Only show if multiple businesses */}
            {businesses.length > 1 && (
                <div className="flex justify-end">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-xl backdrop-blur-md">
                        <span className="text-sm text-gray-500">Location:</span>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="text-sm font-bold text-gray-900 border-none focus:ring-0 pr-8 bg-transparent cursor-pointer"
                        >
                            {businesses.map((b) => (
                                <option key={b.id} value={b.id} className="bg-white">
                                    {b.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Welcome Section */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-2xl backdrop-blur-3xl">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back!</h2>
                <p className="text-gray-500 mt-1 font-medium">
                    Here's what's happening with your businesses today.
                </p>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4 mt-8">
                    <button
                        onClick={() => onNavigate("scanner")}
                        className="flex items-center gap-3 px-5 py-3 bg-brand text-white rounded-2xl font-black hover:brightness-110 transition-all shadow-lg shadow-brand/20 active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <div className="p-1.5 bg-gray-200 rounded-lg shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
                        </div>
                        Scan QR
                    </button>
                    <button
                        onClick={() => onNavigate("offers", "create")}
                        className="flex items-center gap-3 px-5 py-3 bg-white text-gray-900 rounded-2xl font-black hover:bg-gray-100 transition-all border border-gray-200 active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <div className="p-1.5 bg-gray-100 rounded-lg shadow-inner">
                            <Edit className="w-5 h-5 text-brand" />
                        </div>
                        New Offer
                    </button>
                    <button
                        onClick={() => onNavigate("analytics")}
                        className="flex items-center gap-3 px-5 py-3 bg-white text-gray-900 rounded-2xl font-black hover:bg-gray-100 transition-all border border-gray-200 active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <div className="p-1.5 bg-gray-100 rounded-lg shadow-inner">
                            <TrendingUp className="w-5 h-5 text-accent" />
                        </div>
                        Analytics
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-200 backdrop-blur-3xl shadow-xl transition-all hover:bg-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Active Offers</p>
                            <p className="text-3xl font-black mt-2 text-gray-900">{activeOffers.length}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-brand/20 text-brand shadow-inner">
                            <GiftIcon className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-200 backdrop-blur-3xl shadow-xl transition-all hover:bg-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Total Impressions</p>
                            <p className="text-3xl font-black mt-2 text-gray-900">{overview.totalImpressions || 0}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-500/20 text-blue-400 shadow-inner">
                            <Eye className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-200 backdrop-blur-3xl shadow-xl transition-all hover:bg-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Total Redemptions</p>
                            <p className="text-3xl font-black mt-2 text-gray-900">{overview.totalRedemptions || 0}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-accent/20 text-accent shadow-inner">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Best Performing Snapshot */}
            <div className="bg-gradient-to-br from-brand/20 via-brand/10 to-transparent p-8 rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden relative">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand/20 rounded-full blur-3xl" />
                <div className="relative z-10 flex items-center gap-6">
                    <div className="p-4 bg-gray-100 rounded-2xl shadow-inner border border-gray-200">
                        <TrendingUp className="h-8 w-8 text-brand" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Top Performer This Week</h3>
                        <div className="flex items-center gap-3">
                            <p className="text-2xl font-black text-gray-900 tracking-tight">{topOffer.name}</p>
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-brand">{topOffer.redemptions} redemptions</span>
                                <span className="text-gray-500">|</span>
                                <span className="text-lg font-black text-accent">${topOffer.revenue} revenue</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Busy Times Today */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-200 backdrop-blur-3xl shadow-xl">
                <div className="flex items-center gap-3 mb-5">
                    <Clock className="h-5 w-5 text-accent" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Traffic Hotspots Today</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                    {busyTimes.map((period, idx) => (
                        <div
                            key={idx}
                            className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-200 rounded-2xl shadow-inner transition-transform hover:scale-105"
                        >
                            <span className="text-xl">{period.emoji}</span>
                            <span className="text-base font-black text-gray-900 tracking-tight">{period.time}</span>
                            <span className="px-2 py-0.5 rounded-md bg-accent/20 text-accent text-[10px] font-black uppercase tracking-tighter">Peak</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommended Next Action */}
            <div className="bg-gradient-to-br from-accent/20 via-accent/5 to-transparent p-7 rounded-[2.5rem] border border-accent/20 shadow-2xl relative overflow-hidden group">
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-accent/10 rounded-full blur-[100px] transition-transform group-hover:scale-150 duration-700" />
                <div className="flex items-start gap-5 relative z-10">
                    <div className="p-4 bg-accent/20 rounded-[1.5rem] border border-accent/20 shadow-inner">
                        <Sparkles className="h-7 w-7 text-accent" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xs font-black text-accent uppercase tracking-[0.3em] mb-2 font-mono">AI Recommendation</h3>
                        <p className="text-lg font-bold text-gray-900 mb-5 leading-relaxed">
                            {recommendation.text}
                        </p>
                        <button className="px-8 py-3 bg-accent text-black text-sm font-black rounded-2xl transition-all shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-[0.15em]">
                            {recommendation.action}
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Offers Preview */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 backdrop-blur-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Active Offers</h3>
                    <button
                        onClick={() => onNavigate("offers")}
                        className="text-sm font-black uppercase tracking-widest text-brand hover:brightness-110 active:scale-95 transition-all"
                    >
                        Review All ›
                    </button>
                </div>
                {activeOffers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No live offers currently. Activate one to start attracting customers.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeOffers.slice(0, 3).map((offer) => {
                            const business = businesses.find((b) => b.id === offer.businessId);
                            const progress = (offer.claimedCount / offer.inventory) * 100;

                            return (
                                <div key={offer.id} className="bg-white border border-gray-200 rounded-[2rem] p-6 transition-all hover:bg-gray-100 hover:border-brand/40 group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h4 className="text-lg font-black text-gray-900 tracking-tight leading-tight mb-1 group-hover:text-brand transition-colors">{offer.title}</h4>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{business?.name}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-black rounded-lg uppercase tracking-tighter shadow-inner">
                                            LIVE
                                        </span>
                                    </div>
                                    <div className="mt-8 space-y-3">
                                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400">
                                            <span>Inventory Distribution</span>
                                            <span className="text-gray-900">{offer.claimedCount} / {offer.inventory}</span>
                                        </div>
                                        <div className="w-full bg-white rounded-full h-2.5 p-0.5 border border-gray-200">
                                            <div
                                                className="bg-brand h-full rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)] transition-all duration-1000"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>



            {/* Loyalty System */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 backdrop-blur-3xl shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Retention Engine</h2>
                        <p className="text-gray-500 text-sm font-medium mt-1">Manage digital loyalty stamps and rewards</p>
                    </div>
                    {!program && (
                        <button
                            onClick={() => (document.getElementById('create-loyalty-modal') as HTMLDialogElement)?.showModal()}
                            className="px-6 py-3 bg-brand text-white text-sm font-black rounded-2xl hover:brightness-110 transition-all flex items-center gap-2 shadow-xl shadow-brand/20 uppercase tracking-widest"
                        >
                            <Sparkles className="w-4 h-4" />
                            DEPLOY LOYALTY CARD
                        </button>
                    )}
                </div>

                {program ? (
                    <form onSubmit={onSaveProgram} className="space-y-8">
                        <div className="flex flex-col lg:flex-row items-start gap-10">
                            {/* Preview Card */}
                            <div
                                className="w-64 h-96 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 text-white flex flex-col justify-between shrink-0 relative overflow-hidden transition-all duration-700 border border-white/20 group cursor-default"
                                style={{
                                    background: program.cardColor
                                        ? `linear-gradient(135deg, ${program.cardColor}, #050505)`
                                        : 'linear-gradient(135deg, #7C3AED, #0B0B0F)'
                                }}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
                                <div className="absolute bottom-1/4 left-0 w-24 h-24 bg-brand/30 rounded-full -ml-12 blur-[40px]" />

                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl mb-4 flex items-center justify-center overflow-hidden border border-white/20 shadow-inner">
                                        {program.logo ? (
                                            <img src={program.logo} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <Coffee className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                    <h3 className="font-black text-2xl leading-tight tracking-tight uppercase">{program.name || "UNNAMED CARD"}</h3>
                                    <p className="text-[10px] font-black tracking-[0.3em] text-white/60 mt-2 uppercase">Verified Member Card</p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-3 relative z-10 bg-black/20 backdrop-blur-md rounded-3xl p-4 border border-white/10">
                                    {Array.from({ length: program.stampsRequired || 10 }).map((_, i) => (
                                        <div key={i} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden">
                                            {i === 0 && <div className="w-4 h-4 bg-white/40 rounded-full blur-[2px] animate-pulse" />}
                                            <div className="absolute inset-0 bg-brand/10 opacity-0 hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Edit Form */}
                            <div className="flex-1 space-y-6 bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-inner">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500">Visual Identity</label>
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border border-gray-200 overflow-hidden shadow-inner relative group">
                                                {program.logo ? (
                                                    <img src={program.logo} alt="Logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Coffee className="w-10 h-10 text-gray-300" />
                                                )}
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Edit className="w-6 h-6 text-white" />
                                                </div>
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = (ev) => {
                                                                const img = new Image();
                                                                img.src = ev.target?.result as string;
                                                                img.onload = () => {
                                                                    const canvas = document.createElement('canvas');
                                                                    const ctx = canvas.getContext('2d');
                                                                    if (ctx) {
                                                                        const MAX_SIZE = 300;
                                                                        let width = img.width;
                                                                        let height = img.height;
                                                                        if (width > height) {
                                                                            if (width > MAX_SIZE) {
                                                                                height *= MAX_SIZE / width;
                                                                                width = MAX_SIZE;
                                                                            }
                                                                        } else {
                                                                            if (height > MAX_SIZE) {
                                                                                width *= MAX_SIZE / height;
                                                                                height = MAX_SIZE;
                                                                            }
                                                                        }
                                                                        canvas.width = width;
                                                                        canvas.height = height;
                                                                        ctx.drawImage(img, 0, 0, width, height);
                                                                        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                                                                        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                                                                        const color = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                                                                        onUpdateProgram({ logo: resizedDataUrl, cardColor: color });
                                                                    }
                                                                };
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <p className="text-sm font-bold text-gray-900">Brand Logo</p>
                                                <p className="text-xs text-gray-500 leading-relaxed font-medium">Upload a square logo for your card. Primary color will be automatically extracted.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500">Program Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                defaultValue={program.name}
                                                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-bold focus:border-brand focus:ring-0 transition-all outline-none"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500">Reward Threshold</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="range"
                                                    name="stampsRequired"
                                                    min="1"
                                                    max="20"
                                                    defaultValue={program.stampsRequired}
                                                    onChange={(e) => onUpdateProgram({ stampsRequired: parseInt(e.target.value) })}
                                                    className="flex-1 h-2 bg-gray-100 rounded-full appearance-none accent-brand cursor-pointer"
                                                />
                                                <span className="text-2xl font-black text-accent w-12 text-center">{program.stampsRequired}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-6 h-6 rounded-md border border-gray-300 transition-all flex items-center justify-center",
                                            program.limitOnePerDay ? "bg-brand border-brand" : "bg-transparent"
                                        )}>
                                            {program.limitOnePerDay && <input type="checkbox" checked readOnly className="sr-only" />}
                                            <div className={cn("w-2 h-2 rounded-full bg-white transition-opacity", program.limitOnePerDay ? "opacity-100" : "opacity-0")} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Daily Limit</p>
                                            <p className="text-xs text-gray-500 font-medium">Customers can only earn one stamp per 24 hours.</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onUpdateProgram({ limitOnePerDay: !program.limitOnePerDay })}
                                        className="text-xs font-black uppercase tracking-widest text-brand group-hover:brightness-110 transition-all"
                                    >
                                        {program.limitOnePerDay ? "ON" : "OFF"}
                                    </button>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 py-5 bg-brand text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-brand/20 active:scale-95 uppercase tracking-widest text-sm"
                                    >
                                        VERIFY & DEPLOY
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onRemoveProgram}
                                        className="px-8 py-5 bg-red-500/10 text-red-500 font-black rounded-2xl hover:bg-red-500/20 transition-all shadow-xl border border-red-500/20 active:scale-95 uppercase tracking-widest text-sm"
                                    >
                                        DELETE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200 group hover:border-brand/40 transition-colors">
                        <div className="w-24 h-24 bg-brand/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform">
                            <Award className="w-12 h-12 text-brand" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Loyalty Ecosystem Offline</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-3 mb-10 font-medium">
                            Forge lasting connections. Reward your loyal patrons with a premium digital stamp experience.
                        </p>
                        <button
                            onClick={() => (document.getElementById('create-loyalty-modal') as HTMLDialogElement)?.showModal()}
                            className="px-10 py-4 bg-brand text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-brand/20 active:scale-95 uppercase tracking-widest"
                        >
                            ORCHESTRATE PROGRAM
                        </button>
                    </div>
                )}
            </div>

            {/* Create Loyalty Modal */}
            <dialog id="create-loyalty-modal" className="modal p-0 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] backdrop:bg-black/40 w-full max-w-lg bg-transparent border-none">
                <div className="bg-white p-10 border border-gray-200 rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Assemble Program</h3>
                        <form method="dialog">
                            <button className="p-3 bg-white hover:bg-gray-100 rounded-2xl text-gray-500 hover:text-gray-900 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </form>
                    </div>

                    <form onSubmit={(e) => {
                        onSaveProgram(e);
                        setNewProgramLogo("");
                        setNewProgramColor("");
                        (document.getElementById('create-loyalty-modal') as HTMLDialogElement)?.close();
                    }} className="space-y-5">
                        {/* Hidden inputs for logo data */}
                        <input type="hidden" name="logo" value={newProgramLogo} />
                        <input type="hidden" name="cardColor" value={newProgramColor} />

                        {/* Logo Upload */}
                        <div className="space-y-4">
                            <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500">Visual Core (Logo)</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-200 border-dashed rounded-[2rem] cursor-pointer bg-white hover:bg-gray-100 transition-all overflow-hidden relative group">
                                    {newProgramLogo ? (
                                        <img src={newProgramLogo} alt="Preview" className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <div className="p-4 bg-white rounded-2xl mb-4 shadow-inner">
                                                <svg className="w-10 h-10 text-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-gray-900 font-black uppercase tracking-widest">DRAG & DROP IMAGE</p>
                                            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-tighter">Automatic brand extraction</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept="image/*"
                                        onClick={(e) => (e.target as any).value = null}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                    const img = new Image();
                                                    img.src = ev.target?.result as string;
                                                    img.onload = () => {
                                                        const canvas = document.createElement('canvas');
                                                        const ctx = canvas.getContext('2d');
                                                        if (ctx) {
                                                            // Resize to max 300px
                                                            const MAX_SIZE = 300;
                                                            let width = img.width;
                                                            let height = img.height;

                                                            if (width > height) {
                                                                if (width > MAX_SIZE) {
                                                                    height *= MAX_SIZE / width;
                                                                    width = MAX_SIZE;
                                                                }
                                                            } else {
                                                                if (height > MAX_SIZE) {
                                                                    width *= MAX_SIZE / height;
                                                                    height = MAX_SIZE;
                                                                }
                                                            }

                                                            canvas.width = width;
                                                            canvas.height = height;
                                                            ctx.drawImage(img, 0, 0, width, height);

                                                            // Get resized data URL
                                                            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                                                            setNewProgramLogo(resizedDataUrl);

                                                            // Extract color
                                                            const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                                                            const color = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                                                            setNewProgramColor(color);
                                                        }
                                                    };
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500">Business Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="THE VIOLET ROAST"
                                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-black placeholder:text-gray-400 focus:border-brand focus:ring-0 transition-all outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500">Stamps Needed for Reward</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="stampsRequired"
                                    defaultValue={10}
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-black focus:border-brand focus:ring-0 transition-all outline-none"
                                    required
                                    min="1"
                                    max="50"
                                />
                                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-brand font-black text-xs uppercase tracking-widest">
                                    STAMPS
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-brand text-white font-black rounded-2xl hover:brightness-110 shadow-[0_20px_40px_rgba(124,58,237,0.3)] active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-sm"
                        >
                            ORCHESTRATE PROGRAM
                        </button>
                    </form>
                </div>
            </dialog>
        </div>
    );
}

function GiftIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="8" width="18" height="4" rx="1" />
            <path d="M12 8v13" />
            <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
            <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
        </svg>
    );
}
