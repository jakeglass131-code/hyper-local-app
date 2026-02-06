"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ArrowRight } from "lucide-react";

const userId = "provider_123"; // TODO: Get from auth

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
        setFormData({ ...formData, ...updates });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Create profile
            const res = await fetch("/api/merchant/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, ...formData }),
            });

            if (!res.ok) {
                alert("Failed to create profile");
                return;
            }

            const profile = await res.json();

            // Mark onboarding complete
            await fetch("/api/merchant/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, onboardingCompleted: true }),
            });

            router.push("/provider/home");
        } catch (e) {
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white px-4 py-6">
            {/* Step 1: Welcome */}
            {step === 1 && (
                <div className="max-w-md mx-auto text-center py-12">
                    <h1 className="text-3xl font-bold mb-4">Welcome to Hyper Local</h1>
                    <p className="text-white/60 mb-8">
                        Let's set up your business profile to start creating offers
                    </p>
                    <button
                        onClick={() => setStep(2)}
                        className="w-full rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-3"
                    >
                        Get Started
                    </button>
                </div>
            )}

            {/* Step 2: Business Details */}
            {step === 2 && (
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Business Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-white/70">Business Name</label>
                            <input
                                value={formData.businessName}
                                onChange={(e) => updateData({ businessName: e.target.value })}
                                className="mt-2 w-full rounded-2xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                                placeholder="e.g. Jake's Ice Cream"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-white/70">Category</label>
                            <select
                                value={formData.businessCategory}
                                onChange={(e) => updateData({ businessCategory: e.target.value })}
                                className="mt-2 w-full rounded-2xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                            >
                                <option value="food">Food & Beverage</option>
                                <option value="retail">Retail</option>
                                <option value="service">Service</option>
                                <option value="entertainment">Entertainment</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-white/70">Address</label>
                            <input
                                value={formData.businessAddress}
                                onChange={(e) => updateData({ businessAddress: e.target.value })}
                                className="mt-2 w-full rounded-2xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                                placeholder="123 Main St, City"
                            />
                        </div>
                        <button
                            onClick={() => setStep(3)}
                            disabled={!formData.businessName || !formData.businessAddress}
                            className="w-full rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-3 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Contact */}
            {step === 3 && (
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-white/70">Email</label>
                            <input
                                type="email"
                                value={formData.contactEmail}
                                onChange={(e) => updateData({ contactEmail: e.target.value })}
                                className="mt-2 w-full rounded-2xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                                placeholder="business@example.com"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-white/70">Phone (optional)</label>
                            <input
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => updateData({ contactPhone: e.target.value })}
                                className="mt-2 w-full rounded-2xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                        <button
                            onClick={() => setStep(4)}
                            disabled={!formData.contactEmail}
                            className="w-full rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-3 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Subscription */}
            {step === 4 && (
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
                    <div className="space-y-4 mb-6">
                        {[
                            { tier: "free" as const, name: "Free", price: "$0", offers: "1 offer/day" },
                            { tier: "basic" as const, name: "Basic", price: "$9/mo", offers: "5 offers/day" },
                            { tier: "premium" as const, name: "Premium", price: "$29/mo", offers: "Unlimited" },
                        ].map((plan) => (
                            <button
                                key={plan.tier}
                                onClick={() => updateData({ subscriptionTier: plan.tier })}
                                className={`w-full rounded-2xl border p-4 text-left ${formData.subscriptionTier === plan.tier
                                        ? "border-indigo-500 bg-indigo-500/10"
                                        : "border-white/10 bg-neutral-900"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-semibold">{plan.name}</div>
                                    <div className="text-lg font-bold">{plan.price}</div>
                                </div>
                                <div className="text-sm text-white/60">{plan.offers}</div>
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-3 disabled:opacity-50"
                    >
                        {loading ? "Setting up..." : "Complete Setup"}
                    </button>
                </div>
            )}
        </div>
    );
}
