"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Building2 } from "lucide-react";

export function AuthShell({ children, role = "merchant" }: { children: React.ReactNode; role?: "merchant" | "consumer" }) {
    const isMerchant = role === "merchant";
    const brandColor = isMerchant ? "#008A5E" : "#3744D2";

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] font-sans selection:bg-[#008A5E]/30 selection:text-white">
            {/* Cosmos Background Animation */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full opacity-20 blur-[120px] animate-pulse"
                    style={{ backgroundColor: brandColor, animationDuration: '8s' }}
                />
                <div
                    className="absolute -right-[5%] top-[20%] h-[50%] w-[50%] rounded-full opacity-10 blur-[140px] animate-pulse"
                    style={{ backgroundColor: brandColor, animationDuration: '12s', animationDelay: '2s' }}
                />
                <div
                    className="absolute left-[20%] -bottom-[10%] h-[50%] w-[50%] rounded-full opacity-15 blur-[130px] animate-pulse"
                    style={{ backgroundColor: brandColor, animationDuration: '10s', animationDelay: '4s' }}
                />

                {/* Grainy Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.4] mix-blend-overlay" />
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
                <div className="mb-12 flex flex-col items-center gap-4">
                    <Link href="/" className="group flex items-center gap-2.5">
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-2xl transition-transform group-hover:scale-110 group-active:scale-95"
                            style={{ backgroundColor: brandColor, boxShadow: `0 0 40px ${brandColor}33` }}
                        >
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50" style={{ color: brandColor }}>
                                {isMerchant ? "Merchant Portal" : "Consumer Portal"}
                            </span>
                            <span className="text-2xl font-black tracking-tighter text-white">Hyper Local</span>
                        </div>
                    </Link>
                </div>

                <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
                    <div className="rounded-[2.5rem] border border-white/[0.08] bg-white/[0.03] p-1 shadow-2xl backdrop-blur-3xl">
                        <div className="rounded-[2.25rem] border border-white/[0.05] bg-gradient-to-b from-white/[0.05] to-transparent p-8 sm:p-10">
                            {children}
                        </div>
                    </div>

                    {/* Navigation Footer */}
                    <div className="mt-8 flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/30">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
                    </div>
                </div>
            </div>

            {/* Branding Footer (like in the image) */}
            <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t border-white/[0.05] bg-black/40 px-8 py-4 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-white flex items-center justify-center">
                        <div className="h-4 w-4 rounded-full border-2 border-black" />
                    </div>
                    <span className="text-sm font-black tracking-tight text-white">Hyper Local</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Powered by</span>
                    <span className="text-sm font-black text-white">DeepMind</span>
                </div>
            </div>
        </div>
    );
}
