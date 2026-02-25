"use client";

import { Check, Sparkles, Building2, Store, Smartphone } from "lucide-react";
import { BusinessShell } from "@/components/website/BusinessShell";
import { WebsiteScrollReveal } from "@/components/website/WebsiteScrollReveal";
import { RegisterButton } from "@/components/website/RegisterButton";
import { cn } from "@/lib/utils";

import { businessTiers as tiers } from "@/lib/business-tiers";

export default function SubscriptionsPage() {
    return (
        <BusinessShell>
            <WebsiteScrollReveal>
                <section className="relative overflow-hidden rounded-3xl border border-[#d6e4dc] bg-gradient-to-br from-[#eef2ff] to-white p-8 sm:p-12 text-center">
                    <div className="website-orb-fast absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#3744D2]/10 blur-3xl" />
                    <div className="website-orb-slow absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-amber-200/10 blur-3xl" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <p className="inline-flex items-center gap-2 rounded-full border border-[#d6e4dc] bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#3744D2]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Growth Architecture
                        </p>
                        <h1 className="mt-6 text-4xl font-black tracking-tighter text-[#1f2a2a] sm:text-6xl">
                            Scalable plans for
                            <span className="text-[#3744D2]"> local dominance.</span>
                        </h1>
                        <p className="mt-4 text-lg text-[#4d5d58]">
                            Choose the tier that matches your business velocity. From hyper-local testing to district-wide leadership.
                        </p>
                    </div>
                </section>
            </WebsiteScrollReveal>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
                {tiers.map((tier, i) => (
                    <WebsiteScrollReveal key={tier.name} delayMs={100 * i}>
                        <div className={cn(
                            "relative flex flex-col h-full rounded-[2.5rem] border bg-white p-8 transition-all hover:shadow-2xl hover:scale-[1.02]",
                            tier.popular ? "border-[#3744D2] shadow-xl shadow-[#3744D2]/5" : "border-[#dfe5df]"
                        )}>
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3744D2] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                                    Most Popular Choice
                                </div>
                            )}

                            <div className="mb-8 items-start justify-between flex">
                                <div className={cn("p-4 rounded-2xl flex items-center justify-center border", tier.color)}>
                                    <tier.icon className="h-8 w-8" />
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-[#1f2a2a] leading-none mb-1">{tier.price}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#4d5d58]">{tier.duration}</p>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-[#1f2a2a] tracking-tight">{tier.name}</h3>
                            <p className="mt-2 text-sm text-[#4d5d58] leading-relaxed">
                                {tier.description}
                            </p>

                            <div className="my-8 h-px bg-[#dfe5df]/50 w-full" />

                            <div className="flex-1 space-y-4">
                                {tier.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className={cn("mt-1 rounded-full p-0.5", tier.popular ? "bg-[#3744D2]/10" : "bg-slate-100")}>
                                            <Check className={cn("h-3 w-3", tier.popular ? "text-[#3744D2]" : "text-slate-400")} strokeWidth={3} />
                                        </div>
                                        <span className="text-sm font-semibold text-[#1f2a2a]">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <RegisterButton
                                tierId={tier.id}
                                className={cn(
                                    "mt-10 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase tracking-widest transition-all",
                                    tier.popular
                                        ? "bg-[#3744D2] text-white shadow-xl shadow-[#3744D2]/25 hover:brightness-110"
                                        : "bg-white border border-[#dfe5df] text-[#1f2a2a] hover:bg-slate-50"
                                )}
                            >
                                {tier.cta}
                            </RegisterButton>
                        </div>
                    </WebsiteScrollReveal>
                ))}
            </div>

            <WebsiteScrollReveal delayMs={400} className="mt-20">
                <section className="rounded-[3rem] border border-[#3744D2]/20 bg-[#3744D2] p-8 md:p-16 text-white text-center">
                    <h2 className="text-3xl font-black tracking-tight md:text-5xl">Scale without the guesswork.</h2>
                    <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
                        Join 2,400+ merchants who use HyperLocal to identify hidden local demand and convert walking traffic into loyal customers.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-3">
                            <Building2 className="h-6 w-6 text-white/40" />
                            <span className="font-bold tracking-tight text-white/90">Multi-location Ready</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Smartphone className="h-6 w-6 text-white/40" />
                            <span className="font-bold tracking-tight text-white/90">Merchant App Included</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Store className="h-6 w-6 text-white/40" />
                            <span className="font-bold tracking-tight text-white/90">Hyper-local Targeting</span>
                        </div>
                    </div>
                </section>
            </WebsiteScrollReveal>
        </BusinessShell>
    );
}
