"use client";

import { Offer, Business, Program } from "@/lib/store";
import { Edit, Pause, Play, Trash2, Eye, Users, Clock, TrendingUp, ChevronDown, MessageCircle, Sparkles, Coffee, Sandwich, Award } from "lucide-react";
import { useState, useEffect } from "react";

import { getBusinessInsights } from "@/lib/aiInsights";
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
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-sm text-gray-600">Location:</span>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="text-sm font-medium text-gray-900 border-none focus:ring-0 pr-8 bg-transparent cursor-pointer"
                        >
                            {businesses.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Welcome Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
                <p className="text-gray-500 mt-1">
                    Here's what's happening with your businesses today.
                </p>

                {/* Quick Actions */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => onNavigate("scanner")}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                    >
                        <div className="p-1 bg-white rounded-md shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>
                        </div>
                        Scan QR
                    </button>
                    <button
                        onClick={() => onNavigate("offers", "create")}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                    >
                        <div className="p-1 bg-white rounded-md shadow-sm">
                            <Edit className="w-4 h-4" />
                        </div>
                        New Offer
                    </button>
                    <button
                        onClick={() => onNavigate("analytics")}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                    >
                        <div className="p-1 bg-white rounded-md shadow-sm">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        Analytics
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active Offers</p>
                            <p className="text-3xl font-bold mt-2">{activeOffers.length}</p>
                        </div>
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                            <GiftIcon className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Impressions</p>
                            <p className="text-3xl font-bold mt-2">{overview.totalImpressions || 0}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <Eye className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Redemptions</p>
                            <p className="text-3xl font-bold mt-2">{overview.totalRedemptions || 0}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Best Performing Snapshot */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-indigo-900">Top Offer This Week</h3>
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-gray-900">{topOffer.name}</p>
                    <span className="text-sm text-gray-600">–</span>
                    <span className="text-sm text-gray-700">
                        <span className="font-semibold text-indigo-600">{topOffer.redemptions} redemptions</span>
                        , ${topOffer.revenue} revenue
                    </span>
                </div>
            </div>

            {/* Busy Times Today */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Expected Busy Periods Today</h3>
                </div>
                <div className="flex gap-3">
                    {busyTimes.map((period, idx) => (
                        <div
                            key={idx}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full"
                        >
                            <span className="text-base">{period.emoji}</span>
                            <span className="text-sm font-medium text-orange-900">{period.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommended Next Action */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-lg border border-amber-200">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <Sparkles className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Recommended Action</h3>
                        <p className="text-sm text-gray-700 mb-3">
                            {recommendation.text}
                        </p>
                        <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors">
                            {recommendation.action}
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Offers Preview */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Active Offers</h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        View All
                    </button>
                </div>
                {activeOffers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No active offers. Create one to get started!
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {activeOffers.slice(0, 3).map((offer) => {
                            const business = businesses.find((b) => b.id === offer.businessId);
                            const progress = (offer.claimedCount / offer.inventory) * 100;

                            return (
                                <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{offer.title}</h4>
                                            <p className="text-sm text-gray-500">{business?.name}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                            Active
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                                            <span>Claims</span>
                                            <span>{offer.claimedCount}/{offer.inventory}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full"
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Loyalty System</h2>
                    {!program && (
                        <button
                            onClick={() => (document.getElementById('create-loyalty-modal') as HTMLDialogElement)?.showModal()}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            Create Loyalty Card
                        </button>
                    )}
                </div>

                {program ? (
                    <form onSubmit={onSaveProgram} className="space-y-6">
                        <div className="flex items-start gap-6">
                            {/* Preview Card */}
                            <div
                                className="w-48 h-72 rounded-xl shadow-lg p-4 text-white flex flex-col justify-between shrink-0 relative overflow-hidden transition-colors duration-500"
                                style={{
                                    background: program.cardColor
                                        ? `linear-gradient(135deg, ${program.cardColor}, #1a1a1a)`
                                        : 'linear-gradient(135deg, #4f46e5, #7e22ce)'
                                }}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                                        {program.logo ? (
                                            <img src={program.logo} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <Coffee className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight">{program.name || "Loyalty Card"}</h3>
                                    <p className="text-xs text-indigo-200 mt-1">Member Card</p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 relative z-10 px-2">
                                    {Array.from({ length: program.stampsRequired || 10 }).map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                                            {i === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Edit Form */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Logo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                                            {program.logo ? (
                                                <img src={program.logo} alt="Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <Coffee className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <label className="flex-1 cursor-pointer">
                                            <div className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center">
                                                Upload Loyalty Logo
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => {
                                                            const dataUrl = ev.target?.result as string;

                                                            // Extract color
                                                            const img = new Image();
                                                            img.src = dataUrl;
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

                                                                    // Extract color from resized image
                                                                    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                                                                    const color = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

                                                                    // Update program with new logo and color
                                                                    // We need to update the parent state, but onSaveProgram only takes a form event.
                                                                    // For this demo, we'll modify the local program object directly and force a re-render 
                                                                    // or ideally, we should have a setProgram prop.
                                                                    // Since we don't, we'll use a hidden input to pass the data on save,
                                                                    // AND we need to update the UI immediately.
                                                                    // Let's assume we can mutate the prop object for immediate preview (React anti-pattern but works for simple mutable objects if we force update)
                                                                    // OR better: The parent `BusinessPage` passes `program`. We can't easily update it without a setter.
                                                                    // I will add `onUpdateProgram` to the interface to handle partial updates.
                                                                    onUpdateProgram({ logo: dataUrl, cardColor: color });
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={program.name}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2.5 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stamps Required</label>
                                    <input
                                        type="number"
                                        name="stampsRequired"
                                        defaultValue={program.stampsRequired}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2.5 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                        min="1"
                                        max="20"
                                    />
                                </div>
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <input
                                        type="checkbox"
                                        name="limitOnePerDay"
                                        defaultChecked={program.limitOnePerDay}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Limit one stamp per customer per day</label>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onRemoveProgram}
                                        className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No Loyalty Program Yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
                            Create a digital punch card to reward your regulars and keep them coming back.
                        </p>
                        <button
                            onClick={() => (document.getElementById('create-loyalty-modal') as HTMLDialogElement)?.showModal()}
                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
                        >
                            Create Loyalty Card
                        </button>
                    </div>
                )}
            </div>

            {/* Create Loyalty Modal */}
            <dialog id="create-loyalty-modal" className="modal p-0 rounded-2xl shadow-2xl backdrop:bg-black/50 w-full max-w-md">
                <div className="bg-white p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Create Loyalty Card</h3>
                        <form method="dialog">
                            <button className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Card Logo</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden relative">
                                    {newProgramLogo ? (
                                        <img src={newProgramLogo} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className="text-xs text-gray-500"><span className="font-semibold">Click to upload</span> logo</p>
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Coffee Club, Bread Lovers"
                                className="w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">What are customers collecting stamps for?</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stamps Needed</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="stampsRequired"
                                    defaultValue={10}
                                    className="w-full rounded-lg border-gray-300 shadow-sm p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                    min="1"
                                    max="50"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 text-sm">
                                    stamps
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            Create Program
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
