import Link from "next/link";
import { Download, Sparkles, Store, CheckCircle2, Tablet, BellRing, Smartphone } from "lucide-react";
import { BusinessShell } from "@/components/website/BusinessShell";
import { WebsiteScrollReveal } from "@/components/website/WebsiteScrollReveal";
import { HowItWorksFlowDiagram } from "@/components/website/HowItWorksFlowDiagram";

export default function BusinessHowItWorksPage() {
    return (
        <BusinessShell>
            <WebsiteScrollReveal>
                <section className="relative overflow-hidden rounded-3xl border border-[#d6e4dc] bg-gradient-to-br from-[#eff3ff] to-white p-8 sm:p-12">
                    <div className="website-orb-fast absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#3744d2]/10 blur-3xl" />
                    <div className="relative z-10 max-w-3xl">
                        <p className="inline-flex items-center gap-2 rounded-full border border-[#d6e4dc] bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#3744d2]">
                            <Sparkles className="h-3.5 w-3.5" />
                            The Merchant Workflow
                        </p>
                        <h1 className="mt-4 text-4xl font-bold leading-tight text-[#1f2a2a] sm:text-5xl">
                            Automatic marketing,
                            <span className="text-[#3744d2]"> zero effort.</span>
                        </h1>
                        <p className="mt-4 max-w-2xl text-base text-[#4d5d58] sm:text-lg">
                            HyperLocal works in the background to bring customers to your door. Watch the automation loop from initial alert to final sale.
                        </p>
                    </div>
                </section>
            </WebsiteScrollReveal>

            <WebsiteScrollReveal delayMs={100} className="mt-8">
                <div className="rounded-3xl border border-[#dfe5df] bg-white p-2">
                    <HowItWorksFlowDiagram />
                </div>
            </WebsiteScrollReveal>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
                {[
                    {
                        title: "1. Create",
                        body: "Record an offer in seconds. Set your quantity and discount type.",
                        icon: <Store className="h-6 w-6" />
                    },
                    {
                        title: "2. Alert",
                        body: "We handle the advertising. We automatically notify every customer within your district.",
                        icon: <BellRing className="h-6 w-6" />
                    },
                    {
                        title: "3. Verify",
                        body: "Scan the customer's QR code at checkout to confirm the deal.",
                        icon: <Smartphone className="h-6 w-6" />
                    }
                ].map((step, i) => (
                    <WebsiteScrollReveal key={i} delayMs={150 + (i * 50)} variant="pop">
                        <div className="rounded-2xl border border-[#dfe5df] bg-white p-8 group hover:border-[#3744d2]/30 transition-colors">
                            <div className="h-12 w-12 rounded-xl bg-[#3744d2]/10 text-[#3744d2] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-[#1f2a2a]">{step.title}</h3>
                            <p className="mt-2 text-[#5f6d68] leading-relaxed">{step.body}</p>
                        </div>
                    </WebsiteScrollReveal>
                ))}
            </div>

            <WebsiteScrollReveal delayMs={300} className="mt-12">
                <section className="rounded-3xl border border-[#3744d2]/20 bg-[#f8fbff] p-8 md:p-12">
                    <div className="grid gap-12 lg:grid-cols-2 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-[#1f2a2a]">Ready to join?</h2>
                            <p className="mt-4 text-[#4d5d58] text-lg">
                                Get your business on the map today and start seeing foot traffic immediately.
                            </p>
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-[#3744d2]" />
                                    <span className="font-semibold text-[#1f2a2a]">No subscription fees</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-[#3744d2]" />
                                    <span className="font-semibold text-[#1f2a2a]">Launch in 5 minutes</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-[#3744d2]" />
                                    <span className="font-semibold text-[#1f2a2a]">Cancel anytime</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-[#dfe5df] p-8 shadow-xl shadow-[#3744d2]/5">
                            <h3 className="text-xl font-bold text-[#1f2a2a] mb-6">Create Merchant Account</h3>
                            <Link
                                href="/provider/onboarding"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3744d2] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#3744d2]/20 hover:scale-105 transition-transform"
                            >
                                <Store className="h-4 w-4" />
                                Register Business
                            </Link>
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
