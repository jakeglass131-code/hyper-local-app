"use client";

import Link from "next/link";
import { BarChart3, ChartNoAxesCombined, Layers3, ScanLine, Sparkles, Store, CheckCircle2 } from "lucide-react";
import { BusinessShell } from "@/components/website/BusinessShell";
import { WebsiteScrollReveal } from "@/components/website/WebsiteScrollReveal";
import { RegisterButton } from "@/components/website/RegisterButton";

const businessCapabilities = [
    {
        title: "Offer publishing",
        body: "Create and launch offers quickly with clear inventory controls.",
        icon: <Layers3 className="h-4 w-4" />,
    },
    {
        title: "Redemption control",
        body: "Use scanner flow for secure redemption and fraud protection.",
        icon: <ScanLine className="h-4 w-4" />,
    },
    {
        title: "Performance insight",
        body: "Track claims, redemptions, and repeat behavior by period.",
        icon: <BarChart3 className="h-4 w-4" />,
    },
];

const benefits = [
    "Zero upfront costs to list your first 5 offers",
    "Real-time inventory management",
    "AI-assisted campaign optimization",
    "Instant verification via QR scanner",
    "Automated customer loyalty tracking",
    "Hyper-local targeting within 500m"
];

export default function BusinessLandingPage() {
    return (
        <BusinessShell>
            <WebsiteScrollReveal>
                <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-[#eef7f3] via-white to-slate-50 p-8 sm:p-10">
                    <div className="website-orb-fast absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#008A5E]/10 blur-3xl" />
                    <div className="relative z-10 max-w-3xl">
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#008A5E]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Merchant Portal
                        </p>
                        <h1 className="mt-4 text-4xl font-bold leading-tight text-[#1f2a2a] sm:text-5xl">
                            Better local marketing, <br />
                            <span className="text-[#008A5E]">we handle the advertising for you.</span>
                        </h1>
                        <p className="mt-4 max-w-2xl text-base text-[#4d5d58] sm:text-lg">
                            Stop playing marketing manager. You create the offer, we do the heavy lifting by broadcasting it to every customer in your district.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/business/how-it-works" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-[#1f2a2a] hover:bg-gray-50 transition-colors">
                                How it works
                            </Link>
                        </div>
                    </div>
                </section>
            </WebsiteScrollReveal>

            {/* Benefits Section */}
            <WebsiteScrollReveal delayMs={80} className="mt-8">
                <section className="rounded-2xl border border-[#dfe5df] bg-white p-6 sm:p-10">
                    <div className="grid gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="text-3xl font-bold text-[#1f2a2a]">Why choose HyperLocal?</h2>
                            <p className="mt-4 text-[#4d5d58]">
                                Stop wasting money on broad ads. Reach the people standing right outside your door when you need them most.
                            </p>
                            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                {benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#008A5E]" />
                                        <span className="text-sm font-medium text-[#1f2a2a]">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <StatCard label="Offer setup" value="Under 2 min" icon={<Store className="h-4 w-4" />} />
                            <StatCard label="Redemption mode" value="Scanner" icon={<ScanLine className="h-4 w-4" />} />
                            <StatCard label="Analytics" value="Live updates" icon={<ChartNoAxesCombined className="h-4 w-4" />} />
                            <div className="flex flex-col justify-center rounded-2xl bg-[#008A5E]/5 p-6 text-center">
                                <p className="text-3xl font-black text-[#008A5E]">3.1x</p>
                                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#4d5d58]">Avg Conversion Lift</p>
                            </div>
                        </div>
                    </div>
                </section>
            </WebsiteScrollReveal>

            <WebsiteScrollReveal delayMs={110} className="mt-8" variant="pop">
                <section className="rounded-2xl border border-[#dfe5df] bg-white p-6">
                    <h2 className="text-xl font-bold text-[#1f2a2a]">Powerful capabilities</h2>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {businessCapabilities.map((capability) => (
                            <article key={capability.title} className="rounded-xl border border-[#e4e8e4] bg-[#fbfcfb] p-6 hover:shadow-md transition-shadow">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#008A5E]/10 text-[#008A5E] mb-4">
                                    {capability.icon}
                                </div>
                                <h3 className="text-lg font-bold text-[#1f2a2a]">{capability.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-[#5f6d68]">{capability.body}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </WebsiteScrollReveal>

            <WebsiteScrollReveal delayMs={140} className="mt-8" variant="pop">
                <section className="rounded-2xl border border-[#008A5E]/20 bg-[#008A5E] p-10 text-white text-center">
                    <h2 className="text-3xl font-bold">Ready to grow your revenue?</h2>
                    <p className="mt-4 text-white/80 max-w-xl mx-auto">
                        Join 500+ local businesses using HyperLocal to fill idle hours and boost sales.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <RegisterButton
                            className="rounded-xl bg-white px-8 py-4 text-sm font-bold text-[#008A5E] shadow-xl hover:scale-105 transition-transform"
                        >
                            Get started for free
                        </RegisterButton>
                    </div>
                </section>
            </WebsiteScrollReveal>
        </BusinessShell>
    );
}

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <article className="rounded-2xl border border-[#dfe5df] bg-white p-6 shadow-sm flex flex-col justify-between">
            <div className="text-[#008A5E] mb-4">
                {icon}
            </div>
            <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#4d5d58]">
                    {label}
                </p>
                <p className="mt-2 text-xl font-bold text-[#1f2a2a]">{value}</p>
            </div>
        </article>
    );
}
