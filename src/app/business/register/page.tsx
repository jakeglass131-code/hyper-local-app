"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { businessTiers } from "@/lib/business-tiers";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AuthShell } from "@/components/auth/AuthShell";
import { createPortal } from "react-dom";

type FlowStep = "tier-selection" | "signup" | "checkout";
type BillingCycle = "monthly" | "yearly";

function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planFromUrl = searchParams.get("plan");

    const [selectedTierId, setSelectedTierId] = useState<string | null>(planFromUrl);
    const [step, setStep] = useState<FlowStep>(planFromUrl ? "signup" : "tier-selection");
    const [showPassword, setShowPassword] = useState(false);
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
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
    const [checkoutValues, setCheckoutValues] = useState({
        billingEmail: "",
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
        coupon: "",
    });

    const selectedTier = useMemo(
        () => businessTiers.find((tier) => tier.id === selectedTierId) ?? null,
        [selectedTierId]
    );
    const portalReady = typeof document !== "undefined";

    const baseMonthlyPrice = useMemo(() => getNumericPrice(selectedTier?.price ?? "$0"), [selectedTier?.price]);
    const yearlyPrice = useMemo(() => baseMonthlyPrice * 12 * 0.8, [baseMonthlyPrice]);
    const selectedPrice = billingCycle === "monthly" ? baseMonthlyPrice : yearlyPrice;
    const isFreeTier = selectedTier?.id === "free";
    const mobileShippingAddress =
        [formValues.addressLine1, formValues.suburb, formValues.state, formValues.postcode]
            .filter(Boolean)
            .join(", ") || "Add your business address";
    const mobileMaskedCard = checkoutValues.cardNumber
        ? `•••• ${checkoutValues.cardNumber.replace(/\s/g, "").slice(-4)}`
        : "Add card details";
    const renewalDate = useMemo(
        () => (isFreeTier ? getDateAfterDaysLabel(14) : getRenewalDateLabel(billingCycle)),
        [billingCycle, isFreeTier]
    );
    const requiresPayment = !isFreeTier && selectedPrice > 0;
    const checkoutReady = !requiresPayment || (
        checkoutValues.billingEmail.trim() &&
        checkoutValues.cardName.trim() &&
        checkoutValues.cardNumber.replace(/\s/g, "").length >= 16 &&
        checkoutValues.expiry.length === 5 &&
        checkoutValues.cvv.length >= 3
    );

    const handleFormChange = (field: keyof typeof formValues, value: string) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleCheckoutChange = (field: keyof typeof checkoutValues, value: string) => {
        setCheckoutValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSignupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedTier) return;

        setCheckoutValues((prev) => ({
            ...prev,
            billingEmail: prev.billingEmail || formValues.email,
        }));
        setStep("checkout");
    };

    const handleCheckoutSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedTier || !checkoutReady) return;

        if (typeof window !== "undefined") {
            const safeDraft = {
                email: formValues.email,
                businessName: formValues.businessName,
                contactName: formValues.contactName,
                phone: formValues.phone,
                addressLine1: formValues.addressLine1,
                suburb: formValues.suburb,
                state: formValues.state,
                postcode: formValues.postcode,
            };
            window.sessionStorage.setItem(
                "merchant-signup-draft",
                JSON.stringify({
                    ...safeDraft,
                    plan: selectedTier.id,
                    planName: selectedTier.name,
                    billingCycle,
                    billingEmail: checkoutValues.billingEmail,
                })
            );
        }
        const destination = new URL(selectedTier.href, "https://hyperlocal.local");
        destination.searchParams.set("plan", selectedTier.id);
        destination.searchParams.set("billingCycle", billingCycle);

        router.push(`${destination.pathname}${destination.search}`);
    };

    return (
        <AnimatePresence mode="wait">
            {step === "tier-selection" || !selectedTier ? (
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
                                onClick={() => {
                                    setSelectedTierId(tier.id);
                                    setStep("signup");
                                    setBillingCycle("monthly");
                                }}
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
            ) : step === "signup" ? (
                <motion.div
                    key="signup-step"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full"
                >
                    <div className="mb-10 flex flex-col items-center">
                        <button
                            onClick={() => {
                                setSelectedTierId(null);
                                setStep("tier-selection");
                            }}
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
                                Continue to Checkout
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>
                    </form>
                </motion.div>
            ) : (
                portalReady ? createPortal((
                <motion.div
                    key="checkout-step"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="fixed inset-0 z-[200] overflow-y-auto bg-[#060607]"
                >
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(0,138,94,0.22),transparent_42%),radial-gradient(circle_at_85%_92%,rgba(55,68,210,0.16),transparent_35%),linear-gradient(155deg,#030608_0%,#070a11_46%,#05080f_100%)]" />
                        <motion.div
                            className="absolute -left-24 top-8 h-80 w-80 rounded-full bg-[#008A5E]/22 blur-3xl"
                            animate={{ x: [0, 26, -14, 0], y: [0, 20, -16, 0], scale: [1, 1.1, 0.92, 1] }}
                            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-[#3744D2]/16 blur-3xl"
                            animate={{ x: [0, -16, 24, 0], y: [0, -18, 10, 0], scale: [1, 0.94, 1.14, 1] }}
                            transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="relative z-10 mx-auto w-full max-w-[1440px] px-3 py-4 md:px-8 md:py-7">
                        <div className="overflow-hidden rounded-[2.1rem] border border-white/10 bg-black/95 p-4 md:p-8">
                            <header className="mb-5 flex items-center justify-between md:mb-10">
                                <button
                                    type="button"
                                    onClick={() => setStep("signup")}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </button>
                                <h3 className="text-2xl font-black tracking-tight text-white md:text-[2rem]">Hyper Local</h3>
                                <div className="w-[52px] md:w-[64px]" />
                            </header>

                            <div className="hidden gap-12 md:grid md:grid-cols-[1fr_370px] md:px-6">
                                <form onSubmit={handleCheckoutSubmit} className="max-w-[620px] space-y-9">
                                    <section className="space-y-3">
                                        <h4 className="text-[30px] font-black leading-tight tracking-tight text-white">Billing email address</h4>
                                        <input
                                            type="email"
                                            required
                                            value={checkoutValues.billingEmail}
                                            onChange={(event) => handleCheckoutChange("billingEmail", event.target.value)}
                                            placeholder="billing@business.com"
                                            className="h-12 w-full rounded-lg border border-white/25 bg-black px-4 text-base font-medium text-white placeholder:text-white/35 focus:border-[#3744D2] focus:outline-none"
                                        />
                                        <p className="text-sm text-white/55">We&apos;ll send all billing notices and receipts here.</p>
                                    </section>

                                    <section className="space-y-3">
                                        <h4 className="text-[30px] font-black leading-tight tracking-tight text-white">Choose your billing cycle</h4>
                                        {isFreeTier ? (
                                            <div className="rounded-xl border border-[#008A5E]/35 bg-[#008A5E]/10 px-4 py-3 text-sm text-white/90">
                                                Free Trial includes 14 days with no charge. You can upgrade to paid billing anytime.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4">
                                                <CycleOption
                                                    isActive={billingCycle === "monthly"}
                                                    label="Pay monthly"
                                                    detail={`$${baseMonthlyPrice.toFixed(2)} per month`}
                                                    onClick={() => setBillingCycle("monthly")}
                                                />
                                                <CycleOption
                                                    isActive={billingCycle === "yearly"}
                                                    label="Pay yearly"
                                                    detail={`$${(yearlyPrice / 12).toFixed(2)} per month`}
                                                    badge="-20%"
                                                    onClick={() => setBillingCycle("yearly")}
                                                />
                                            </div>
                                        )}
                                    </section>

                                    {requiresPayment ? (
                                        <section className="space-y-3">
                                            <h4 className="text-[30px] font-black leading-tight tracking-tight text-white">Your credit card details</h4>
                                            <CheckoutInput
                                                label="Name on card"
                                                value={checkoutValues.cardName}
                                                onChange={(value) => handleCheckoutChange("cardName", value)}
                                                placeholder="Cardholder name"
                                                required
                                            />
                                            <CheckoutInput
                                                label="Card number"
                                                value={checkoutValues.cardNumber}
                                                onChange={(value) => handleCheckoutChange("cardNumber", formatCardNumber(value))}
                                                placeholder="1234 1234 1234 1234"
                                                inputMode="numeric"
                                                required
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <CheckoutInput
                                                    label="Expiry"
                                                    value={checkoutValues.expiry}
                                                    onChange={(value) => handleCheckoutChange("expiry", formatExpiry(value))}
                                                    placeholder="MM/YY"
                                                    inputMode="numeric"
                                                    required
                                                />
                                                <CheckoutInput
                                                    label="CVV"
                                                    value={checkoutValues.cvv}
                                                    onChange={(value) => handleCheckoutChange("cvv", value.replace(/\D/g, "").slice(0, 4))}
                                                    placeholder="CVC"
                                                    inputMode="numeric"
                                                    required
                                                />
                                            </div>
                                        </section>
                                    ) : (
                                        <div className="rounded-xl border border-[#008A5E]/35 bg-[#008A5E]/10 px-4 py-3 text-sm text-white/90">
                                            Free trial selected. No card charge is required today.
                                        </div>
                                    )}

                                    <div className="pt-7">
                                        <p className="mb-4 text-center text-base text-white/55">
                                            {checkoutReady ? "Ready to continue" : "Your information is incomplete"}
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={!checkoutReady}
                                            className="h-12 w-full rounded-lg bg-gradient-to-r from-[#3744D2] to-[#8f2697] text-base font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Review order
                                        </button>
                                    </div>
                                </form>

                                <aside className="self-start rounded-xl border border-white/15 bg-[#0d0f14] p-0">
                                    <div className="h-1 rounded-t-xl bg-gradient-to-r from-[#3744D2] to-[#8f2697]" />
                                    <div className="p-4">
                                        <div className="mb-4 rounded-xl bg-[#252637] p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f0aa5d] text-[11px] font-black text-black">
                                                    {formValues.businessName.trim() ? formValues.businessName.trim().slice(0, 1).toUpperCase() : "H"}
                                                </div>
                                                <p className="text-sm font-bold text-white">
                                                    {formValues.businessName.trim() || "Your workspace"}{" "}
                                                    <span className="rounded-full bg-[#8f2697] px-2 py-0.5 text-[9px] font-black uppercase">PRO</span>
                                                </p>
                                            </div>
                                            <p className="mt-2 text-xs leading-relaxed text-white/65">
                                                Your full workspace will be upgraded. All team members can access paid features.
                                            </p>
                                        </div>

                                        <div className="space-y-1.5 pb-3 text-sm">
                                            <SummaryRow label="Price per member" value={isFreeTier ? "$0.00" : (billingCycle === "monthly" ? `$${baseMonthlyPrice.toFixed(2)} (Monthly)` : `$${(yearlyPrice / 12).toFixed(2)} / month`)} />
                                            <SummaryRow label="Members" value="1" />
                                            <SummaryRow label="Total" value={`$${selectedPrice.toFixed(2)}`} />
                                        </div>

                                        <div className="space-y-3 border-y border-white/10 py-3">
                                            <SummaryRow label="Next renewal" value={renewalDate} />
                                            <SummaryRow label="Tax" value="$0.00" />
                                        </div>

                                        <div className="mt-3 flex items-center gap-2">
                                            <input
                                                value={checkoutValues.coupon}
                                                onChange={(event) => handleCheckoutChange("coupon", event.target.value)}
                                                placeholder="Coupon"
                                                className="h-9 w-full rounded-lg border border-white/25 bg-transparent px-3 text-sm text-white placeholder:text-white/40 focus:border-[#3744D2] focus:outline-none"
                                            />
                                            <button type="button" className="h-9 rounded-lg bg-[#3744D2]/70 px-4 text-sm font-semibold text-white hover:bg-[#3744D2]">
                                                Apply
                                            </button>
                                        </div>

                                        <div className="mt-4 border-t border-white/10 pt-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-3xl font-black text-white">Due today</p>
                                                <p className="text-3xl font-black text-white">${selectedPrice.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>

                            <div className="md:hidden">
                                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 text-white/85">
                                    <h4 className="text-base font-black tracking-tight">Cart</h4>
                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-base font-semibold text-white">{selectedTier.name} subscription</p>
                                            <p className="text-sm text-white/60">{isFreeTier ? "14-day trial" : billingCycle === "monthly" ? "Monthly billing" : "Yearly billing"}</p>
                                        </div>
                                        <p className="text-2xl font-black text-white">${selectedPrice.toFixed(2)}</p>
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleCheckoutSubmit}
                                    className="mt-4 rounded-t-[2rem] bg-[#f2f3f5] p-4 text-[#121317] shadow-[0_-20px_60px_rgba(0,0,0,0.35)]"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <h4 className="text-[2rem] font-black leading-none tracking-tight">Checkout</h4>
                                        <button
                                            type="button"
                                            onClick={() => setStep("signup")}
                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-2xl leading-none"
                                            aria-label="Close checkout"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6a6d76]">Shipping Address</p>
                                            <p className="mt-2 text-base font-semibold">{mobileShippingAddress}</p>
                                        </div>

                                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6a6d76]">Payment method</p>
                                            <p className="mt-2 text-base font-semibold">{requiresPayment ? mobileMaskedCard : "No card required for trial"}</p>
                                        </div>

                                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                                            <CheckoutInput
                                                label="Billing email"
                                                value={checkoutValues.billingEmail}
                                                onChange={(value) => handleCheckoutChange("billingEmail", value)}
                                                placeholder="billing@business.com"
                                                required
                                                variant="light"
                                            />
                                            {!isFreeTier ? (
                                                <div className="mt-4 grid grid-cols-2 gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setBillingCycle("monthly")}
                                                        className={cn(
                                                            "rounded-xl border px-3 py-2 text-sm font-semibold",
                                                            billingCycle === "monthly"
                                                                ? "border-[#3744D2] bg-[#3744D2]/15 text-[#2834b8]"
                                                                : "border-black/10 text-[#2a2d34]"
                                                        )}
                                                    >
                                                        Monthly
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setBillingCycle("yearly")}
                                                        className={cn(
                                                            "rounded-xl border px-3 py-2 text-sm font-semibold",
                                                            billingCycle === "yearly"
                                                                ? "border-[#3744D2] bg-[#3744D2]/15 text-[#2834b8]"
                                                                : "border-black/10 text-[#2a2d34]"
                                                        )}
                                                    >
                                                        Yearly (-20%)
                                                    </button>
                                                </div>
                                            ) : null}

                                            {requiresPayment ? (
                                                <div className="mt-4 space-y-3">
                                                    <CheckoutInput
                                                        label="Name on card"
                                                        value={checkoutValues.cardName}
                                                        onChange={(value) => handleCheckoutChange("cardName", value)}
                                                        placeholder="Cardholder name"
                                                        required
                                                        variant="light"
                                                    />
                                                    <CheckoutInput
                                                        label="Card number"
                                                        value={checkoutValues.cardNumber}
                                                        onChange={(value) => handleCheckoutChange("cardNumber", formatCardNumber(value))}
                                                        placeholder="1234 1234 1234 1234"
                                                        inputMode="numeric"
                                                        required
                                                        variant="light"
                                                    />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <CheckoutInput
                                                            label="Expiry"
                                                            value={checkoutValues.expiry}
                                                            onChange={(value) => handleCheckoutChange("expiry", formatExpiry(value))}
                                                            placeholder="MM/YY"
                                                            inputMode="numeric"
                                                            required
                                                            variant="light"
                                                        />
                                                        <CheckoutInput
                                                            label="CVV"
                                                            value={checkoutValues.cvv}
                                                            onChange={(value) => handleCheckoutChange("cvv", value.replace(/\D/g, "").slice(0, 4))}
                                                            placeholder="CVC"
                                                            inputMode="numeric"
                                                            required
                                                            variant="light"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="mt-3 rounded-xl bg-[#008A5E]/10 px-3 py-2 text-sm font-medium text-[#0a6648]">
                                                    Trial selected. Payment details are not required.
                                                </p>
                                            )}
                                        </div>

                                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                                            <div className="flex gap-2">
                                                <input
                                                    value={checkoutValues.coupon}
                                                    onChange={(event) => handleCheckoutChange("coupon", event.target.value)}
                                                    placeholder="Have a promo code?"
                                                    className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-[#1c1d20] placeholder:text-[#888b94] focus:border-[#3744D2] focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    className="h-10 rounded-xl border border-black/10 px-4 text-sm font-semibold"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            <div className="mt-4 space-y-2 text-[1.05rem]">
                                                <div className="flex items-center justify-between text-[#62656d]">
                                                    <span>Subtotal</span>
                                                    <span>${selectedPrice.toFixed(2)}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-[#62656d]">
                                                    <span>Tax</span>
                                                    <span>$0.00</span>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 text-2xl font-black text-black">
                                                    <span>Grand Total</span>
                                                    <span>${selectedPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!checkoutReady}
                                        className="mt-4 h-12 w-full rounded-full bg-black text-lg font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Place Order - ${selectedPrice.toFixed(2)}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>
                ), document.body) : null
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

function CheckoutInput({
    label,
    value,
    onChange,
    placeholder,
    required,
    inputMode,
    variant = "dark",
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    required?: boolean;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    variant?: "dark" | "light";
}) {
    return (
        <div className="space-y-1.5">
            <label
                className={cn(
                    "block text-[11px] font-bold uppercase tracking-[0.18em]",
                    variant === "dark" ? "text-white/60" : "text-[#6a6d76]"
                )}
            >
                {label}
            </label>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                required={required}
                inputMode={inputMode}
                className={cn(
                    "h-11 w-full rounded-xl px-4 text-sm font-medium focus:outline-none",
                    variant === "dark"
                        ? "border border-white/15 bg-white/[0.04] text-white placeholder:text-white/35 focus:border-[#008A5E] focus:ring-2 focus:ring-[#008A5E]/25"
                        : "border border-black/10 bg-white text-[#1c1d20] placeholder:text-[#888b94] focus:border-[#3744D2]"
                )}
            />
        </div>
    );
}

function CycleOption({
    label,
    detail,
    isActive,
    onClick,
    badge,
}: {
    label: string;
    detail: string;
    isActive: boolean;
    onClick: () => void;
    badge?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "rounded-xl border px-4 py-3 text-left transition-all",
                isActive ? "border-[#3744D2] bg-[#3744D2]/25 shadow-lg shadow-[#3744D2]/20" : "border-white/15 bg-white/[0.03] hover:bg-white/[0.07]"
            )}
        >
            <div className="flex items-center gap-2">
                <div className={cn("h-3 w-3 rounded-full border", isActive ? "border-white bg-white" : "border-white/60")} />
                <p className="text-base font-black text-white">{label}</p>
                {badge ? <span className="rounded-full bg-[#7f38ff]/55 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">{badge}</span> : null}
            </div>
            <p className="mt-1 text-xs font-medium text-white/70">{detail}</p>
        </button>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <p className="text-white/70">{label}</p>
            <p className="font-semibold text-white">{value}</p>
        </div>
    );
}

function getNumericPrice(price: string) {
    const normalized = price.replace(/[^0-9.]/g, "");
    const parsed = Number.parseFloat(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
}

function formatCardNumber(rawValue: string) {
    const digits = rawValue.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(rawValue: string) {
    const digits = rawValue.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function getRenewalDateLabel(cycle: BillingCycle) {
    const next = new Date();
    next.setMonth(next.getMonth() + (cycle === "monthly" ? 1 : 12));
    return next.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getDateAfterDaysLabel(days: number) {
    const next = new Date();
    next.setDate(next.getDate() + days);
    return next.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
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
