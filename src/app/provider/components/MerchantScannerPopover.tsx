"use client";

import { useState } from "react";

export function MerchantScannerPopover() {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-3">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-sm font-semibold">Merchant Scanner</div>
                    <div className="text-xs text-white/60 truncate">
                        Give stamps, redeem rewards, redeem offers — open scanner anytime.
                    </div>
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="shrink-0 rounded-xl bg-indigo-500 px-3 py-2 text-sm font-medium hover:bg-indigo-400"
                >
                    Open scanner
                </button>
            </div>

            {open && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm">
                    <div className="mx-auto mt-8 w-[95vw] max-w-4xl rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <div className="text-sm font-semibold">Scanner</div>
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-lg px-3 py-1 text-sm hover:bg-white/10"
                            >
                                Close
                            </button>
                        </div>

                        {/* Embed your existing scanner page */}
                        <iframe
                            src="/merchant"
                            className="h-[75vh] w-full bg-white"
                            title="Merchant Scanner"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
