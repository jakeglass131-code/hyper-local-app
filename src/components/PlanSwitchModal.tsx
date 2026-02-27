"use client";

import React from "react";
import { X, CreditCard, ChevronRight } from "lucide-react";

interface PlanSwitchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (tier: string) => void;
    currentPlan?: string;
}

export function PlanSwitchModal({ isOpen, onClose, onConfirm, currentPlan = "free" }: PlanSwitchModalProps) {
    const [selectedTier, setSelectedTier] = React.useState<string>(
        currentPlan === "apex" ? "catalyst" : "apex"
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
            <div className="relative w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-300">
                <div className="mx-auto h-[92vh] w-full overflow-hidden rounded-t-[40px] bg-[#F8F9FA] px-6 pb-10 pt-12 shadow-2xl sm:h-auto sm:rounded-[40px]">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-8 top-8 z-10 rounded-full bg-slate-200/50 p-2 text-slate-600 transition-colors hover:bg-slate-200"
                    >
                        <X size={20} />
                    </button>

                    {/* Title */}
                    <h2 className="mb-10 text-4xl font-bold tracking-tight text-slate-900">
                        Change <span className="bg-[#D9FF54] px-1 italic">your plan</span>
                    </h2>

                    {/* Options Container */}
                    <div className="space-y-4">
                        {/* Apex Option */}
                        <div
                            onClick={() => setSelectedTier("apex")}
                            className={`relative flex cursor-pointer flex-col rounded-[24px] border-2 p-6 transition-all hover:shadow-md ${selectedTier === "apex" ? "border-slate-900 bg-white" : "border-slate-200 bg-slate-50 opacity-60"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-black text-slate-900">Apex subscription</span>
                                {selectedTier === "apex" && (
                                    <span className="rounded-full bg-[#D9FF54] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900">
                                        Best Value
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900">$99</span>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">per month</span>
                            </div>
                        </div>

                        {/* Catalyst Option */}
                        <div
                            onClick={() => setSelectedTier("catalyst")}
                            className={`relative flex cursor-pointer flex-col rounded-[24px] border-2 p-6 transition-all hover:shadow-md ${selectedTier === "catalyst" ? "border-slate-900 bg-white" : "border-slate-200 bg-slate-50 opacity-60"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-black text-slate-900">Catalyst subscription</span>
                                <span className={`rounded-full px-3 py-1.5 text-[8px] font-black uppercase tracking-widest ${currentPlan === "catalyst"
                                    ? "bg-slate-200 text-slate-500"
                                    : "bg-[#008A5E] text-white shadow-sm"
                                    }`}>
                                    {currentPlan === "catalyst" ? "Current" : "Most Popular"}
                                </span>
                            </div>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900">$49</span>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">per month</span>
                            </div>
                        </div>

                        {/* Free Trial Option */}
                        <div
                            onClick={() => setSelectedTier("free")}
                            className={`relative flex cursor-pointer flex-col rounded-[24px] border-2 p-6 transition-all hover:shadow-md ${selectedTier === "free" ? "border-slate-900 bg-white" : "border-slate-200 bg-slate-50/50 opacity-60"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-black text-slate-900">Free Trial</span>
                                {currentPlan === "free" && (
                                    <span className="rounded-full bg-slate-200 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-slate-500">
                                        Current
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900">$0</span>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">14 days</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Payment Method Button */}
                    <button className="group mt-6 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                <CreditCard size={20} className="text-slate-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-slate-900">Payment Method</p>
                                <p className="text-xs text-slate-500">Visa ending in 4242</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600" />
                    </button>

                    {/* Confirm Button */}
                    <button
                        onClick={() => onConfirm(selectedTier)}
                        className={`mt-6 w-full rounded-[20px] py-5 text-lg font-black uppercase tracking-widest text-white transition-all active:scale-[0.98] ${selectedTier === "apex" ? "bg-black hover:bg-slate-900" :
                            selectedTier === "catalyst" ? "bg-[#008A5E] hover:bg-[#00734e]" :
                                "bg-slate-900 hover:bg-black"
                            }`}
                    >
                        {selectedTier === "apex" ? "Unlock Apex" :
                            selectedTier === "catalyst" ? "Scale with Catalyst" :
                                "Select Trial"}
                    </button>

                    {/* Footer Info */}
                    <p className="mt-6 text-center text-sm font-medium text-slate-500">
                        Your new plan starts on March 1, 2026
                    </p>

                    <div className="mt-12 text-center pb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Recurring billing · Cancel anytime
                        </p>
                        <div className="mt-4 flex justify-center gap-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">
                            <button onClick={() => alert("Restore purchase check...")} className="hover:text-[#3744D2] underline decoration-slate-300 underline-offset-4">Restore purchase</button>
                            <button onClick={() => alert("Terms & Conditions...")} className="hover:text-[#3744D2] underline decoration-slate-300 underline-offset-4">Terms</button>
                            <button onClick={() => alert("Privacy Policy...")} className="hover:text-[#3744D2] underline decoration-slate-300 underline-offset-4">Privacy</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
