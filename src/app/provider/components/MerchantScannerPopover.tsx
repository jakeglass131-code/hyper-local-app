"use client";

import { useState } from "react";

export function MerchantScannerPopover() {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">Merchant Scanner</div>
                    <div className="truncate text-xs text-slate-600">
                        Redeem offers and issue stamps from one scanner flow.
                    </div>
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="shrink-0 rounded-xl bg-[#3744D2] px-3 py-2 text-sm font-semibold text-white"
                >
                    Open scanner
                </button>
            </div>

            {open && (
                <div className="fixed inset-0 z-[100] bg-slate-950/45 backdrop-blur-sm">
                    <div className="mx-auto mt-8 w-[95vw] max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                            <div className="text-sm font-semibold text-slate-900">Scanner</div>
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
                            >
                                Close
                            </button>
                        </div>

                        <iframe src="/provider/scanner" className="h-[75vh] w-full bg-white" title="Merchant Scanner" />
                    </div>
                </div>
            )}
        </div>
    );
}
