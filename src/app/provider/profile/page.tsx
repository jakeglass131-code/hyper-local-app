"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Camera,
    CreditCard,
    Edit2,
    Mail,
    MapPin,
    Phone,
    Save,
    Shield,
    Store,
    X,
} from "lucide-react";
import { MerchantProfile } from "@/lib/store";
import { PinLock } from "@/components/PinLock";
import { LogoutButton } from "../components/LogoutButton";
import { PlanSwitchModal } from "@/components/PlanSwitchModal";

const userId = "provider_123";

export default function ProviderProfilePage() {
    const [profile, setProfile] = useState<MerchantProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<MerchantProfile>>({});
    const [showPlanModal, setShowPlanModal] = useState(false);

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
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setProfile((prev) => ({ ...prev!, ...editForm }));
        setIsEditing(false);
        alert("Profile updated");
    };

    const handlePlanChange = async (tier: string) => {
        try {
            // In a real app, this would be a PATCH to /api/merchant/profile
            setProfile((prev) => prev ? { ...prev, subscriptionTier: tier as any } : null);
            setShowPlanModal(false);
            alert(`Plan successfully switched to ${tier}!`);
        } catch (error) {
            console.error(error);
            alert("Failed to switch plan");
        }
    };

    const readiness = useMemo(() => {
        if (!profile) return 58;

        let score = 55;
        if (profile.businessName) score += 10;
        if (profile.businessAddress) score += 10;
        if (profile.contactEmail) score += 10;
        if (profile.contactPhone) score += 5;
        if (profile.businessLogo) score += 10;

        return Math.min(score, 100);
    }, [profile]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
                    Loading profile...
                </div>
            </div>
        );
    }

    if (isLocked) {
        return <PinLock onUnlock={() => setIsLocked(false)} />;
    }

    return (
        <div className="min-h-screen pb-28 pt-6">
            <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3744D2]">Business Identity</p>
                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Profile & Settings</h1>
                    <p className="mt-1 text-sm text-slate-600">Everything your customers and campaigns depend on.</p>
                </div>

                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center gap-1 rounded-xl bg-[#3744D2] px-3 py-2 text-sm font-semibold text-white"
                            >
                                <Save className="h-4 w-4" />
                                Save
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit
                        </button>
                    )}
                    <LogoutButton />
                </div>
            </header>

            <section className="mb-6 grid gap-4 lg:grid-cols-5">
                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                    <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                {profile?.businessLogo ? (
                                    <img src={profile.businessLogo} alt="Business logo" className="h-full w-full object-cover" />
                                ) : (
                                    <Store className="h-8 w-8 text-slate-400" />
                                )}
                            </div>
                            {isEditing && (
                                <button className="absolute -bottom-2 -right-2 rounded-full bg-[#3744D2] p-2 text-white shadow-md">
                                    <Camera className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Readiness Score</p>
                            <p className="mt-1 text-3xl font-black text-slate-900">{readiness}%</p>
                            <p className="mt-1 text-sm text-slate-600">Higher profile completeness improves map trust and conversions.</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="h-2 rounded-full bg-slate-200">
                            <div className="h-2 rounded-full bg-[#3744D2]" style={{ width: `${readiness}%` }} />
                        </div>
                    </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
                    <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Core Details</h2>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <FieldCard
                            label="Business Name"
                            icon={<Store className="h-4 w-4" />}
                            editing={isEditing}
                            value={editForm.businessName || ""}
                            placeholder="Business name"
                            onChange={(value) => setEditForm({ ...editForm, businessName: value })}
                            displayValue={profile?.businessName || "Not set"}
                        />
                        <FieldCard
                            label="Category"
                            icon={<Store className="h-4 w-4" />}
                            editing={isEditing}
                            value={editForm.businessCategory || ""}
                            placeholder="Category"
                            onChange={(value) => setEditForm({ ...editForm, businessCategory: value })}
                            displayValue={profile?.businessCategory || "Not set"}
                        />
                        <FieldCard
                            label="Address"
                            icon={<MapPin className="h-4 w-4" />}
                            editing={isEditing}
                            value={editForm.businessAddress || ""}
                            placeholder="Street, city"
                            onChange={(value) => setEditForm({ ...editForm, businessAddress: value })}
                            displayValue={profile?.businessAddress || "Not set"}
                        />
                        <FieldCard
                            label="Email"
                            icon={<Mail className="h-4 w-4" />}
                            editing={isEditing}
                            value={editForm.contactEmail || ""}
                            placeholder="contact@business.com"
                            onChange={(value) => setEditForm({ ...editForm, contactEmail: value })}
                            displayValue={profile?.contactEmail || "Not set"}
                        />
                        <FieldCard
                            label="Phone"
                            icon={<Phone className="h-4 w-4" />}
                            editing={isEditing}
                            value={editForm.contactPhone || ""}
                            placeholder="+1 ..."
                            onChange={(value) => setEditForm({ ...editForm, contactPhone: value })}
                            displayValue={profile?.contactPhone || "Not set"}
                        />
                    </div>
                </article>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-[#3744D2]" />
                        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Plan & Billing</h2>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                        <p className="text-sm font-bold text-slate-900">
                            Current plan: <span className="text-[#3744D2] capitalize">{profile?.subscriptionTier || "free"}</span>
                        </p>
                        <p className="mt-1 text-sm text-slate-600">Upgrade for advanced automation, team permissions, and unlimited campaign variants.</p>
                        <button
                            onClick={() => setShowPlanModal(true)}
                            className="mt-3 rounded-xl bg-[#3744D2] px-4 py-2 text-sm font-semibold text-white"
                        >
                            {profile?.subscriptionTier && profile.subscriptionTier !== "free" ? "Switch Plan" : "Upgrade Plan"}
                        </button>
                    </div>
                </article>

                <PlanSwitchModal
                    isOpen={showPlanModal}
                    onClose={() => setShowPlanModal(false)}
                    onConfirm={handlePlanChange}
                    currentPlan={profile?.subscriptionTier}
                />

                <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#3744D2]" />
                        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Security</h2>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Merchant PIN</p>
                        <p className="mt-1 font-mono text-2xl font-black tracking-wider text-slate-900">{profile?.merchantPin || "****"}</p>
                        <p className="mt-1 text-sm text-slate-600">Use this PIN to unlock scanner and sensitive analytics.</p>
                    </div>
                </article>
            </section>
        </div>
    );
}

function FieldCard({
    label,
    icon,
    editing,
    value,
    placeholder,
    onChange,
    displayValue,
}: {
    label: string;
    icon: React.ReactNode;
    editing: boolean;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    displayValue: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
            <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                {icon}
                {label}
            </div>
            {editing ? (
                <input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#3744D2]"
                    placeholder={placeholder}
                />
            ) : (
                <p className="text-sm font-semibold text-slate-900">{displayValue}</p>
            )}
        </div>
    );
}
