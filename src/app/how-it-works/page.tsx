import Link from "next/link";
import { Download, Sparkles, MapPin, Zap, Navigation } from "lucide-react";
import { WebsiteShell } from "@/components/website/WebsiteShell";
import { WebsiteScrollReveal } from "@/components/website/WebsiteScrollReveal";
import { HowItWorksFlowDiagram } from "@/components/website/HowItWorksFlowDiagram";

export default function HowItWorksPage() {
  return (
    <WebsiteShell>
      <WebsiteScrollReveal>
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[#dbe3db] bg-gradient-to-br from-[#f0f9f6] via-white to-[#edf5ff] p-10 sm:p-16">
          <div className="website-orb-slow absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#1f6d68]/10 blur-[120px]" />
          <div className="website-orb-fast absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-blue-100/30 blur-[120px]" />

          <div className="relative z-10 max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d6e4dc] bg-white/95 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#1f6d68] shadow-sm mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Your New Superpower
            </p>
            <h1 className="text-5xl font-black leading-[0.9] tracking-tighter text-[#1f2a2a] sm:text-7xl">
              Savings, <br />
              <span className="text-[#1f6d68]">delivered live.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-xl text-[#4d5d58] font-medium leading-relaxed">
              Stop hunting for coupons. We detect local deals in real-time as you walk your city,
              bringing exclusive discounts straight to your pocket.
            </p>
          </div>
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={100} className="mt-12" variant="pop">
        <HowItWorksFlowDiagram />
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={200} className="mt-12">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<MapPin className="h-5 w-5" />}
            title="District Intelligence"
            body="Our system knows your exact district and only shows you what's within walking distance."
          />
          <FeatureCard
            icon={<Zap className="h-5 w-5" />}
            title="Instant Lock-in"
            body="Limited inventory? No problem. Claim it instantly to guarantee your price."
          />
          <FeatureCard
            icon={<Navigation className="h-5 w-5" />}
            title="Guided Journey"
            body="Follow the live map directly to the merchant. No getting lost, no confusion."
          />
        </div>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={300} className="mt-12 mb-16" variant="pop">
        <section className="rounded-[3rem] border border-[#1f6d68]/10 bg-[#1f6d68] p-10 sm:p-16 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 h-96 w-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl mb-6">Experience it yourself.</h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-10 font-medium">
              Join thousands of locals who never pay full price for their daily coffee, meals, or services.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-black text-[#1f6d68] shadow-2xl hover:scale-105 transition-transform"
              >
                <Download className="h-5 w-5" />
                Join Hyper Local
              </Link>
            </div>
          </div>
        </section>
      </WebsiteScrollReveal>
    </WebsiteShell>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode, title: string, body: string }) {
  return (
    <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl transition-all group">
      <div className="h-12 w-12 rounded-2xl bg-[#f0f9f6] text-[#1f6d68] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black text-[#1f2a2a] mb-3">{title}</h3>
      <p className="text-[#5f6d68] font-medium leading-relaxed">{body}</p>
    </div>
  )
}
