"use client";

import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Check, Upload, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

const userId = "provider_123"; // TODO: Get from auth
const businessId = "biz_123"; // TODO: Get from profile

type OfferData = {
    title: string;
    description: string;
    productType: string;
    discountType: "percent" | "fixed" | "bundle";
    value: number;
    startsAt: string;
    endsAt: string;
    radiusMeters: number;
    inventory: number;
    targetDemographics: string[];
    targetAgeRange?: { min: number; max: number };
    notificationEnabled: boolean;
    imageUrl?: string;
};

export default function CreateOfferPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Default dates: Start today, End 7 days from now
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [offerData, setOfferData] = useState<OfferData>({
        title: "",
        description: "",
        productType: "food",
        discountType: "percent",
        value: 10,
        startsAt: today,
        endsAt: nextWeek,
        radiusMeters: 5000,
        inventory: 10,
        targetDemographics: [],
        notificationEnabled: false,
        imageUrl: "",
    });

    const updateData = (updates: Partial<OfferData>) => {
        setOfferData({ ...offerData, ...updates });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateData({ imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/merchant/offers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    businessId,
                    ...offerData,
                    startsAt: new Date(offerData.startsAt).getTime(),
                    endsAt: new Date(offerData.endsAt).getTime(),
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                alert(error.error || "Failed to create offer");
                return;
            }

            alert("Offer created successfully!");
            router.push("/provider/home");
        } catch (e) {
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    const totalSteps = 5;

    return (
        <div className="pb-24 px-4 py-6">
            <header className="mb-6">
                <button
                    onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
                    className="flex items-center text-indigo-400 mb-4"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                </button>
                <h1 className="text-2xl font-bold">Create Offer</h1>
                <p className="text-sm text-white/60 mt-1">
                    Step {step} of {totalSteps}
                </p>
            </header>

            {/* Progress bar */}
            <div className="mb-6 flex gap-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${i < step ? "bg-indigo-500" : "bg-white/10"
                            }`}
                    />
                ))}
            </div>

            {/* Step 1: Basic Details */}
            {step === 1 && (
                <div className="space-y-4">
                    {/* Image Upload */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-40 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center bg-neutral-900/50 cursor-pointer hover:bg-neutral-900 transition-colors overflow-hidden relative"
                    >
                        {offerData.imageUrl ? (
                            <img src={offerData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <Upload className="h-8 w-8 text-white/40 mb-2" />
                                <span className="text-sm text-white/60">Tap to upload image</span>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-white/70">Offer Title</label>
                        <input
                            value={offerData.title}
                            onChange={(e) => updateData({ title: e.target.value })}
                            className="mt-2 w-full rounded-2xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                            placeholder="e.g. 50% Off Coffee"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-white/70">Description</label>
                        <textarea
                            value={offerData.description}
                            onChange={(e) => updateData({ description: e.target.value })}
                            className="mt-2 w-full rounded-2xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                            rows={3}
                            placeholder="Describe your offer..."
                        />
                    </div>
                    <div>
                        <label className="text-sm text-white/70">Product Type</label>
                        <select
                            value={offerData.productType}
                            onChange={(e) => updateData({ productType: e.target.value })}
                            className="mt-2 w-full rounded-2xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                        >
                            <option value="food">Food & Beverage</option>
                            <option value="retail">Retail</option>
                            <option value="service">Service</option>
                            <option value="entertainment">Entertainment</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Step 2: Discount Details */}
            {step === 2 && (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-white/70">Discount Type</label>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {(["percent", "fixed", "bundle"] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => updateData({ discountType: type })}
                                    className={`rounded-2xl px-4 py-3 text-sm font-medium border ${offerData.discountType === type
                                        ? "bg-indigo-500 border-indigo-500"
                                        : "bg-neutral-900 border-white/10"
                                        }`}
                                >
                                    {type === "percent" ? "%" : type === "fixed" ? "$" : "Bundle"}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-white/70">
                            {offerData.discountType === "percent" ? "Percentage" : "Amount"}
                        </label>
                        <input
                            type="number"
                            value={offerData.value}
                            onChange={(e) => updateData({ value: Number(e.target.value) })}
                            className="mt-2 w-full rounded-2xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-white/70">Inventory (slots)</label>
                        <input
                            type="number"
                            value={offerData.inventory}
                            onChange={(e) => updateData({ inventory: Number(e.target.value) })}
                            className="mt-2 w-full rounded-2xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>
            )}

            {/* Step 3: Duration & Radius */}
            {step === 3 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-white/70">Start Date</label>
                            <div className="relative mt-2">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                <input
                                    type="date"
                                    value={offerData.startsAt}
                                    onChange={(e) => updateData({ startsAt: e.target.value })}
                                    className="w-full rounded-2xl bg-neutral-900 border border-white/10 pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-white/70">End Date</label>
                            <div className="relative mt-2">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                <input
                                    type="date"
                                    value={offerData.endsAt}
                                    onChange={(e) => updateData({ endsAt: e.target.value })}
                                    className="w-full rounded-2xl bg-neutral-900 border border-white/10 pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-white/70">Location Radius (meters)</label>
                        <input
                            type="number"
                            value={offerData.radiusMeters}
                            onChange={(e) => updateData({ radiusMeters: Number(e.target.value) })}
                            className="mt-2 w-full rounded-2xl bg-neutral-900 border border-white/10 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                        />
                        <p className="text-xs text-white/40 mt-2">
                            {(offerData.radiusMeters / 1000).toFixed(1)} km radius
                        </p>
                    </div>
                </div>
            )}

            {/* Step 4: Targeting */}
            {step === 4 && (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-white/70">Target Demographics</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {["students", "families", "professionals", "seniors"].map((demo) => (
                                <button
                                    key={demo}
                                    onClick={() => {
                                        const current = offerData.targetDemographics;
                                        updateData({
                                            targetDemographics: current.includes(demo)
                                                ? current.filter((d) => d !== demo)
                                                : [...current, demo],
                                        });
                                    }}
                                    className={`rounded-full px-4 py-2 text-sm ${offerData.targetDemographics.includes(demo)
                                        ? "bg-indigo-500"
                                        : "bg-neutral-900 border border-white/10"
                                        }`}
                                >
                                    {demo}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
                <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
                        <h3 className="font-semibold mb-4">Review Your Offer</h3>
                        {offerData.imageUrl && (
                            <div className="mb-4 h-32 w-full rounded-xl overflow-hidden">
                                <img src={offerData.imageUrl} alt="Offer" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/60">Title:</span>
                                <span>{offerData.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Discount:</span>
                                <span>
                                    {offerData.discountType === "percent"
                                        ? `${offerData.value}%`
                                        : `$${offerData.value}`}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Valid:</span>
                                <span>{offerData.startsAt} to {offerData.endsAt}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Inventory:</span>
                                <span>{offerData.inventory} slots</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex gap-3">
                {step < totalSteps ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-3"
                    >
                        Next
                        <ArrowRight className="h-5 w-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-medium py-3 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Publish Offer"}
                        <Check className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
