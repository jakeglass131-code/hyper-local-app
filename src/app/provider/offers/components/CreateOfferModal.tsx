"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CreateOfferWizard } from "@/components/CreateOfferWizard";
import { Business } from "@/lib/store";

interface CreateOfferModalProps {
    onClose: () => void;
}

export function CreateOfferModal({ onClose }: CreateOfferModalProps) {
    const [businesses, setBusinesses] = useState<Business[]>([]);

    async function fetchBusinesses() {
        const res = await fetch("/api/businesses");
        const data = await res.json();
        setBusinesses(data);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchBusinesses();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Create New Offer</h2>
                        <p className="text-sm text-slate-600">Guided campaign setup with preview before launch.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    <CreateOfferWizard
                        userId="provider_123"
                        businesses={businesses}
                        onComplete={onClose}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
