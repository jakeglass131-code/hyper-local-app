"use client";

import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Check, Camera, Upload } from "lucide-react";

type OfferData = {
    title: string;
    description: string;
    productType: string;
    discountType: "percent" | "fixed";
    value: number;
    originalPrice?: number;
    duration: number; // Hours
    radiusMeters: number;
    inventory: number;
    notificationEnabled: boolean;
    imageUrl: string;
};

interface CreateOfferWizardProps {
    userId: string;
    businesses: { id: string; name: string }[];
    onComplete: () => void;
    onCancel?: () => void;
    initialData?: any; // Offer type
}

export function CreateOfferWizard({ userId, businesses, onComplete, onCancel, initialData }: CreateOfferWizardProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedBusinessId, setSelectedBusinessId] = useState(initialData?.businessId || businesses[0]?.id || "");
    const [offerData, setOfferData] = useState<OfferData>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        productType: initialData?.productType || "food",
        discountType: initialData?.discountType || "percent",
        value: initialData?.value || 10,
        originalPrice: initialData?.originalPrice,
        duration: initialData ? (initialData.endsAt - initialData.startsAt) / (1000 * 60 * 60) : 24,
        radiusMeters: initialData?.radiusMeters || 1000,
        inventory: initialData?.inventory || 10,
        notificationEnabled: initialData?.notificationEnabled || false,
        imageUrl: initialData?.imageUrl || "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateData = (updates: Partial<OfferData>) => {
        setOfferData({ ...offerData, ...updates });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (!selectedBusinessId) {
            alert("Please select a business");
            return;
        }

        setLoading(true);
        try {
            const url = initialData ? `/api/offers/${initialData.id}` : "/api/merchant/offers";
            const method = initialData ? "PUT" : "POST";

            const body = {
                userId,
                businessId: selectedBusinessId,
                ...offerData,
                startsAt: initialData ? initialData.startsAt : Date.now(),
                endsAt: (initialData ? initialData.startsAt : Date.now()) + offerData.duration * 60 * 60 * 1000,
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const error = await res.json();
                alert(error.error || "Failed to save offer");
                return;
            }

            alert(initialData ? "Offer updated successfully!" : "Offer created successfully!");
            onComplete();
        } catch (e) {
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (step === 2 && offerData.discountType === "percent") {
            if (!offerData.originalPrice || offerData.originalPrice <= 0) {
                alert("Please enter a valid original price");
                return;
            }
        }
        setStep(step + 1);
    };

    const totalSteps = 4;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <header className="mb-6">
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="flex items-center text-indigo-600 mb-4 hover:text-indigo-700"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back
                    </button>
                )}
                <h2 className="text-2xl font-bold text-gray-900">{initialData ? "Edit Offer" : "Create Offer"}</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Step {step} of {totalSteps}
                </p>
            </header>

            {/* Progress bar */}
            <div className="mb-6 flex gap-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${i < step ? "bg-indigo-600" : "bg-gray-200"
                            }`}
                    />
                ))}
            </div>

            {/* Step 1: Basic Details */}
            {step === 1 && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Offer Title</label>
                        <input
                            value={offerData.title}
                            onChange={(e) => updateData({ title: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            placeholder="e.g. 50% Off Coffee"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description <span className="text-xs text-gray-500">(Max 50 words)</span>
                        </label>
                        <textarea
                            value={offerData.description}
                            onChange={(e) => {
                                const words = e.target.value.split(/\s+/).filter(Boolean);
                                if (words.length <= 50) {
                                    updateData({ description: e.target.value });
                                }
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            rows={3}
                            placeholder="Describe your offer..."
                        />
                        <p className="text-xs text-right text-gray-500 mt-1">
                            {offerData.description.split(/\s+/).filter(Boolean).length}/50 words
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Offer Image</label>
                        <div className="mt-1 flex items-center gap-4">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                {offerData.imageUrl ? (
                                    <img src={offerData.imageUrl} alt="Offer" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="text-center p-2">
                                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                        <span className="text-xs text-gray-500">Upload</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <div className="text-sm text-gray-500">
                                <p>Tap to upload an image.</p>
                                <p className="text-xs mt-1">JPG, PNG up to 5MB</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Type</label>
                        <select
                            value={offerData.productType}
                            onChange={(e) => updateData({ productType: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
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
                        <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            {(["percent", "fixed"] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => updateData({ discountType: type })}
                                    className={`rounded-md px-4 py-3 text-sm font-medium border ${offerData.discountType === type
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {type === "percent" ? "% Percentage Off" : "$ Fixed Amount Off"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {offerData.discountType === "percent" ? "Percentage %" : "Amount $"}
                            </label>
                            <input
                                type="number"
                                value={offerData.value}
                                onChange={(e) => updateData({ value: Number(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            />
                        </div>
                        {offerData.discountType === "percent" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Original Price $</label>
                                <input
                                    type="number"
                                    value={offerData.originalPrice || ""}
                                    onChange={(e) => updateData({ originalPrice: Number(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                    placeholder="0.00"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Inventory (slots)</label>
                        <input
                            type="number"
                            value={offerData.inventory}
                            onChange={(e) => updateData({ inventory: Number(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>
                </div>
            )}

            {/* Step 3: Duration */}
            {step === 3 && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={offerData.duration}
                            onChange={(e) => updateData({ duration: Number(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Can be decimal (e.g. 0.5 for 30 mins)
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location Radius (meters)</label>
                        <input
                            type="range"
                            min="100"
                            max="5000"
                            step="100"
                            value={offerData.radiusMeters}
                            onChange={(e) => updateData({ radiusMeters: Number(e.target.value) })}
                            className="mt-1 block w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>100m</span>
                            <span className="font-medium text-indigo-600">{offerData.radiusMeters}m</span>
                            <span>5000m (Max)</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
                <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h3 className="font-semibold mb-4 text-gray-900">Review Your Offer</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Title:</span>
                                <span className="font-medium text-gray-900">{offerData.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount:</span>
                                <span className="font-medium text-gray-900">
                                    {offerData.discountType === "percent"
                                        ? `${offerData.value}%`
                                        : `$${offerData.value}`}
                                </span>
                            </div>
                            {offerData.originalPrice && (
                                <div className="flex justify-between">
                                    <span>Original Price:</span>
                                    <span className="font-medium text-gray-900">${offerData.originalPrice}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Duration:</span>
                                <span className="font-medium text-gray-900">{offerData.duration} hours</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Radius:</span>
                                <span className="font-medium text-gray-900">{offerData.radiusMeters}m</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Inventory:</span>
                                <span className="font-medium text-gray-900">{offerData.inventory} slots</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex gap-3">
                {step < totalSteps ? (
                    <button
                        onClick={handleNext}
                        className="flex-1 flex items-center justify-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3"
                    >
                        Next
                        <ArrowRight className="h-5 w-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium py-3 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : initialData ? "Update Offer" : "Publish Offer"}
                        <Check className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
