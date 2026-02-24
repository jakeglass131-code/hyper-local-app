"use client";

import { useState, useEffect } from "react";
import { Business, MerchantProfile } from "@/lib/store";
import { Camera, MapPin, Mail, Phone, Save, X } from "lucide-react";
import { SubscriptionUpgrade } from "./SubscriptionUpgrade";


interface BusinessProfileProps {
    profile: MerchantProfile | null;
    onSave: (data: Partial<MerchantProfile>) => Promise<void>;
}

export function BusinessProfile({ profile, onSave }: BusinessProfileProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<MerchantProfile>>(profile || {});
    const [emailError, setEmailError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const [showUpgrade, setShowUpgrade] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        await onSave(formData);
        setLoading(false);
    };

    return (
        <>
            {showUpgrade && <SubscriptionUpgrade onClose={() => setShowUpgrade(false)} />}
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl">
                    <h2 className="text-2xl font-black text-white mb-8 tracking-tight uppercase">Executive Profile</h2>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Logo Upload */}
                        <div className="flex items-center gap-8">
                            <div className="relative h-28 w-28 group cursor-pointer">
                                <div className="h-28 w-28 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden group-hover:bg-white/10 transition-all shadow-inner">
                                    {formData.businessLogo ? (
                                        <img
                                            src={formData.businessLogo}
                                            alt="Logo"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <Camera className="h-10 w-10 text-white/20" />
                                    )}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-black uppercase tracking-widest">Update</span>
                                </div>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setIsUploading(true);
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setTimeout(() => {
                                                    setFormData({ ...formData, businessLogo: reader.result as string });
                                                    setIsUploading(false);
                                                    setShowToast(true);
                                                    setTimeout(() => setShowToast(false), 3000);
                                                }, 1500);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Brand Identifier</h3>
                                <p className="text-sm text-white/40 leading-relaxed font-medium">
                                    Square dimension highly recommended. This logo will represent your business across the platform.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/40">Legal Entity Name</label>
                                <input
                                    type="text"
                                    value={formData.businessName || ""}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-brand transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/40">Market Category</label>
                                <select
                                    value={formData.businessCategory || ""}
                                    onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-brand transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-[#0B0B0F]">Select category</option>
                                    <option value="Cafe" className="bg-[#0B0B0F]">Cafe / Bakery</option>
                                    <option value="Restaurant" className="bg-[#0B0B0F]">Fine Dining / Casual</option>
                                    <option value="Retail" className="bg-[#0B0B0F]">Retail Store</option>
                                    <option value="Service" className="bg-[#0B0B0F]">Professional Service</option>
                                    <option value="Beauty" className="bg-[#0B0B0F]">Beauty & Wellness</option>
                                    <option value="Health" className="bg-[#0B0B0F]">Health & Wellness</option>
                                    <option value="Entertainment" className="bg-[#0B0B0F]">Entertainment</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/40">Headquarters Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-brand" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.businessAddress || ""}
                                        onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                                        className="w-full pl-14 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-brand transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/40">Official Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-brand" />
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.contactEmail || ""}
                                        onChange={(e) => {
                                            setFormData({ ...formData, contactEmail: e.target.value });
                                            if (emailError) setEmailError(null);
                                        }}
                                        className={`w-full pl-14 bg-white/5 border rounded-2xl px-5 py-4 text-white font-bold focus:border-brand transition-all outline-none ${emailError ? "border-red-500" : "border-white/10"}`}
                                    />
                                </div>
                                {emailError && (
                                    <p className="mt-1 text-xs font-black text-red-500 uppercase tracking-widest">{emailError}</p>
                                )}
                            </div>
                            <div className="space-y-3">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/40">Terminal Phone</label>
                                <div className="flex rounded-2xl overflow-hidden border border-white/10 bg-white/5 focus-within:border-brand transition-all">
                                    <div className="flex items-center gap-2 px-4 bg-white/5 border-r border-white/10 min-w-[120px]">
                                        <select
                                            value={formData.contactPhone?.split(" ")[0] || "+1"}
                                            onChange={(e) => {
                                                const currentNumber = formData.contactPhone?.split(" ")[1] || "";
                                                setFormData({ ...formData, contactPhone: `${e.target.value} ${currentNumber}` });
                                            }}
                                            className="bg-transparent border-none focus:ring-0 p-0 text-xs font-black text-white/40 w-full cursor-pointer outline-none"
                                        >
                                            <option value="+61" className="bg-[#0B0B0F]">AU +61</option>
                                            <option value="+44" className="bg-[#0B0B0F]">UK +44</option>
                                            <option value="+1" className="bg-[#0B0B0F]">US +1</option>
                                        </select>
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.contactPhone?.split(" ")[1] || ""}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, "");
                                            const currentCode = formData.contactPhone?.split(" ")[0] || "+1";
                                            setFormData({ ...formData, contactPhone: `${currentCode} ${val}` });
                                        }}
                                        placeholder="Mobile digits"
                                        className="w-full bg-transparent px-5 py-4 text-white font-bold outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-3 px-10 py-4 bg-brand text-white text-sm font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20 uppercase tracking-[0.2em] disabled:opacity-30"
                            >
                                <Save className="h-5 w-5" />
                                {loading ? "SYNCHRONIZING..." : "SAVE CHANGES"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Subscription & Security */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Subscription Protocol</h3>
                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Active Tier</p>
                                <p className="text-2xl font-black text-brand uppercase tracking-tight">{profile?.subscriptionTier || "Standard"}</p>
                            </div>
                            <button
                                onClick={() => setShowUpgrade(true)}
                                className="px-6 py-2 bg-brand/20 text-brand text-xs font-black rounded-xl hover:bg-brand hover:text-white transition-all uppercase tracking-widest shadow-inner"
                            >
                                UPGRADE
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Security Interface</h3>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Master Merchant PIN</p>
                            <div className="flex items-center justify-between">
                                <p className="font-black text-3xl tracking-[0.4em] text-white font-mono">{profile?.merchantPin || "••••"}</p>
                                <button className="text-xs font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">RESET ACCESS</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Animation Overlay */}
            {isUploading && (
                <div className="fixed inset-0 z-[150] bg-[#0B0B0F]/95 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-500">
                    <button onClick={() => setIsUploading(false)} className="absolute top-10 left-10 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
                        <ChevronLeftIcon size={32} />
                    </button>

                    <div className="relative w-80 h-80">
                        {/* Circular Progress SVG */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="160"
                                cy="160"
                                r="140"
                                fill="none"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="8"
                            />
                            <circle
                                cx="160"
                                cy="160"
                                r="140"
                                fill="none"
                                stroke="#7C3AED"
                                strokeWidth="8"
                                strokeLinecap="round"
                                className="animate-draw-circle"
                                style={{ strokeDashoffset: 880 }}
                            />
                        </svg>

                        {/* Image inside circle */}
                        <div className="absolute inset-10 rounded-[3rem] overflow-hidden bg-white/5 border-8 border-[#0B0B0F] shadow-2xl">
                            {formData.businessLogo ? (
                                <img src={formData.businessLogo} className="w-full h-full object-cover grayscale brightness-110" alt="Uploading..." />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Camera size={64} className="text-white/10" />
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="mt-12 text-sm font-black tracking-[0.5em] text-brand uppercase animate-pulse">UPDATING REPOSITORY</p>
                </div>
            )}

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-6 left-1/2 z-[200] bg-[#2A2A2A] text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[320px] animate-toast-popup">
                    <span className="flex-1 font-medium">Profile picture updated</span>
                    <button onClick={() => setShowToast(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
            )}
        </>
    );
}

function ChevronLeftIcon({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
    );
}

