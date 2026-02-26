"use client";

import { X, User } from "lucide-react";
import { useState } from "react";

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string) => void;
    offerTitle: string;
    businessName: string;
}

export function ReservationModal({ isOpen, onClose, onConfirm, offerTitle, businessName }: ReservationModalProps) {
    const [name, setName] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
                onClick={onClose}
            />
            <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-neutral-800 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mt-2 text-center">
                    <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                        <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        Reservation Name
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Who is this reservation for?
                    </p>

                    <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-3 mb-6 border border-gray-100 dark:border-neutral-800">
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Claiming Offer</p>
                        <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{offerTitle}</p>
                        <p className="text-xs text-gray-500">{businessName}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full h-12 px-4 rounded-xl bg-gray-100 dark:bg-neutral-800 border-2 border-transparent focus:border-indigo-500 outline-none font-medium text-center text-lg placeholder:text-gray-400 transition-all focus:bg-white dark:focus:bg-neutral-900"
                                autoFocus
                            />
                        </div>

                        <button
                            onClick={() => {
                                if (name.trim()) onConfirm(name);
                            }}
                            disabled={!name.trim()}
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                        >
                            Confirm Reservation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
