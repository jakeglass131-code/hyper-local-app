"use client";

import { useState } from "react";
import { BellRing, CheckCircle2, MapPinned, QrCode, ScanLine, Store, TicketPercent, Users, Sparkles, ArrowLeft, ArrowRight, Zap, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

const journeySteps = [
  {
    title: "Live Alert",
    desc: "District Intelligence",
    details: "As you enter a new neighborhood, Hyper Local detects the best active offers nearby and sends a high-priority notification directly to your lock screen.",
    icon: BellRing,
    visual: (
      <div className="relative h-48 w-full bg-[#eff3ff] rounded-2xl flex items-center justify-center border border-[#dfe5f5] overflow-hidden">
        {/* Animated background rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="h-64 w-64 rounded-full border border-[#3744d2] animate-ping" />
          <div className="h-48 w-48 rounded-full border border-[#3744d2] animate-pulse" />
        </div>

        <div className="relative w-32 h-48 bg-[#1a1a1a] rounded-[2.5rem] border-[4px] border-[#2a2a2a] shadow-2xl overflow-hidden flex flex-col items-center pt-3 mt-4">
          <div className="w-12 h-1 bg-white/20 rounded-full mb-6" />
          <div className="w-full px-2.5">
            <div className="bg-white/10 backdrop-blur-xl p-2 rounded-xl border border-white/5 animate-in slide-in-from-top-6 duration-700">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="h-3.5 w-3.5 bg-[#3744d2] rounded-md flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
                <span className="text-white/50 text-[6px] font-black tracking-widest uppercase">Hyper Local</span>
              </div>
              <p className="text-white text-[8px] font-black leading-tight">50% OFF AT COFFEE LAB</p>
              <p className="text-white/60 text-[6px] mt-0.5 leading-none">Valid for next 15 mins • 150m away</p>
            </div>
          </div>

          <div className="absolute bottom-4 flex gap-1">
            <div className="h-1 w-1 rounded-full bg-white/20" />
            <div className="h-1 w-1 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    )
  },
  {
    title: "One-Tap Claim",
    desc: "Lock in your Discount",
    details: "Open the app and tap 'Claim'. This instantly reserves your discount and adds it to your digital wallet, ensuring the offer won't expire before you arrive.",
    icon: TicketPercent,
    visual: (
      <div className="relative h-48 w-full bg-[#fdf2f0] rounded-2xl flex items-center justify-center border border-[#f5e5e0]">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl w-52 border border-gray-100 flex flex-col items-center group cursor-pointer active:scale-95 transition-transform">
          <div className="flex justify-between w-full mb-4">
            <span className="text-[10px] font-black text-[#ff7a59] uppercase tracking-widest">Reserved</span>
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
          </div>

          <div className="h-16 w-full bg-[#fff4f2] rounded-2xl flex items-center justify-center relative border border-dashed border-[#ff7a59]/40 mb-4 group-hover:scale-110 transition-transform">
            <TicketPercent className="h-8 w-8 text-[#ff7a59]" />
            <div className="absolute -top-2 -right-2 bg-[#ff7a59] text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg">CLAIMED</div>
          </div>

          <div className="w-full space-y-2">
            <div className="h-2 w-full bg-gray-100 rounded-full" />
            <div className="h-2 w-3/4 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Quick Walk",
    desc: "Just a few minutes away",
    details: "Hyper Local only shows you offers within a 5-minute radius. Follow the live map as it guides you directly to the store entryway.",
    icon: MapPinned,
    visual: (
      <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-[#dce7e0] bg-[#f0f9f6]">
        {/* Map grid */}
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(#1f6d68 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        {/* Animated Path */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 120">
          <path d="M40,100 C60,80 100,90 120,60 S150,40 160,20" fill="none" stroke="#1f6d68" strokeWidth="3" strokeDasharray="6,6" className="animate-[dash_10s_linear_infinite]" />
        </svg>

        {/* User Marker */}
        <div className="absolute left-10 bottom-6 animate-bounce">
          <div className="h-4 w-4 bg-blue-600 rounded-full border-2 border-white shadow-lg shadow-blue-500/50" />
        </div>

        {/* Store Marker */}
        <div className="absolute right-8 top-4 flex flex-col items-center">
          <div className="h-10 w-10 flex items-center justify-center bg-[#1f6d68] rounded-xl shadow-xl">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div className="mt-1 bg-white px-2 py-0.5 rounded-full text-[6px] font-black text-[#1f2a2a] border border-gray-100">ARRIVING</div>
        </div>

        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
          <Navigation className="h-3 w-3 text-blue-600" />
          <span className="text-[8px] font-black text-[#1f2a2a]">3 mins walk</span>
        </div>
      </div>
    )
  },
  {
    title: "Secure Redeem",
    desc: "Scan and Save",
    details: "Upon arrival, show your dynamic QR code to the merchant. They scan it with the Hyper Local app, and your discount is applied instantly at the counter.",
    icon: QrCode,
    visual: (
      <div className="relative h-48 w-full bg-[#f2f8f5] rounded-2xl flex items-center justify-center border border-[#dce7e0]">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#1f6d68]/5 rounded-3xl group-hover:bg-[#1f6d68]/10 transition-colors" />
            <QrCode className="h-20 w-20 text-[#1f2a2a] relative z-10" />
            <div className="absolute inset-x-0 h-0.5 bg-[#1f6d68] top-0 animate-[scan_2s_ease-in-out_infinite] z-20" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="h-10 w-0.5 bg-gray-200" />
            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div className="h-10 w-0.5 bg-gray-200" />
          </div>

          <div className="bg-white p-5 rounded-[2rem] shadow-2xl border border-gray-50 flex flex-col items-center">
            <p className="text-[10px] font-black text-[#1f6d68] mb-1">SUCCESS</p>
            <p className="text-2xl font-black text-[#1f2a2a]">-$8.50</p>
            <span className="text-[8px] font-bold text-gray-400 mt-1">Saved Today</span>
          </div>
        </div>
      </div>
    )
  },
] as const;

export function HowItWorksFlowDiagram() {
  const [activeStep, setActiveStep] = useState(0);

  const next = () => setActiveStep((prev) => (prev + 1) % journeySteps.length);
  const back = () => setActiveStep((prev) => (prev - 1 + journeySteps.length) % journeySteps.length);

  const active = journeySteps[activeStep];
  const ActiveIcon = active.icon;

  return (
    <section className="rounded-[2.5rem] border border-[#dbe3db] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:p-10 relative overflow-hidden">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-[#1f6d68] uppercase tracking-[0.4em] mb-2">The Experience</p>
          <h2 className="text-4xl font-black text-[#1f2a2a] tracking-tighter leading-none">From Discovery to Saving.</h2>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          {journeySteps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={cn(
                "h-2.5 w-10 rounded-full transition-all duration-500",
                activeStep === i ? "bg-[#1f6d68] shadow-lg shadow-[#1f6d68]/20" : "bg-gray-200 hover:bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* Visual Panel */}
        <div className="relative aspect-video lg:aspect-square xl:aspect-video overflow-hidden rounded-[2.5rem] border border-gray-100 bg-[#fbfcfb] p-3">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f0f9f6] to-white opacity-50" />
          <div className="relative h-full w-full bg-white rounded-[2rem] shadow-sm border border-gray-50 flex flex-col items-center justify-center p-8">
            <div className="w-full">
              {active.visual}
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-8 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={back}
                  className="h-12 w-12 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-90"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-400" />
                </button>
                <button
                  onClick={next}
                  className="h-12 w-12 rounded-full bg-[#1f2a2a] shadow-xl shadow-black/10 flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                >
                  <ArrowRight className="h-5 w-5 text-white" />
                </button>
              </div>

              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Interactive Playground</p>
            </div>
          </div>
        </div>

        {/* Text Content Panel */}
        <div className="flex flex-col justify-center">
          <div key={activeStep} className="animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[#1f6d68]/10 text-[#1f6d68] mb-8 shadow-inner">
              <ActiveIcon className="h-8 w-8" />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#1f6d68]">Journey Stage 0{activeStep + 1}</h3>
              <h2 className="text-5xl font-black text-[#1f2a2a] tracking-tighter leading-[0.9]">{active.title}</h2>
              <p className="text-2xl font-bold text-[#1f2a2a]/60 tracking-tight leading-tight">{active.desc}</p>
              <div className="h-1.5 w-24 bg-[#1f6d68] rounded-full" />
              <p className="text-xl text-[#5f6d68] leading-relaxed font-medium pt-4">
                {active.details}
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm group hover:border-[#1f6d68]/20 transition-colors">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Benefit</p>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#1f6d68]" />
                <p className="text-[13px] font-black text-[#1f2a2a]">Zero Searching</p>
              </div>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm group hover:border-blue-200 transition-colors">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tech</p>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <p className="text-[13px] font-black text-[#1f2a2a]">Hyper-Local Precision</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-50 opacity-50 blur-[100px] -z-10" />
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-green-50 opacity-50 blur-[100px] -z-10" />
    </section>
  );
}
