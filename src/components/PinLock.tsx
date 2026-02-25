"use client";

import { useState } from "react";
import { Delete, Lock } from "lucide-react";

export function PinLock({ onUnlock }: { onUnlock: () => void }) {
    const [pin, setPin] = useState("");

    const handlePress = (num: string) => {
        if (pin.length >= 4) return;

        const newPin = pin + num;
        setPin(newPin);

        if (newPin.length === 4) {
            // Temporarily allowing any 4 digits to unlock
            setTimeout(() => {
                onUnlock();
            }, 100);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-white via-slate-50 to-slate-100 p-6">
            <div className="mb-10 text-center">
                <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-200 bg-white text-[#3744D2]">
                    <Lock className="h-9 w-9" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Secure Access</h2>
                <p className="mt-1 text-sm text-slate-600">Enter your 4-digit merchant PIN</p>
            </div>

            <div className="mb-12 flex gap-4">
                {[0, 1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className={`h-3.5 w-3.5 rounded-full transition-all ${index < pin.length ? "bg-[#3744D2]" : "bg-slate-300"}`}
                    />
                ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        onClick={() => handlePress(num.toString())}
                        className="h-16 w-16 rounded-2xl border border-slate-200 bg-white text-xl font-black text-slate-900 shadow-sm hover:border-[#3744D2]/35"
                    >
                        {num}
                    </button>
                ))}
                <div />
                <button
                    onClick={() => handlePress("0")}
                    className="h-16 w-16 rounded-2xl border border-slate-200 bg-white text-xl font-black text-slate-900 shadow-sm hover:border-[#3744D2]/35"
                >
                    0
                </button>
                <button
                    onClick={() => setPin((prev) => prev.slice(0, -1))}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-[#3744D2]/35 hover:text-[#3744D2]"
                >
                    <Delete className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}
