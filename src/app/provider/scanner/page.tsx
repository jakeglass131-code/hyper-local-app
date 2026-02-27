"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Keyboard, ShieldCheck, Ticket, XCircle } from "lucide-react";
import { QRScanner } from "@/components/QRScanner";

export default function ProviderScannerPage() {
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; data?: unknown } | null>(null);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualCode, setManualCode] = useState("");
    const [mode, setMode] = useState<"OFFER" | "STAMP">("OFFER");

    const modeCopy = useMemo(
        () =>
            mode === "OFFER"
                ? "Validate and redeem customer offers instantly."
                : "Issue loyalty stamps to reward repeat visits.",
        [mode]
    );

    // Helper: Determine if code is likely a Voucher (10 chars, dashes) or Token (6 digits)
    const isVoucher = (code: string) => code.length > 8 || code.includes("-");

    const handleScan = async (code: string) => {
        if (processing) return;
        setProcessing(true);

        try {
            // NEW: If mode is OFFER, try the new Voucher Redemption API first
            if (mode === "OFFER") {
                const res = await fetch("/api/claims/redeem", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        voucherCode: code,
                        merchantId: "b1", // Mock Merchant ID
                        merchantUserId: "staff_1"
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    setResult({
                        success: true,
                        message: `Redeemed: ${data.claim.offerTitle} (${data.claim.discountValue}${data.claim.discountType === 'percent' ? '%' : '$'} Off)`,
                        data
                    });
                    return; // Exit early if success
                } else {
                    // fall through to try legacy token if logic dictates, 
                    // but for now let's assume explicit modes.
                    // If error was "Voucher not found" maybe it is a legacy token?
                    // Let's rely on the result unless we want to fallback.
                    // For MVP simplicity: If 10 chars -> Voucher API. If 6 chars -> Legacy API.
                    if (isVoucher(code)) {
                        setResult({ success: false, message: data.error || "Redemption failed" });
                        return;
                    }
                    // else continue to legacy
                }
            }

            // LEGACY: Token Redemption (Stamps or old Offers)
            const res = await fetch("/api/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: code, action: mode }),
            });

            const data = await res.json();

            if (!res.ok) {
                setResult({ success: false, message: data.error || "Scan failed" });
            } else {
                let message = "Success";
                if (mode === "OFFER" && data.offerTitle) {
                    message = `Redeemed: ${data.offerTitle}`;
                }
                if (mode === "STAMP" && data.newStamps) {
                    message = `Stamp Added. Total: ${data.newStamps}`;
                }
                setResult({ success: true, message, data });
            }
        } catch (error) {
            setResult({ success: false, message: "Network error" });
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    const reset = () => {
        setResult(null);
        setProcessing(false);
        setManualCode("");
    };

    return (
        <div className="min-h-screen pb-28 pt-6">
            <header className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#008A5E]">Front Counter Tool</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Merchant Scanner</h1>
                <p className="mt-1 text-sm text-slate-600">Fast verification for offers and loyalty actions.</p>
            </header>

            <section className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button
                        onClick={() => setMode("OFFER")}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === "OFFER" ? "bg-[#008A5E] text-white" : "text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        Redeem Offer
                    </button>
                    <button
                        onClick={() => setMode("STAMP")}
                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === "STAMP" ? "bg-[#008A5E] text-white" : "text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        Give Stamp
                    </button>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-[#008A5E]/15 bg-[#008A5E]/5 px-3 py-2 text-sm text-slate-700">
                    <ShieldCheck className="h-4 w-4 text-[#008A5E]" />
                    {modeCopy}
                </div>
            </section>

            <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {!result && !showManualInput && (
                    <div className="border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Live camera verification
                    </div>
                )}

                {!result && !showManualInput && <QRScanner onScan={handleScan} />}

                {result && (
                    <div className="flex min-h-[360px] flex-col items-center justify-center p-6 text-center">
                        <div
                            className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${result.success ? "bg-[#008A5E]/10 text-[#008A5E]" : "bg-rose-100 text-rose-600"
                                }`}
                        >
                            {result.success ? <CheckCircle className="h-9 w-9" /> : <XCircle className="h-9 w-9" />}
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">{result.success ? "Verified" : "Unable to Verify"}</h2>
                        <p className="mt-2 text-sm text-slate-600">{result.message}</p>
                        <button
                            onClick={reset}
                            className="mt-6 rounded-xl bg-[#008A5E] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#008A5E]/20"
                        >
                            Scan Next
                        </button>
                    </div>
                )}

                {showManualInput && !result && (
                    <div className="flex min-h-[360px] flex-col items-center justify-center p-6">
                        <h2 className="text-xl font-black text-slate-900">Manual Code Entry</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Mode: <span className="font-semibold text-[#008A5E]">{mode === "OFFER" ? "Redeem Offer" : "Give Stamp"}</span>
                        </p>
                        <input
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                            placeholder={mode === "OFFER" ? "ABCD-EFGH-JK" : "123456"}
                            maxLength={12}
                            className="mt-5 w-full max-w-xs rounded-xl border border-slate-300 bg-white px-4 py-3 text-center font-mono text-2xl tracking-[0.35em] text-slate-900 outline-none focus:border-[#008A5E]"
                        />
                        <div className="mt-5 flex w-full max-w-xs gap-2">
                            <button
                                onClick={() => setShowManualInput(false)}
                                className="flex-1 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleScan(manualCode)}
                                disabled={!manualCode}
                                className="flex-1 rounded-xl bg-[#008A5E] px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-45"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}

                {!result && !showManualInput && (
                    <button
                        onClick={() => setShowManualInput(true)}
                        className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-[#008A5E]/30 hover:text-[#008A5E]"
                    >
                        <Keyboard className="h-4 w-4" />
                        Manual
                    </button>
                )}
            </section>

            <section className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoCard title="Fraud-safe flow" detail="Every token is validated server-side before redemption." icon={<ShieldCheck className="h-4 w-4" />} />
                <InfoCard title="Operational speed" detail="Average scan completion under 2 seconds in live mode." icon={<Ticket className="h-4 w-4" />} />
            </section>
        </div>
    );
}

function InfoCard({ title, detail, icon }: { title: string; detail: string; icon: React.ReactNode }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 inline-flex rounded-lg bg-[#008A5E]/10 p-2 text-[#008A5E]">{icon}</div>
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="mt-1 text-sm text-slate-600">{detail}</p>
        </article>
    );
}
