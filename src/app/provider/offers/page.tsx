"use client";

import { useState } from "react";
import { PlusCircle, List } from "lucide-react";
import { CreateOfferModal } from "./components/CreateOfferModal";
import { CurrentOffersModal } from "./components/CurrentOffersModal";

export default function ProviderOffersPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCurrentModal, setShowCurrentModal] = useState(false);

    return (
        <>
            <div className="pb-24 px-4 py-6 min-h-screen flex flex-col items-center justify-center">
                <div className="max-w-md w-full space-y-6">
                    <header className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Offers</h1>
                        <p className="text-white/60">
                            Create new offers or manage existing ones
                        </p>
                    </header>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Create Offer Button */}
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl p-8 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h2 className="text-2xl font-bold mb-2">Create Offer</h2>
                                    <p className="text-white/80 text-sm">
                                        Launch a new promotion for your customers
                                    </p>
                                </div>
                                <PlusCircle className="h-12 w-12 opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        {/* Current Offers Button */}
                        <button
                            onClick={() => setShowCurrentModal(true)}
                            className="group relative overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl p-8 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <h2 className="text-2xl font-bold mb-2">Current Offers</h2>
                                    <p className="text-white/80 text-sm">
                                        View and manage your active offers
                                    </p>
                                </div>
                                <List className="h-12 w-12 opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateOfferModal onClose={() => setShowCreateModal(false)} />
            )}
            {showCurrentModal && (
                <CurrentOffersModal onClose={() => setShowCurrentModal(false)} />
            )}
        </>
    );
}
