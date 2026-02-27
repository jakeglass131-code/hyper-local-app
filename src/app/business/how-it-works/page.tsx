"use client";

import { Sparkles, Store, CheckCircle2, BellRing, Smartphone } from "lucide-react";
import { BusinessShell } from "@/components/website/BusinessShell";
import { WebsiteScrollReveal } from "@/components/website/WebsiteScrollReveal";
import { HowItWorksFlowDiagram } from "@/components/website/HowItWorksFlowDiagram";
import { RegisterButton } from "@/components/website/RegisterButton";

export default function BusinessHowItWorksPage() {
    return (
        <BusinessShell>
            <WebsiteScrollReveal>
                <section className="relative overflow-hidden rounded-3xl border border-[#d6e4dc] bg-gradient-to-br from-[#eaf4ef] to-white p-8 sm:p-12">
                    <div className="website-orb-fast absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#008A5E]/10 blur-3xl" />
                    <div className="relative z-10 max-w-3xl">
                        <p className="inline-flex items-center gap-2 rounded-full border border-[#d6e4dc] bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#008A5E]">
                            <Sparkles className="h-3.5 w-3.5" />
                            The Merchant Workflow
                        </p>
                        <h1 className="mt-4 text-4xl font-bold leading-tight text-[#1f2a2a] sm:text-5xl">
                            Your merchant operating loop,
                            <span className="text-[#008A5E]"> built to convert.</span>
                        </h1>
                        <p className="mt-4 max-w-2xl text-base text-[#4d5d58] sm:text-lg">
                            See exactly what your team does inside HyperLocal: create campaigns, auto-target nearby demand, verify redemptions at checkout, and optimize from live analytics.
                        </p>
                    </div>
                </section>
            </WebsiteScrollReveal>

            <WebsiteScrollReveal delayMs={100} className="mt-8">
                <div className="rounded-3xl border border-[#dfe5df] bg-white p-2">
                    <HowItWorksFlowDiagram audience="business" />
                </div>
            </WebsiteScrollReveal>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
                {[
                    {
                        title: "1. Configure",
                        body: "Build your campaign with inventory, timing, and radius controls in one screen.",
                        icon: <Store className="h-6 w-6" />
                    },
                    {
                        title: "2. Activate",
                        body: "HyperLocal distributes your offer automatically to qualified customers nearby.",
                        icon: <BellRing className="h-6 w-6" />
                    },
                    {
                        title: "3. Verify + Measure",
                        body: "Scan QR at checkout, complete secure redemption, and track conversion live.",
                        icon: <Smartphone className="h-6 w-6" />
                    }
                ].map((step, i) => (
                    <WebsiteScrollReveal key={i} delayMs={150 + (i * 50)} variant="pop">
                        <div className="rounded-2xl border border-[#dfe5df] bg-white p-8 group hover:border-[#008A5E]/30 transition-colors">
                            <div className="h-12 w-12 rounded-xl bg-[#008A5E]/10 text-[#008A5E] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-[#1f2a2a]">{step.title}</h3>
                            <p className="mt-2 text-[#5f6d68] leading-relaxed">{step.body}</p>
                        </div>
                    </WebsiteScrollReveal>
                ))}
            </div>

            <WebsiteScrollReveal delayMs={300} className="mt-12">
                <section className="rounded-3xl border border-[#008A5E]/20 bg-[#008A5E] p-8 md:p-12 text-white">
                    <div className="grid gap-12 lg:grid-cols-2 items-center">
                        <div>
                            <h2 className="text-3xl font-bold">Ready to join?</h2>
                            <p className="mt-4 text-white/80 text-lg">
                                Get your business on the map today and start seeing foot traffic immediately.
                            </p>
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="font-semibold">Real-time district intelligence</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="font-semibold">Hyper-local customer targeting</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="font-semibold">Verified walk-in attribution</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-[#dfe5df] p-8 shadow-xl shadow-[#008A5E]/5 text-[#1f2a2a]">
                            <h3 className="text-xl font-bold mb-6">Create Merchant Account</h3>
                            <RegisterButton
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#008A5E] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#008A5E]/20 hover:scale-105 transition-transform"
                            >
                                <Store className="h-4 w-4" />
                                Register
                            </RegisterButton>
                            <p className="mt-4 text-center text-xs text-[#5f6d68]">
                                By signing up, you agree to our Terms of Service.
                            </p>
                        </div>
                    </div>
                </section>
            </WebsiteScrollReveal>

        </BusinessShell>
    );
}
