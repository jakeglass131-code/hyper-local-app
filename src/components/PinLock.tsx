"use client";

import { useState } from "react";
import { Lock, Delete } from "lucide-react";

interface PinLockProps {
    onUnlock: () => void;
    correctPin?: string; // Optional, if we want to validate against a specific PIN
}

export function PinLock({ onUnlock, correctPin = "1234" }: PinLockProps) {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    const handlePress = (num: string) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            setError(false);

            if (newPin.length === 4) {
                if (newPin === correctPin) {
                    onUnlock();
                } else {
                    setError(true);
                    setTimeout(() => setPin(""), 500);
                }
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
        setError(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6">
            <div className="mb-8 flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${error ? "bg-red-500/20 text-red-500" : "bg-white/10 text-white"}`}>
                    <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold mb-2">Enter PIN</h2>
                <p className="text-white/60 text-sm">Please enter your 4-digit security PIN</p>
            </div>

            {/* PIN Dots */}
            <div className="flex gap-4 mb-12">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`w-4 h-4 rounded-full transition-all ${i < pin.length
                                ? error ? "bg-red-500" : "bg-indigo-500"
                                : "bg-white/20"
                            }`}
                    />
                ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-6 w-full max-w-xs">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        onClick={() => handlePress(num.toString())}
                        className="w-20 h-20 rounded-full bg-neutral-800 text-2xl font-bold hover:bg-neutral-700 active:scale-95 transition-all"
                    >
                        {num}
                    </button>
                ))}
                <div /> {/* Empty slot */}
                <button
                    onClick={() => handlePress("0")}
                    className="w-20 h-20 rounded-full bg-neutral-800 text-2xl font-bold hover:bg-neutral-700 active:scale-95 transition-all"
                >
                    0
                </button>
                <button
                    onClick={handleDelete}
                    className="w-20 h-20 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                >
                    <Delete className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
}
