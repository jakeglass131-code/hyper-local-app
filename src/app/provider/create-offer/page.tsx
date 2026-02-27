"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, Check, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const userId = "provider_123";
const businessId = "biz_123";

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

    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const [offerData, setOfferData] = useState<OfferData>({
        title: "",
        description: "",
        productType: "food",
        discountType: "percent",
        value: 10,
        startsAt: today,
        endsAt: nextWeek,
        radiusMeters: 2000,
        inventory: 25,
        targetDemographics: [],
        notificationEnabled: false,
        imageUrl: "",
    });

    const totalSteps = 5;

    const updateData = (updates: Partial<OfferData>) => setOfferData((prev) => ({ ...prev, ...updates }));

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => updateData({ imageUrl: reader.result as string });
        reader.readAsDataURL(file);
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

            alert("Offer created successfully");
            router.push("/provider/home");
        } catch (error) {
            console.error(error);
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-28 pt-6">
            <header className="mb-5">
                <button
                    onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
                    className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-[#008A5E]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008A5E]">Campaign Builder</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Create Offer</h1>
                <p className="mt-1 text-sm text-slate-600">Step {step} of {totalSteps}</p>
            </header>

            <div className="mb-6 flex gap-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <div key={index} className="h-1.5 flex-1 rounded-full bg-slate-200">
                        <div
                            className="h-1.5 rounded-full bg-[#008A5E] transition-all"
                            style={{ width: `${index < step ? 100 : 0}%` }}
                        />
                    </div>
                ))}
            </div>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                {step === 1 && (
                    <div className="space-y-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative flex h-44 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50"
                        >
                            {offerData.imageUrl ? (
                                <img src={offerData.imageUrl} alt="Offer preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <Upload className="mx-auto h-8 w-8 text-slate-400" />
                                    <p className="mt-2 text-sm font-semibold text-slate-600">Upload visual</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        <InputField
                            label="Offer title"
                            value={offerData.title}
                            onChange={(value) => updateData({ title: value })}
                            placeholder="e.g. 25% off lunch bowls"
                        />
                        <TextAreaField
                            label="Description"
                            value={offerData.description}
                            onChange={(value) => updateData({ description: value })}
                            placeholder="Clear value proposition and urgency"
                        />
                        <SelectField
                            label="Category"
                            value={offerData.productType}
                            onChange={(value) => updateData({ productType: value })}
                            options={[
                                { value: "food", label: "Food & Beverage" },
                                { value: "retail", label: "Retail" },
                                { value: "service", label: "Service" },
                                { value: "entertainment", label: "Entertainment" },
                            ]}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <p className="mb-2 text-sm font-semibold text-slate-700">Discount type</p>
                            <div className="grid grid-cols-3 gap-2">
                                {(["percent", "fixed", "bundle"] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => updateData({ discountType: type })}
                                        className={`rounded-xl border px-3 py-2 text-sm font-semibold capitalize ${offerData.discountType === type
                                            ? "border-[#008A5E] bg-[#008A5E]/10 text-[#008A5E]"
                                            : "border-slate-200 bg-white text-slate-600"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <InputField
                            label={offerData.discountType === "percent" ? "Discount %" : "Discount amount"}
                            value={String(offerData.value)}
                            onChange={(value) => updateData({ value: Number(value) })}
                            placeholder="10"
                            type="number"
                        />
                        <InputField
                            label="Inventory (available redemptions)"
                            value={String(offerData.inventory)}
                            onChange={(value) => updateData({ inventory: Number(value) })}
                            placeholder="25"
                            type="number"
                        />
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <DateField
                                label="Start date"
                                value={offerData.startsAt}
                                onChange={(value) => updateData({ startsAt: value })}
                            />
                            <DateField
                                label="End date"
                                value={offerData.endsAt}
                                onChange={(value) => updateData({ endsAt: value })}
                            />
                        </div>

                        <InputField
                            label="Radius (meters)"
                            value={String(offerData.radiusMeters)}
                            onChange={(value) => updateData({ radiusMeters: Number(value) })}
                            placeholder="2000"
                            type="number"
                        />
                        <p className="text-xs text-slate-500">Current coverage: {(offerData.radiusMeters / 1000).toFixed(1)} km</p>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        <p className="text-sm font-semibold text-slate-700">Target demographics</p>
                        <div className="flex flex-wrap gap-2">
                            {["students", "families", "professionals", "seniors"].map((segment) => (
                                <button
                                    key={segment}
                                    onClick={() => {
                                        const current = offerData.targetDemographics;
                                        const updated = current.includes(segment)
                                            ? current.filter((item) => item !== segment)
                                            : [...current, segment];
                                        updateData({ targetDemographics: updated });
                                    }}
                                    className={`rounded-full border px-3 py-1.5 text-sm font-semibold capitalize ${offerData.targetDemographics.includes(segment)
                                        ? "border-[#008A5E] bg-[#008A5E] text-white"
                                        : "border-slate-200 bg-white text-slate-600"
                                        }`}
                                >
                                    {segment}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Review</h2>
                            <div className="mt-3 space-y-2 text-sm text-slate-700">
                                <Row label="Title" value={offerData.title || "-"} />
                                <Row
                                    label="Discount"
                                    value={
                                        offerData.discountType === "percent"
                                            ? `${offerData.value}%`
                                            : `$${offerData.value}`
                                    }
                                />
                                <Row label="Duration" value={`${offerData.startsAt} to ${offerData.endsAt}`} />
                                <Row label="Inventory" value={`${offerData.inventory}`} />
                                <Row label="Radius" value={`${offerData.radiusMeters}m`} />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <div className="mt-5 flex gap-3">
                {step < totalSteps ? (
                    <button
                        onClick={() => setStep((prev) => prev + 1)}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#008A5E] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#008A5E]/20"
                    >
                        Next
                        <ArrowRight className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#008A5E] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#008A5E]/20 disabled:opacity-45"
                    >
                        {loading ? "Creating..." : "Publish Offer"}
                        <Check className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

function InputField({
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
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008A5E]"
            />
        </label>
    );
}

function TextAreaField({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <textarea
                rows={3}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008A5E]"
            />
        </label>
    );
}

function SelectField({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008A5E]"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

function DateField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <div className="relative mt-1">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="date"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-[#008A5E]"
                />
            </div>
        </label>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2 last:border-0 last:pb-0">
            <span className="text-slate-500">{label}</span>
            <span className="font-semibold text-slate-900">{value}</span>
        </div>
    );
}
