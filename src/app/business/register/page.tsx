"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, ArrowLeft, Building2, ShieldCheck, Zap, Crown } from "lucide-react";
import { businessTiers } from "@/lib/business-tiers";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AuthShell } from "@/components/auth/AuthShell";

function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planFromUrl = searchParams.get("plan");

    const [selectedTierId, setSelectedTierId] = useState<string | null>(planFromUrl);
    const [showPassword, setShowPassword] = useState(false);
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
        businessName: "",
        contactName: "",
        phone: "",
        addressLine1: "",
        suburb: "",
        state: "",
        postcode: "",
    });

    useEffect(() => {
        if (planFromUrl) {
            setSelectedTierId(planFromUrl);
        }
    }, [planFromUrl]);

    const selectedTier = useMemo(
        () => businessTiers.find((tier) => tier.id === selectedTierId) ?? null,
        [selectedTierId]
    );

    const handleFormChange = (field: keyof typeof formValues, value: string) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSignupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedTier) return;

        if (typeof window !== "undefined") {
            const { password, ...safeDraft } = formValues;
            window.sessionStorage.setItem(
                "merchant-signup-draft",
                JSON.stringify({
                    ...safeDraft,
                    plan: selectedTier.id,
                    planName: selectedTier.name,
                })
            );
        }

        const destination = new URL(selectedTier.href, "https://hyperlocal.local");
        destination.searchParams.set("plan", selectedTier.id);

        router.push(`${destination.pathname}${destination.search}`);
    };

    return (
        <AnimatePresence mode="wait">
            {!selectedTier ? (
                <motion.div
                    key="tier-selection"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white italic">
                            Select your <span className="text-[#008A5E]">Growth Plan</span>
                        </h1>
                        <p className="mt-4 text-sm text-white/50 font-medium">
                            Choose the velocity that matches your district.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {businessTiers.map((tier) => (
                            <button
                                key={tier.id}
                                onClick={() => setSelectedTierId(tier.id)}
                                className={cn(
                                    "group relative flex items-center justify-between rounded-[2rem] border p-6 transition-all hover:scale-[1.02] active:scale-[0.98]",
                                    tier.popular
                                        ? "border-[#008A5E]/40 bg-[#008A5E]/10"
                                        : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15]"
                                )}
                            >
                                <div className="flex items-center gap-6 text-left">
                                    <div className={cn("p-4 rounded-2xl flex items-center justify-center bg-black/40 border border-white/5 shadow-2xl group-hover:scale-110 transition-transform", tier.accent)}>
                                        <tier.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white tracking-tight">{tier.name}</h3>
                                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">{tier.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-white leading-none mb-1">{tier.price}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{tier.duration}</p>
                                </div>
                                {tier.popular && (
                                    <div className="absolute -top-3 right-6 bg-[#008A5E] text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">
                                        Popular
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="signup-step"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full"
                >
                    <div className="mb-10 flex flex-col items-center">
                        <button
                            onClick={() => setSelectedTierId(null)}
                            className="mb-8 inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            Back to plans
                        </button>

                        <div className="text-center">
                            <h3 className="text-3xl font-black text-white tracking-tight italic">Finalizing setup</h3>
                            <p className="mt-2 text-sm text-white/50 font-medium">Unlocked: <span className="text-[#008A5E] font-black">{selectedTier.name} Perks</span></p>
                        </div>
                    </div>

                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                        <InputField
                            label="Business Name"
                            value={formValues.businessName}
                            onChange={(value) => handleFormChange("businessName", value)}
                            placeholder="Main Street Coffee"
                            required
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <InputField
                                label="Contact Name"
                                value={formValues.contactName}
                                onChange={(value) => handleFormChange("contactName", value)}
                                placeholder="Owner/Manager"
                                required
                            />
                            <InputField
                                label="Phone"
                                value={formValues.phone}
                                onChange={(value) => handleFormChange("phone", value)}
                                placeholder="+61 4XX XXX XXX"
                                type="tel"
                                required
                            />
                        </div>

                        <InputField
                            label="Work Email"
                            value={formValues.email}
                            onChange={(value) => handleFormChange("email", value)}
                            placeholder="office@business.com"
                            type="email"
                            required
                        />

                        <div>
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <input
                                    value={formValues.password}
                                    onChange={(event) => handleFormChange("password", event.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 text-sm font-medium text-white placeholder:text-white/20 focus:border-[#008A5E]/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-[#008A5E]/10 focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    minLength={8}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-[#008A5E] hover:text-white transition-colors"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative mt-8 h-14 w-full overflow-hidden rounded-2xl bg-white text-sm font-black uppercase tracking-[0.2em] text-black shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Complete & Register
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function InputField({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    required,
    inputMode,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: React.HTMLInputTypeAttribute;
    required?: boolean;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">{label}</label>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                type={type}
                required={required}
                inputMode={inputMode}
                placeholder={placeholder}
                className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 text-sm font-medium text-white placeholder:text-white/20 focus:border-[#008A5E]/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-[#008A5E]/10 focus:outline-none transition-all"
            />
        </div>
    );
}

export default function RegisterPage() {
    return (
        <AuthShell role="merchant">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/20">Loading...</div>}>
                <RegisterContent />
            </Suspense>
        </AuthShell>
    );
}
