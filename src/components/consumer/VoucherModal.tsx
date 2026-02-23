import { X, Copy, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VoucherModalProps {
    isOpen: boolean;
    onClose: () => void;
    voucherCode: string;
    expiresAt: number;
    offerTitle: string;
    businessName: string;
}

export function VoucherModal({ isOpen, onClose, voucherCode, expiresAt, offerTitle, businessName }: VoucherModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(voucherCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTimeRemaining = (expiry: number) => {
        const diff = expiry - Date.now();
        if (diff <= 0) return "Expired";
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m remaining`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative">

                {/* Header */}
                <div className="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <h3 className="font-bold text-lg mb-1 relative z-10">{businessName}</h3>
                    <p className="text-indigo-100 text-sm relative z-10">{offerTitle}</p>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                        Your Voucher Code
                    </p>

                    {/* Code Display */}
                    <div className="bg-gray-100 dark:bg-neutral-800 rounded-2xl px-6 py-4 mb-6 border-2 border-dashed border-gray-300 dark:border-neutral-700 w-full text-center">
                        <span className="font-mono text-3xl font-bold tracking-widest text-gray-900 dark:text-white">
                            {voucherCode}
                        </span>
                    </div>

                    {/* Expiry */}
                    <div className="flex items-center text-orange-600 dark:text-orange-500 font-medium text-sm mb-8 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full">
                        <Clock className="h-4 w-4 mr-1.5" />
                        {formatTimeRemaining(expiresAt)}
                    </div>

                    {/* Actions */}
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "w-full py-3.5 rounded-xl font-bold flex items-center justify-center transition-all active:scale-[0.98]",
                            copied
                                ? "bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-none"
                                : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
                        )}
                    >
                        {copied ? (
                            <>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="h-5 w-5 mr-2" />
                                Copy Code
                            </>
                        )}
                    </button>

                    <p className="mt-4 text-xs text-center text-gray-400 dark:text-gray-500">
                        Show this code to staff to redeem.
                    </p>
                </div>
            </div>
        </div>
    );
}
