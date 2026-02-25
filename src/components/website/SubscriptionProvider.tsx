"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { X, Check, ArrowLeft } from "lucide-react";
import { businessTiers } from "@/lib/business-tiers";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SubscriptionContextType {
    openModal: (tierId?: string) => void;
    closeModal: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function useSubscriptionModal() {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error("useSubscriptionModal must be used within a SubscriptionProvider");
    }
    return context;
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
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

    const selectedTier = useMemo(
        () => businessTiers.find((tier) => tier.id === selectedTierId) ?? null,
        [selectedTierId]
    );

    const resetState = () => {
        setSelectedTierId(null);
        setShowPassword(false);
        setFormValues({
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
    };

    const openModal = (tierId?: string) => {
        setIsOpen(true);
        setSelectedTierId(tierId ?? null);
    };

    const closeModal = () => {
        setIsOpen(false);
        resetState();
    };

    const handleTierSelection = (tierId: string) => {
        setSelectedTierId(tierId);
    };

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

        closeModal();
        router.push(`${destination.pathname}${destination.search}`);
    };

    return (
        <SubscriptionContext.Provider value={{ openModal, closeModal }}>
            {children}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={cn(
                                "relative w-full max-h-[90vh] overflow-hidden shadow-2xl",
                                selectedTier
                                    ? "max-w-2xl rounded-[2.5rem] border border-white/10 bg-[#04070f]"
                                    : "max-w-5xl rounded-[3rem] bg-[#fcfdff] p-6 md:p-12"
                            )}
                        >
                            <button
                                onClick={closeModal}
                                className={cn(
                                    "absolute z-20 right-5 top-5 rounded-full p-2 transition-colors",
                                    selectedTier
                                        ? "text-white/70 hover:bg-white/10 hover:text-white"
                                        : "text-gray-400 hover:bg-gray-100"
                                )}
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <AnimatePresence mode="wait" initial={false}>
                                {!selectedTier ? (
                                    <motion.div
                                        key="tier-selection"
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                    >
                                        <div className="text-center mb-10">
                                            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#1f2a2a]">
                                                Select your <span className="text-[#3744D2]">Growth Plan.</span>
                                            </h2>
                                            <p className="mt-4 text-gray-500 font-medium">
                                                Choose a tier, then create your merchant account.
                                            </p>
                                        </div>

                                        <div className="grid gap-6 lg:grid-cols-3">
                                            {businessTiers.map((tier) => (
                                                <div
                                                    key={tier.id}
                                                    className={cn(
                                                        "relative flex flex-col rounded-[2.5rem] border bg-white p-6 transition-all hover:shadow-xl",
                                                        tier.popular ? "border-[#3744D2] shadow-lg" : "border-gray-200"
                                                    )}
                                                >
                                                    {tier.popular && (
                                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3744D2] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                                                            Recommended
                                                        </div>
                                                    )}

                                                    <div className="mb-6 flex items-start justify-between">
                                                        <div className={cn("p-3 rounded-xl border", tier.color)}>
                                                            <tier.icon className="h-6 w-6" />
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-black text-[#1f2a2a] leading-none">{tier.price}</p>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{tier.duration}</p>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-xl font-black text-[#1f2a2a]">{tier.name}</h3>
                                                    <p className="mt-2 text-xs text-gray-500 font-medium leading-relaxed">
                                                        {tier.description}
                                                    </p>

                                                    <div className="my-6 h-px bg-gray-100" />

                                                    <div className="flex-1 space-y-3">
                                                        {tier.features.slice(0, 5).map((feature) => (
                                                            <div key={feature} className="flex items-start gap-2">
                                                                <div className={cn("mt-1 rounded-full p-0.5", tier.popular ? "bg-[#3744D2]/10" : "bg-gray-100")}>
                                                                    <Check className={cn("h-2.5 w-2.5", tier.popular ? "text-[#3744D2]" : "text-gray-400")} strokeWidth={3} />
                                                                </div>
                                                                <span className="text-xs font-semibold text-[#1f2a2a]">{feature}</span>
                                                            </div>
                                                        ))}
                                                        {tier.features.length > 5 && (
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-6">
                                                                + {tier.features.length - 5} more features
                                                            </p>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleTierSelection(tier.id)}
                                                        className={cn(
                                                            "mt-8 flex w-full items-center justify-center rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                                                            tier.popular
                                                                ? "bg-[#3744D2] text-white shadow-lg shadow-[#3744D2]/20 hover:brightness-110"
                                                                : "bg-white border border-gray-200 text-[#1f2a2a] hover:bg-gray-50"
                                                        )}
                                                    >
                                                        {tier.cta}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="signup-step"
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        className="relative min-h-[640px] p-6 sm:p-8"
                                    >
                                        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.25rem]">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(55,68,210,0.3),transparent_45%),radial-gradient(circle_at_80%_90%,rgba(0,170,124,0.15),transparent_30%),linear-gradient(160deg,#04070f_0%,#07101f_45%,#0a1018_100%)]" />
                                            <motion.div
                                                className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-[#3744D2]/25 blur-3xl"
                                                animate={{ x: [0, 28, -12, 0], y: [0, 16, -18, 0], scale: [1, 1.12, 0.92, 1] }}
                                                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                            <motion.div
                                                className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#00aa7c]/18 blur-3xl"
                                                animate={{ x: [0, -22, 14, 0], y: [0, -18, 10, 0], scale: [1, 0.92, 1.1, 1] }}
                                                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                            <motion.div
                                                className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
                                                animate={{ opacity: [0.2, 0.45, 0.2], scale: [0.85, 1.15, 0.9] }}
                                                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                        </div>

                                        <div className="relative z-10 mx-auto max-w-xl">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedTierId(null)}
                                                className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 hover:bg-white/10"
                                            >
                                                <ArrowLeft className="h-3.5 w-3.5" />
                                                Back to Plans
                                            </button>

                                            <div className="rounded-[2rem] border border-white/10 bg-[#040913]/75 p-5 sm:p-7 backdrop-blur-xl">
                                                <div className="mb-5 text-center">
                                                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">Merchant Signup</p>
                                                    <h3 className="mt-2 text-3xl font-black tracking-tight text-white">Create Your Account</h3>
                                                    <p className="mt-2 text-sm text-white/70">
                                                        Selected plan: <span className="font-semibold text-white">{selectedTier.name}</span> ({selectedTier.price})
                                                    </p>
                                                </div>

                                                <form onSubmit={handleSignupSubmit} className="space-y-3">
                                                    <InputField
                                                        label="Business Name"
                                                        value={formValues.businessName}
                                                        onChange={(value) => handleFormChange("businessName", value)}
                                                        placeholder="Main Street Coffee"
                                                        required
                                                    />
                                                    <InputField
                                                        label="Contact Name"
                                                        value={formValues.contactName}
                                                        onChange={(value) => handleFormChange("contactName", value)}
                                                        placeholder="Owner or manager"
                                                        required
                                                    />

                                                    <div className="grid gap-3 sm:grid-cols-2">
                                                        <InputField
                                                            label="Business Email"
                                                            value={formValues.email}
                                                            onChange={(value) => handleFormChange("email", value)}
                                                            placeholder="you@business.com"
                                                            type="email"
                                                            required
                                                        />
                                                        <InputField
                                                            label="Phone Number"
                                                            value={formValues.phone}
                                                            onChange={(value) => handleFormChange("phone", value)}
                                                            placeholder="+61 4XX XXX XXX"
                                                            type="tel"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/60">
                                                            Password
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                value={formValues.password}
                                                                onChange={(event) => handleFormChange("password", event.target.value)}
                                                                type={showPassword ? "text" : "password"}
                                                                className="h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-white placeholder:text-white/45 focus:border-[#3744D2] focus:bg-white/10 focus:outline-none"
                                                                placeholder="Create password"
                                                                minLength={8}
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword((prev) => !prev)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/70 hover:text-white"
                                                            >
                                                                {showPassword ? "Hide" : "Show"}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <InputField
                                                        label="Street Address"
                                                        value={formValues.addressLine1}
                                                        onChange={(value) => handleFormChange("addressLine1", value)}
                                                        placeholder="123 Queen Street"
                                                        required
                                                    />

                                                    <div className="grid gap-3 sm:grid-cols-3">
                                                        <InputField
                                                            label="Suburb"
                                                            value={formValues.suburb}
                                                            onChange={(value) => handleFormChange("suburb", value)}
                                                            placeholder="Sydney"
                                                            required
                                                        />
                                                        <InputField
                                                            label="State"
                                                            value={formValues.state}
                                                            onChange={(value) => handleFormChange("state", value)}
                                                            placeholder="NSW"
                                                            required
                                                        />
                                                        <InputField
                                                            label="Postcode"
                                                            value={formValues.postcode}
                                                            onChange={(value) => handleFormChange("postcode", value)}
                                                            placeholder="2000"
                                                            inputMode="numeric"
                                                            required
                                                        />
                                                    </div>

                                                    <p className="pt-1 text-center text-xs text-white/50">
                                                        By continuing, you agree to Terms and Privacy Policy.
                                                    </p>

                                                    <button
                                                        type="submit"
                                                        className="mt-2 h-12 w-full rounded-2xl bg-white text-sm font-black uppercase tracking-wide text-[#0c1424] transition-all hover:brightness-95"
                                                    >
                                                        Continue to Onboarding
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </SubscriptionContext.Provider>
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
        <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/60">{label}</label>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                type={type}
                required={required}
                inputMode={inputMode}
                placeholder={placeholder}
                className="h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-white placeholder:text-white/45 focus:border-[#3744D2] focus:bg-white/10 focus:outline-none"
            />
        </div>
    );
}
