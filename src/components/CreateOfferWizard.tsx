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
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/5 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />

            <header className="mb-8 relative z-10">
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="flex items-center text-gray-400 mb-6 hover:text-gray-900 transition-colors group"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Back</span>
                    </button>
                )}
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-1">Campaign Architect</p>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{initialData ? "Update Offer" : "New Offer"}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Step</p>
                        <p className="text-xl font-black text-gray-900 leading-none">{step}<span className="text-gray-300">/{totalSteps}</span></p>
                    </div>
                </div>
            </header>


            {/* Progress bar */}
            <div className="mb-10 flex gap-2 relative z-10">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < step ? "bg-brand shadow-[0_0_10px_rgba(124,58,237,0.5)]" : "bg-white/5"
                            }`}
                    />
                ))}
            </div>

            {/* Step 1: Basic Details */}
            {step === 1 && (
                <div className="space-y-8 relative z-10">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Offer Title</label>
                        <input
                            value={offerData.title}
                            onChange={(e) => updateData({ title: e.target.value })}
                            className="bg-gray-50 border border-gray-200 rounded-2xl w-full px-5 py-4 text-gray-900 font-bold outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-all placeholder:text-gray-300"
                            placeholder="e.g. ULTIMATE CAFFEINE BOOST"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                            Strategy Brief <span className="text-gray-300 capitalize font-bold ml-2">(Limit: 50 words)</span>
                        </label>
                        <textarea
                            value={offerData.description}
                            onChange={(e) => {
                                const words = e.target.value.split(/\s+/).filter(Boolean);
                                if (words.length <= 50) {
                                    updateData({ description: e.target.value });
                                }
                            }}
                            className="bg-gray-50 border border-gray-200 rounded-2xl w-full px-5 py-4 text-gray-900 font-bold outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-all placeholder:text-gray-300 min-h-[120px]"
                            placeholder="Describe the tactical advantage..."
                        />
                        <p className="text-[10px] text-right text-gray-300 mt-2 font-black uppercase tracking-widest">
                            {offerData.description.split(/\s+/).filter(Boolean).length} / 50 words
                        </p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Visual asset</label>
                        <div className="flex items-center gap-6">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="h-32 w-32 rounded-3xl bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer hover:bg-gray-100 hover:border-brand/50 transition-all group shrink-0"
                            >
                                {offerData.imageUrl ? (
                                    <img src={offerData.imageUrl} alt="Offer" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="text-center p-2">
                                        <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2 group-hover:text-brand transition-colors" />
                                        <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Upload</span>
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
                            <div className="text-[10px] text-gray-400 font-bold leading-relaxed">
                                <p className="text-gray-600 mb-1">PRO-VISUAL REQUIREMENT</p>
                                <p>Optimal scaling for HD displays.</p>
                                <p>HEIC, JPG, PNG — MAX 5MB</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Sector Classification</label>
                        <select
                            value={offerData.productType}
                            onChange={(e) => updateData({ productType: e.target.value })}
                            className="bg-gray-50 border border-gray-200 rounded-2xl w-full px-5 py-4 text-gray-900 font-bold outline-none focus:border-brand transition-all appearance-none cursor-pointer"
                        >
                            <option value="food">Gastronomy & Libations</option>
                            <option value="retail">Commodity Exchange</option>
                            <option value="service">Elite Infrastructure</option>
                            <option value="entertainment">Sensory Experience</option>
                        </select>
                    </div>

                </div>
            )}

            {/* Step 2: Discount Details */}
            {step === 2 && (
                <div className="space-y-10 relative z-10">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Incentive Architecture</label>
                        <div className="grid grid-cols-2 gap-4">
                            {(["percent", "fixed"] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => updateData({ discountType: type })}
                                    className={`rounded-2xl px-6 py-5 text-xs font-black transition-all border uppercase tracking-widest ${offerData.discountType === type
                                        ? "bg-brand text-white border-brand shadow-lg shadow-brand/20"
                                        : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                >
                                    {type === "percent" ? "Percentage Off" : "Cash Reduction"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                {offerData.discountType === "percent" ? "Ratio %" : "Amount $"}
                            </label>
                            <input
                                type="number"
                                value={offerData.value}
                                onChange={(e) => updateData({ value: Number(e.target.value) })}
                                className="bg-gray-50 border border-gray-200 rounded-2xl w-full px-5 py-4 text-gray-900 font-bold outline-none focus:border-brand transition-all"
                            />
                        </div>
                        {offerData.discountType === "percent" && (
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Baseline Price $</label>
                                <input
                                    type="number"
                                    value={offerData.originalPrice || ""}
                                    onChange={(e) => updateData({ originalPrice: Number(e.target.value) })}
                                    className="bg-gray-50 border border-gray-200 rounded-2xl w-full px-5 py-4 text-gray-900 font-bold outline-none focus:border-brand transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Scarcity Engine (slots)</label>
                        <input
                            type="number"
                            value={offerData.inventory}
                            onChange={(e) => updateData({ inventory: Number(e.target.value) })}
                            className="bg-gray-50 border border-gray-200 rounded-2xl w-full px-5 py-4 text-gray-900 font-bold outline-none focus:border-brand transition-all"
                        />
                    </div>
                </div>
            )}

            {/* Step 3: Duration */}
            {step === 3 && (
                <div className="space-y-10 relative z-10">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Temporal Window (hours)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={offerData.duration}
                            onChange={(e) => updateData({ duration: Number(e.target.value) })}
                            className="bg-gray-50 border border-gray-200 rounded-2xl w-full px-5 py-4 text-gray-900 font-bold outline-none focus:border-brand transition-all"
                        />
                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                            Precision Input: 0.5 = 30-min tactical window
                        </p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Geofence Radius (meters)</label>
                        <div className="px-2">
                            <input
                                type="range"
                                min="100"
                                max="5000"
                                step="100"
                                value={offerData.radiusMeters}
                                onChange={(e) => updateData({ radiusMeters: Number(e.target.value) })}
                                className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-brand"
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-gray-400 mt-4 uppercase tracking-[0.2em]">
                            <span>100m (Hyper-Local)</span>
                            <span className="text-brand text-xs tracking-widest">{offerData.radiusMeters}M RADAR</span>
                            <span>5000m (District)</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
                <div className="space-y-8 relative z-10">
                    <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 shadow-inner overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Check size={80} className="text-brand" />
                        </div>
                        <h3 className="text-[10px] font-black text-brand mb-8 uppercase tracking-[0.3em]">Deployment Preview</h3>
                        <div className="grid gap-6">
                            {[
                                { label: "Campaign Identity", value: offerData.title },
                                { label: "Incentive Value", value: offerData.discountType === "percent" ? `${offerData.value}%` : `$${offerData.value}`, color: "text-brand" },
                                { label: "Temporal Span", value: `${offerData.duration} HOURS` },
                                { label: "Operational Radius", value: `${offerData.radiusMeters}M` },
                                { label: "Unit Scarcity", value: `${offerData.inventory} NODES` }
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                                    <span className={`text-sm font-black uppercase tracking-tight ${item.color || "text-gray-900"}`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            {/* Navigation */}
            <div className="mt-12 flex gap-4 relative z-10">
                {step < totalSteps ? (
                    <button
                        onClick={handleNext}
                        className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-brand hover:brightness-110 text-white font-black py-5 uppercase tracking-widest shadow-xl shadow-brand/20 active:scale-95 transition-all text-sm"
                    >
                        Forward
                        <ArrowRight className="h-5 w-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-accent hover:brightness-110 text-white font-black py-5 uppercase tracking-widest shadow-xl shadow-accent/20 active:scale-95 transition-all disabled:opacity-50 text-sm"
                    >
                        {loading ? "Transmitting..." : initialData ? "Confirm Update" : "Initiate Deployment"}
                        <Check className="h-5 w-5" />
                    </button>
                )}

            </div>
        </div>
    );
}
