"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const userId = "provider_123";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessName: "",
        businessCategory: "food",
        businessAddress: "",
        businessLogo: "",
        contactEmail: "",
        contactPhone: "",
        subscriptionTier: "free" as "free" | "basic" | "premium",
    });

    const updateData = (updates: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/merchant/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, ...formData }),
            });

            if (!res.ok) {
                alert("Failed to create profile");
                return;
            }

            await fetch("/api/merchant/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, onboardingCompleted: true }),
            });

            router.push("/provider/home");
        } catch (error) {
            console.error(error);
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-8">
            <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3744D2]">Provider Onboarding</p>

                {step === 1 && (
                    <div className="pt-3">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">Set up your business profile</h1>
                        <p className="mt-2 text-sm text-slate-600">This takes about 2 minutes and unlocks campaign tools.</p>
                        <button
                            onClick={() => setStep(2)}
                            className="mt-6 w-full rounded-xl bg-[#3744D2] px-4 py-3 text-sm font-bold text-white"
                        >
                            Get started
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 pt-3">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">Business details</h2>
                        <Input
                            label="Business name"
                            value={formData.businessName}
                            onChange={(value) => updateData({ businessName: value })}
                            placeholder="e.g. Main Street Coffee"
                        />
                        <label className="block">
                            <span className="text-sm font-semibold text-slate-700">Category</span>
                            <select
                                value={formData.businessCategory}
                                onChange={(event) => updateData({ businessCategory: event.target.value })}
                                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#3744D2]"
                            >
                                <option value="food">Food & Beverage</option>
                                <option value="retail">Retail</option>
                                <option value="service">Service</option>
                                <option value="entertainment">Entertainment</option>
                            </select>
                        </label>
                        <Input
                            label="Address"
                            value={formData.businessAddress}
                            onChange={(value) => updateData({ businessAddress: value })}
                            placeholder="Street, suburb, city"
                        />
                        <button
                            onClick={() => setStep(3)}
                            disabled={!formData.businessName || !formData.businessAddress}
                            className="w-full rounded-xl bg-[#3744D2] px-4 py-3 text-sm font-bold text-white disabled:opacity-45"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 pt-3">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">Contact details</h2>
                        <Input
                            label="Email"
                            value={formData.contactEmail}
                            onChange={(value) => updateData({ contactEmail: value })}
                            placeholder="business@email.com"
                            type="email"
                        />
                        <Input
                            label="Phone (optional)"
                            value={formData.contactPhone}
                            onChange={(value) => updateData({ contactPhone: value })}
                            placeholder="+1 ..."
                        />
                        <button
                            onClick={() => setStep(4)}
                            disabled={!formData.contactEmail}
                            className="w-full rounded-xl bg-[#3744D2] px-4 py-3 text-sm font-bold text-white disabled:opacity-45"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4 pt-3">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">Choose plan</h2>
                        {[
                            { tier: "free" as const, name: "Free", price: "$0", detail: "1 campaign/day" },
                            { tier: "basic" as const, name: "Basic", price: "$9/mo", detail: "5 campaigns/day" },
                            { tier: "premium" as const, name: "Premium", price: "$29/mo", detail: "Unlimited campaigns" },
                        ].map((plan) => (
                            <button
                                key={plan.tier}
                                onClick={() => updateData({ subscriptionTier: plan.tier })}
                                className={`w-full rounded-xl border p-4 text-left ${
                                    formData.subscriptionTier === plan.tier
                                        ? "border-[#3744D2] bg-[#3744D2]/5"
                                        : "border-slate-200 bg-white"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-900">{plan.name}</p>
                                    <p className="text-sm font-bold text-slate-700">{plan.price}</p>
                                </div>
                                <p className="mt-1 text-sm text-slate-600">{plan.detail}</p>
                            </button>
                        ))}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full rounded-xl bg-[#3744D2] px-4 py-3 text-sm font-bold text-white disabled:opacity-45"
                        >
                            {loading ? "Setting up..." : "Complete setup"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function Input({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: string;
}) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#3744D2]"
            />
        </label>
    );
}
