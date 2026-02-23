"use client";

import { useState } from "react";
import { QRScanner } from "@/components/QRScanner";
import { ArrowLeft, CheckCircle, XCircle, Keyboard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProviderScannerPage() {
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualCode, setManualCode] = useState("");
    const [mode, setMode] = useState<"OFFER" | "STAMP">("OFFER");

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
                body: JSON.stringify({
                    token: code,
                    action: mode
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setResult({ success: false, message: data.error || "Scan failed" });
            } else {
                let message = "Success!";
                if (mode === "OFFER" && data.offerTitle) {
                    message = `Redeemed: ${data.offerTitle}`;
                } else if (mode === "STAMP" && data.newStamps) {
                    message = `Stamp Added! Total: ${data.newStamps}`;
                }

                setResult({ success: true, message, data });
            }
        } catch (e) {
            setResult({ success: false, message: "Network error" });
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
        <div className="pb-24 px-4 py-6 min-h-screen">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Merchant Scanner</h1>
                <p className="text-sm text-white/60 mt-1">
                    Scan customer QR codes to redeem offers or give stamps
                </p>
            </header>

            {/* Mode Toggle */}
            {!result && !showManualInput && (
                <div className="flex p-1 bg-neutral-900 border border-white/10 rounded-xl mb-6">
                    <button
                        onClick={() => setMode("OFFER")}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "OFFER" ? "bg-indigo-600 text-white shadow-sm" : "text-white/60 hover:text-white"
                            }`}
                    >
                        Redeem Offer
                    </button>
                    <button
                        onClick={() => setMode("STAMP")}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "STAMP" ? "bg-indigo-600 text-white shadow-sm" : "text-white/60 hover:text-white"
                            }`}
                    >
                        Give Stamp
                    </button>
                </div>
            )}

            {/* Scanner Container */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl aspect-square sm:aspect-[4/3]">
                {!result && !showManualInput && (
                    <QRScanner onScan={handleScan} />
                )}

                {/* Result Overlay */}
                {result && (
                    <div className="absolute inset-0 bg-neutral-900/95 flex flex-col items-center justify-center p-6 z-30 animate-in fade-in zoom-in duration-300">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${result.success ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                            {result.success ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{result.success ? "Success!" : "Error"}</h2>
                        <p className="text-white/70 text-center mb-8">{result.message}</p>

                        <button
                            onClick={reset}
                            className="w-full max-w-xs bg-white text-black font-bold py-4 rounded-2xl active:scale-95 transition-transform hover:bg-gray-100"
                        >
                            Scan Next
                        </button>
                    </div>
                )}

                {/* Manual Input Overlay */}
                {showManualInput && !result && (
                    <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-6 z-30">
                        <h2 className="text-xl font-bold text-white mb-2">Enter Code Manually</h2>
                        <p className="text-white/60 text-sm mb-8">
                            Mode: <span className="font-bold text-indigo-400">{mode === "OFFER" ? "Redeem Offer" : "Give Stamp"}</span>
                        </p>
                        <input
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                            placeholder={mode === "OFFER" ? "ABCD-EFGH-JK" : "123456"}
                            className="w-full max-w-xs bg-black text-white text-center text-3xl tracking-[0.2em] py-4 rounded-2xl border border-white/20 focus:border-indigo-500 outline-none mb-8 font-mono"
                            maxLength={12}
                        />
                        <div className="flex gap-4 w-full max-w-xs">
                            <button
                                onClick={() => setShowManualInput(false)}
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleScan(manualCode)}
                                disabled={!manualCode}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}

                {/* Manual Input Toggle Button (Floating) */}
                {!result && !showManualInput && (
                    <button
                        onClick={() => setShowManualInput(true)}
                        className="absolute bottom-6 right-6 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors z-20"
                    >
                        <Keyboard className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    );
}

