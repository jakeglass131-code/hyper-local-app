"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MerchantRedeemPage() {
    const router = useRouter();
    const [voucherCode, setVoucherCode] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [result, setResult] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState("");

    // Mock Merchant Context
    const merchantId = "b1"; // Brew Haven

    const handleRedeem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!voucherCode.trim()) return;

        setStatus("loading");
        setResult(null);
        setErrorMsg("");

        try {
            const res = await fetch("/api/claims/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    voucherCode,
                    merchantId,
                    merchantUserId: "staff_1"
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setResult(data);
                setVoucherCode(""); // Clear input on success
            } else {
                setStatus("error");
                setErrorMsg(data.error || "Redemption failed");
            }
        } catch (err) {
            setStatus("error");
            console.error(err);
            setErrorMsg("Network error. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
            <header className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Redeem Voucher</h1>
            </header>

            <div className="max-w-md mx-auto space-y-8">
                {/* Input Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800">
                    <form onSubmit={handleRedeem} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Enter Voucher Code
                            </label>
                            <input
                                type="text"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                placeholder="ABCD-EFGH-JK"
                                className="w-full text-center text-2xl font-mono font-bold tracking-widest p-4 rounded-xl border-2 border-gray-200 dark:border-neutral-700 focus:border-indigo-500 outline-none uppercase bg-transparent text-gray-900 dark:text-white"
                                disabled={status === "loading"}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!voucherCode || status === "loading"}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center transition-all active:scale-[0.98]"
                        >
                            {status === "loading" ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                "Verfiy & Redeem"
                            )}
                        </button>
                    </form>
                </div>

                {/* Result Card: Success */}
                {status === "success" && result && (
                    <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-6 border border-green-200 dark:border-green-900/30 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3 mb-4 text-green-700 dark:text-green-400">
                            <CheckCircle className="h-8 w-8" />
                            <h3 className="text-xl font-bold">Success!</h3>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 shadow-sm border border-green-100 dark:border-green-900/20">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Offer</p>
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white capitalize">
                                {result.claim.offerTitle}
                            </h4>

                            <hr className="my-3 border-gray-100 dark:border-neutral-800" />

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Discount</p>
                                    <p className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                                        {result.claim.discountType === 'percent' ? `${result.claim.discountValue}% OFF` :
                                            result.claim.discountType === 'fixed' ? `$${result.claim.discountValue} OFF` :
                                                "Free Item"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer</p>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {result.claim.userId}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-green-600 dark:text-green-500 font-medium">
                                Voucher marked as redeemed.
                            </p>
                        </div>
                    </div>
                )}

                {/* Result Card: Error */}
                {status === "error" && (
                    <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-900/30 animate-in shake">
                        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                            <AlertCircle className="h-8 w-8" />
                            <div>
                                <h3 className="text-lg font-bold">Redemption Failed</h3>
                                <p className="text-sm opacity-90">{errorMsg}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
