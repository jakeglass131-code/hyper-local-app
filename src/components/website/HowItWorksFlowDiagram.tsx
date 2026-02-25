"use client";

import { useState, type ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BellRing,
  CheckCircle2,
  MapPinned,
  Navigation,
  QrCode,
  Sparkles,
  Store,
  Target,
  TicketPercent,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

type JourneyStep = {
  title: string;
  desc: string;
  details: string;
  benefit: string;
  tech: string;
  icon: React.ComponentType<{ className?: string }>;
  visual: ReactNode;
};

const consumerJourneySteps: JourneyStep[] = [
  {
    title: "Live Alert",
    desc: "District Intelligence",
    details:
      "As you enter a new neighborhood, Hyper Local detects the best active offers nearby and sends a high-priority notification directly to your lock screen.",
    benefit: "Zero searching. Get notified when an offer is right for you.",
    tech: "Geo-triggered push alerts inside your active district.",
    icon: BellRing,
    visual: (
      <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-[#dce7e0] bg-[#f0f9f6] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="h-64 w-64 rounded-full border border-[#3744D2] animate-ping" />
          <div className="h-48 w-48 rounded-full border border-[#3744D2] animate-pulse" />
        </div>

        <div className="relative mt-4 h-48 w-32 overflow-hidden rounded-[2.5rem] border-[4px] border-[#2a2a2a] bg-[#1a1a1a] pt-3 shadow-2xl">
          <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-white/20" />
          <div className="px-2.5">
            <div className="rounded-xl border border-white/5 bg-white/10 p-2 backdrop-blur-xl animate-in slide-in-from-top-6 duration-700">
              <div className="mb-1.5 flex items-center gap-1.5">
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-md bg-[#3744D2]">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
                <span className="text-[6px] font-black uppercase tracking-widest text-white/50">Hyper Local</span>
              </div>
              <p className="text-[8px] font-black leading-tight text-white">50% OFF AT COFFEE LAB</p>
              <p className="mt-0.5 text-[6px] leading-none text-white/60">Valid for next 15 mins • 150m away</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "One-Tap Claim",
    desc: "Lock in your Discount",
    details:
      "Open the app and tap claim. Your offer is held for 30 minutes and saved to your wallet, so you can walk over without missing out.",
    benefit: "No risk. You have 30 minutes to claim and use your offer.",
    tech: "Timed claim reservation with countdown-based expiry control.",
    icon: TicketPercent,
    visual: (
      <div className="relative h-48 w-full rounded-2xl border border-[#f5e5e0] bg-[#fdf2f0] flex items-center justify-center">
        <div className="group flex w-52 cursor-pointer flex-col items-center rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-2xl transition-transform active:scale-95">
          <div className="mb-4 flex w-full justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a59]">Reserved</span>
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="relative mb-4 flex h-16 w-full items-center justify-center rounded-2xl border border-dashed border-[#ff7a59]/40 bg-[#fff4f2]">
            <TicketPercent className="h-8 w-8 text-[#ff7a59]" />
            <div className="absolute -right-2 -top-2 rounded-full bg-[#ff7a59] px-2 py-1 text-[8px] font-black text-white shadow-lg">CLAIMED</div>
          </div>
          <div className="w-full space-y-2">
            <div className="h-2 w-full rounded-full bg-gray-100" />
            <div className="h-2 w-3/4 rounded-full bg-gray-100" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Quick Walk",
    desc: "Just minutes away",
    details:
      "Hyper Local only shows offers within a short walking radius. Follow the live map as it guides you directly to the store.",
    benefit: "Only relevant nearby offers you can actually reach fast.",
    tech: "5-minute radius filtering with live walking navigation.",
    icon: MapPinned,
    visual: (
      <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-[#dce7e0] bg-[#f0f9f6]">
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{ backgroundImage: "radial-gradient(#3744D2 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 120">
          <path
            d="M40,100 C60,80 100,90 120,60 S150,40 160,20"
            fill="none"
            stroke="#3744D2"
            strokeWidth="3"
            strokeDasharray="6,6"
            className="animate-[dash_10s_linear_infinite]"
          />
        </svg>
        <div className="absolute bottom-6 left-10 animate-bounce">
          <div className="h-4 w-4 rounded-full border-2 border-white bg-green-600 shadow-lg shadow-green-500/50" />
        </div>
        <div className="absolute right-8 top-4 flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3744D2] shadow-xl">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div className="mt-1 rounded-full border border-gray-100 bg-white px-2 py-0.5 text-[6px] font-black text-[#1f2a2a]">ARRIVING</div>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-white/90 p-2 backdrop-blur shadow-sm">
          <Navigation className="h-3 w-3 text-green-600" />
          <span className="text-[8px] font-black text-[#1f2a2a]">3 mins walk</span>
        </div>
      </div>
    ),
  },
  {
    title: "Secure Redeem",
    desc: "Scan and Save",
    details:
      "Upon arrival, show your dynamic QR code to the merchant. They scan it and the discount is applied instantly at checkout.",
    benefit: "Seamless checkout with instant discount application.",
    tech: "Dynamic QR plus merchant scanner verification in real time.",
    icon: QrCode,
    visual: (
      <div className="relative h-48 w-full rounded-2xl border border-[#dce7e0] bg-[#f2f8f5] flex items-center justify-center">
        <div className="flex items-center gap-8">
          <div className="relative">
            <QrCode className="h-20 w-20 text-[#1f2a2a]" />
            <div className="absolute inset-x-0 top-0 h-0.5 animate-[scan_2s_ease-in-out_infinite] bg-[#3744D2]" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-10 w-0.5 bg-gray-200" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-xl animate-bounce">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div className="h-10 w-0.5 bg-gray-200" />
          </div>
          <div className="flex flex-col items-center rounded-[2rem] border border-gray-50 bg-white p-5 shadow-2xl">
            <p className="text-[10px] font-black text-[#3744D2]">SUCCESS</p>
            <p className="text-2xl font-black text-[#1f2a2a]">-$8.50</p>
            <span className="mt-1 text-[8px] font-bold text-gray-400">Saved Today</span>
          </div>
        </div>
      </div>
    ),
  },
];

const businessJourneySteps: JourneyStep[] = [
  {
    title: "Campaign Setup",
    desc: "Create your offer",
    details:
      "You set discount, inventory, active hours, and radius in the merchant dashboard. Launch takes under two minutes.",
    benefit: "Clear control over margin, volume, and timing.",
    tech: "Offer builder with inventory and radius guardrails.",
    icon: SlidersHorizontal,
    visual: (
      <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-[#dce7e0] bg-[#f4f8ff] p-4">
        <div className="grid h-full grid-cols-[1.2fr_0.8fr] gap-3">
          <div className="rounded-xl border border-[#d5dcff] bg-white p-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#3744D2]">Offer Builder</p>
            <div className="mt-3 space-y-2">
              <div className="h-2 w-4/5 rounded-full bg-slate-100" />
              <div className="h-2 w-full rounded-full bg-slate-100" />
              <div className="h-2 w-3/4 rounded-full bg-slate-100" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-[8px] font-black text-slate-500">Inventory: 40</div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-[8px] font-black text-slate-500">Radius: 2km</div>
            </div>
          </div>
          <div className="rounded-xl border border-[#d5dcff] bg-white p-3 flex flex-col justify-between">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Preview</p>
            <div className="rounded-lg bg-[#3744D2]/10 p-2 text-[8px] font-black text-[#3744D2]">25% OFF Lunch</div>
            <button className="rounded-lg bg-[#3744D2] py-1.5 text-[9px] font-black text-white">Go Live</button>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Auto Distribution",
    desc: "Reach nearby customers",
    details:
      "Hyper Local automatically pushes your offer to people inside your selected district radius with no manual ad buying.",
    benefit: "Spend reaches people who can actually walk in.",
    tech: "Geofenced push delivery and local relevance scoring.",
    icon: Target,
    visual: (
      <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-[#dce7e0] bg-[#eef8f4]">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{ backgroundImage: "radial-gradient(#3744D2 1px, transparent 1px)", backgroundSize: "18px 18px" }}
        />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#3744D2]/30" />
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#3744D2]/40 animate-pulse" />
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-[#3744D2] shadow-lg">
          <Store className="h-6 w-6 text-white" />
        </div>
        <div className="absolute left-8 top-8 h-3 w-3 rounded-full bg-green-500 animate-bounce" />
        <div className="absolute bottom-10 right-12 h-3 w-3 rounded-full bg-green-500 animate-bounce [animation-delay:250ms]" />
        <div className="absolute right-20 top-14 h-3 w-3 rounded-full bg-green-500 animate-bounce [animation-delay:450ms]" />
        <div className="absolute left-4 top-4 z-10 rounded-full border border-[#d6e4dc] bg-white/95 px-2 py-1 text-[8px] font-black text-[#3744D2] shadow-sm">
          Auto-target active • 2km radius
        </div>
      </div>
    ),
  },
  {
    title: "Live Operations",
    desc: "Monitor demand",
    details:
      "You watch claims, inventory remaining, and countdown windows in real time so staff can prepare before customers arrive.",
    benefit: "Predictable rush management and stock control.",
    tech: "Live claim stream, inventory meter, and alert queue.",
    icon: Activity,
    visual: (
      <div className="relative h-48 w-full rounded-2xl border border-[#dce7e0] bg-[#f8fafc] p-4">
        <div className="grid h-full grid-rows-[auto_1fr] gap-3">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Campaign Health</p>
            <span className="text-[8px] font-black text-emerald-600">Active</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-200 bg-white p-2">
              <p className="text-[8px] font-black text-slate-400 uppercase">Claims</p>
              <p className="text-lg font-black text-[#1f2a2a]">34</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2">
              <p className="text-[8px] font-black text-slate-400 uppercase">Remaining</p>
              <p className="text-lg font-black text-[#1f2a2a]">11</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2">
              <p className="text-[8px] font-black text-slate-400 uppercase">Avg ETA</p>
              <p className="text-lg font-black text-[#1f2a2a]">7m</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Counter Verification",
    desc: "Scan and approve",
    details:
      "At checkout, your team scans the customer QR code. The system validates instantly and applies the discount securely.",
    benefit: "Fast checkout with fraud-safe redemption.",
    tech: "Dynamic QR validation with real-time scanner confirmation.",
    icon: QrCode,
    visual: (
      <div className="relative h-48 w-full rounded-2xl border border-[#dce7e0] bg-[#f2f8f5] flex items-center justify-center">
        <div className="flex items-center gap-6">
          <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
            <QrCode className="h-16 w-16 text-[#1f2a2a]" />
            <div className="absolute inset-x-3 top-4 h-0.5 animate-[scan_2s_ease-in-out_infinite] bg-[#3744D2]" />
          </div>
          <div className="h-14 w-px bg-slate-200" />
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-600" />
            <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-emerald-700">Approved</p>
            <p className="text-[8px] font-bold text-emerald-700/80">Discount applied</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Performance Loop",
    desc: "Measure and optimize",
    details:
      "After each campaign, the dashboard shows conversion, revenue, and peak windows so you can improve the next launch.",
    benefit: "Better offers every cycle with measurable ROI.",
    tech: "Analytics hub with funnel, retention, and ROI trend insights.",
    icon: BarChart3,
    visual: (
      <div className="relative h-48 w-full rounded-2xl border border-[#dce7e0] bg-[#f4f8ff] p-4">
        <div className="grid h-full grid-cols-[1fr_0.9fr] gap-3">
          <div className="rounded-xl border border-[#d5dcff] bg-white p-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Conversion Trend</p>
            <div className="mt-3 flex h-20 items-end gap-1.5">
              {[35, 48, 44, 58, 66, 62, 74].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-[#3744D2]/80" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[#d5dcff] bg-white p-3 flex flex-col justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">ROI</p>
              <p className="text-2xl font-black text-[#3744D2]">4.2x</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-[8px] font-black text-slate-600">Best window: 12pm-2pm</div>
          </div>
        </div>
      </div>
    ),
  },
];

export function HowItWorksFlowDiagram({ audience = "consumer" }: { audience?: "consumer" | "business" }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = audience === "business" ? businessJourneySteps : consumerJourneySteps;
  const heading = audience === "business" ? "Launch offers. Track real revenue." : "From Discovery to Saving.";
  const sectionLabel = audience === "business" ? "Merchant Workflow" : "The Experience";
  const stageLabel = "Stage";

  const next = () => setActiveStep((prev) => (prev + 1) % steps.length);
  const back = () => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);

  const active = steps[activeStep];
  const ActiveIcon = active.icon;

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-[#dbe3db] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:p-10">
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#3744D2]">{sectionLabel}</p>
          <h2 className="text-4xl font-black leading-none tracking-tighter text-[#1f2a2a]">{heading}</h2>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={cn(
                "h-2.5 w-10 rounded-full transition-all duration-500",
                activeStep === i ? "bg-[#3744D2] shadow-lg shadow-[#3744D2]/20" : "bg-gray-200 hover:bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="relative aspect-video overflow-hidden rounded-[2.5rem] border border-gray-100 bg-[#fbfcfb] p-3 lg:aspect-square xl:aspect-video">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f0f9f6] to-white opacity-50" />
          <div className="relative flex h-full w-full flex-col items-center justify-center rounded-[2rem] border border-gray-50 bg-white p-8 shadow-sm">
            <div className="w-full">{active.visual}</div>

            <div className="absolute bottom-8 left-1/2 flex w-full -translate-x-1/2 items-center justify-between px-8">
              <div className="flex gap-2">
                <button
                  onClick={back}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-90"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-400" />
                </button>
                <button
                  onClick={next}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f2a2a] shadow-xl shadow-black/10 transition-transform hover:scale-105 active:scale-95"
                >
                  <ArrowRight className="h-5 w-5 text-white" />
                </button>
              </div>

              <div />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div key={activeStep} className="animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[#3744D2]/10 text-[#3744D2] shadow-inner">
              <ActiveIcon className="h-8 w-8" />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#3744D2]">{stageLabel} {activeStep + 1}</h3>
              <h2 className="text-5xl font-black leading-[0.9] tracking-tighter text-[#1f2a2a]">{active.title}</h2>
              <p className="text-2xl font-bold leading-tight tracking-tight text-[#1f2a2a]/60">{active.desc}</p>
              <div className="h-1.5 w-24 rounded-full bg-[#3744D2]" />
              <p className="pt-4 text-xl font-medium leading-relaxed text-[#5f6d68]">{active.details}</p>
            </div>
          </div>

          <div className="mt-12">
            <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-colors hover:border-[#3744D2]/20">
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Benefit</p>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#3744D2]" />
                <p className="text-[13px] font-black text-[#1f2a2a]">{active.benefit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="-z-10 absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-green-50 opacity-50 blur-[100px]" />
      <div className="-z-10 absolute -left-20 -top-20 h-64 w-64 rounded-full bg-green-50 opacity-50 blur-[100px]" />
    </section>
  );
}
