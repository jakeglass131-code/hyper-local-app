"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CreateOfferWizard } from "@/components/CreateOfferWizard";
import { Business } from "@/lib/store";

interface CreateOfferModalProps {
    onClose: () => void;
}

export function CreateOfferModal({ onClose }: CreateOfferModalProps) {
    const [businesses, setBusinesses] = useState<Business[]>([]);

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        const res = await fetch("/api/businesses");
        const data = await res.json();
        setBusinesses(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
                <div className="sticky top-0 bg-neutral-900 border-b border-white/10 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Create New Offer</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6">
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
