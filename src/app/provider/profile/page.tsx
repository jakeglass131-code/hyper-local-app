"use client";

import { useState, useEffect } from "react";
import { LogoutButton } from "../components/LogoutButton";
import { Camera, Mail, Phone, MapPin, CreditCard, Edit2, Save, X } from "lucide-react";
import { MerchantProfile } from "@/lib/store";
import { PinLock } from "@/components/PinLock";

const userId = "provider_123"; // TODO: Get from auth

export default function ProviderProfilePage() {
    const [profile, setProfile] = useState<MerchantProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Edit state
    const [editForm, setEditForm] = useState<Partial<MerchantProfile>>({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`/api/merchant/profile?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setEditForm(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // TODO: Implement API call to save profile
        setProfile(prev => ({ ...prev!, ...editForm }));
        setIsEditing(false);
        alert("Profile updated!");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white/60">Loading...</div>
            </div>
        );
    }

    if (isLocked) {
        return <PinLock onUnlock={() => setIsLocked(false)} />;
    }

    return (
        <div className="pb-24 px-4 py-6">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <p className="text-sm text-white/60 mt-1">
                        Manage your business details
                    </p>
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="p-2 bg-neutral-800 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                            <button onClick={handleSave} className="p-2 bg-indigo-500 rounded-full">
                                <Save className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="p-2 bg-neutral-800 rounded-full">
                            <Edit2 className="w-5 h-5" />
                        </button>
                    )}
                    <LogoutButton />
                </div>
            </header>

            {/* Business Logo */}
            <div className="mb-6 flex justify-center">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                        {profile?.businessLogo ? (
                            <img
                                src={profile.businessLogo}
                                alt="Business logo"
                                className="h-24 w-24 object-cover"
                            />
                        ) : (
                            <Camera className="h-8 w-8 text-white/40" />
                        )}
                    </div>
                    {isEditing && (
                        <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                            <Camera className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Business Details */}
            <div className="space-y-4 mb-6">
                <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
                    <div className="text-xs text-white/60 mb-1">Business Name</div>
                    {isEditing ? (
                        <input
                            value={editForm.businessName || ""}
                            onChange={e => setEditForm({ ...editForm, businessName: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 focus:border-indigo-500 outline-none py-1"
                        />
                    ) : (
                        <div className="font-semibold">{profile?.businessName || "Not set"}</div>
                    )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
                    <div className="text-xs text-white/60 mb-1">Category</div>
                    {isEditing ? (
                        <input
                            value={editForm.businessCategory || ""}
                            onChange={e => setEditForm({ ...editForm, businessCategory: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 focus:border-indigo-500 outline-none py-1"
                        />
                    ) : (
                        <div className="font-semibold">{profile?.businessCategory || "Not set"}</div>
                    )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4 flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-white/60 mt-0.5" />
                    <div className="flex-1">
                        <div className="text-xs text-white/60 mb-1">Address</div>
                        {isEditing ? (
                            <input
                                value={editForm.businessAddress || ""}
                                onChange={e => setEditForm({ ...editForm, businessAddress: e.target.value })}
                                className="w-full bg-transparent border-b border-white/20 focus:border-indigo-500 outline-none py-1"
                            />
                        ) : (
                            <div className="text-sm">{profile?.businessAddress || "Not set"}</div>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4 flex items-start gap-3">
                    <Mail className="h-5 w-5 text-white/60 mt-0.5" />
                    <div className="flex-1">
                        <div className="text-xs text-white/60 mb-1">Email</div>
                        {isEditing ? (
                            <input
                                value={editForm.contactEmail || ""}
                                onChange={e => setEditForm({ ...editForm, contactEmail: e.target.value })}
                                className="w-full bg-transparent border-b border-white/20 focus:border-indigo-500 outline-none py-1"
                            />
                        ) : (
                            <div className="text-sm">{profile?.contactEmail || "Not set"}</div>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4 flex items-start gap-3">
                    <Phone className="h-5 w-5 text-white/60 mt-0.5" />
                    <div className="flex-1">
                        <div className="text-xs text-white/60 mb-1">Phone</div>
                        {isEditing ? (
                            <input
                                value={editForm.contactPhone || ""}
                                onChange={e => setEditForm({ ...editForm, contactPhone: e.target.value })}
                                className="w-full bg-transparent border-b border-white/20 focus:border-indigo-500 outline-none py-1"
                            />
                        ) : (
                            <div className="text-sm">{profile?.contactPhone || "Not set"}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Subscription */}
            <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="h-5 w-5 text-white/60" />
                    <div className="flex-1">
                        <div className="text-xs text-white/60">Subscription</div>
                        <div className="font-semibold capitalize">
                            {profile?.subscriptionTier || "Free"} Plan
                        </div>
                    </div>
                </div>
                <button className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-sm font-medium">
                    Upgrade Plan
                </button>
            </div>

            {/* Merchant PIN */}
            <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
                <div className="text-xs text-white/60 mb-1">Merchant PIN</div>
                <div className="text-2xl font-mono tracking-wider">
                    {profile?.merchantPin || "****"}
                </div>
                <p className="text-xs text-white/40 mt-2">
                    Use this PIN to access the scanner
                </p>
            </div>
        </div>
    );
}
