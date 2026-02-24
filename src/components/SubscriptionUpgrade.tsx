"use client";

import React from "react";
import { X, Check, Bell } from "lucide-react";

import { CheckoutScreen } from "./CheckoutScreen";

interface SubscriptionUpgradeProps {
    onClose: () => void;
}

const PLANS = {
    YEARLY: {
        id: 'yearly',
        name: 'Yearly',
        price: '$69.99/year',
        subtext: '$5.83/mo',
        fullName: '7-Day Free Trial'
    },
    MONTHLY: {
        id: 'monthly',
        name: 'Monthly',
        price: '$14.99/month',
        subtext: '',
        fullName: 'Monthly'
    }
};

export function SubscriptionUpgrade({ onClose }: SubscriptionUpgradeProps) {
    const [view, setView] = React.useState<'pricing' | 'checkout'>('pricing');
    const [selectedPlanId, setSelectedPlanId] = React.useState<string>('yearly');

    const selectedPlan = selectedPlanId === 'yearly' ? PLANS.YEARLY : PLANS.MONTHLY;

    const handleSubscribe = () => {
        setView('checkout');
    };

    const handlePlaceOrder = () => {
        alert("Subscription successful! Welcome to Hyper Local Premium.");
        onClose();
    };

    if (view === 'checkout') {
        return (
            <CheckoutScreen
                planName={selectedPlan.fullName}
                price={selectedPlan.price}
                subtext={selectedPlan.subtext}
                onBack={() => setView('pricing')}
                onPlaceOrder={handlePlaceOrder}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-[#0E1B31] text-white overflow-y-auto animate-slide-up-modal">
            {/* Header */}
            <div className="p-6 flex justify-between items-center opacity-0 animate-pop-in [animation-delay:200ms]">
                <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="max-w-md mx-auto px-6 pb-12">
                {/* Hero section */}
                <div className="text-center mt-4 mb-10 opacity-0 animate-pop-in [animation-delay:300ms]">
                    <h1 className="text-3xl font-bold leading-tight px-4">
                        Your plan is ready. Unlock Hyper Local Premium
                    </h1>
                </div>

                {/* Trial Section */}
                <div className="mb-8 opacity-0 animate-pop-in [animation-delay:400ms]">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-2">
                        Get started with a free trial
                    </h2>

                    <button
                        onClick={() => setSelectedPlanId('yearly')}
                        className={`w-full bg-[#1A2C49] border-2 rounded-2xl p-5 text-left flex justify-between items-center group active:scale-[0.98] transition-all ${selectedPlanId === 'yearly' ? 'border-white' : 'border-white/10'
                            }`}
                    >
                        <div>
                            <p className="font-bold text-lg">7-Day Free Trial</p>
                            <p className="text-sm text-gray-400">$69.99/year ($5.83/mo)</p>
                        </div>
                        <div className="bg-[#2ECC71] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                            Save 58%
                        </div>
                    </button>
                </div>

                {/* No Trial Section */}
                <div className="mb-10 opacity-0 animate-pop-in [animation-delay:500ms]">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-2">
                        Other options
                    </h2>

                    <button
                        onClick={() => setSelectedPlanId('monthly')}
                        className={`w-full bg-[#1A2C49] border border-white/10 rounded-2xl p-5 text-left flex justify-between items-center hover:border-white/30 transition-all active:scale-[0.98] ${selectedPlanId === 'monthly' ? 'ring-2 ring-white' : ''
                            }`}
                    >
                        <div>
                            <p className="font-bold text-lg">Monthly</p>
                            <p className="text-sm text-gray-400">$14.99/month</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center ${selectedPlanId === 'monthly' ? 'bg-indigo-600 border-transparent' : ''
                            }`}>
                            <div className={`w-3 h-3 rounded-full ${selectedPlanId === 'monthly' ? 'bg-white' : 'bg-transparent'
                                }`}></div>
                        </div>
                    </button>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-12 opacity-0 animate-pop-in [animation-delay:600ms]">
                    <FeatureItem text="Unlimited offer creations" />
                    <FeatureItem text="Advanced customer analytics" />
                    <FeatureItem text="Priority support" />
                    <FeatureItem text="Featured business placement" />
                </div>

                {/* CTA */}
                <div className="sticky bottom-0 pb-6 bg-[#0E1B31] opacity-0 animate-pop-in [animation-delay:700ms]">
                    <button
                        onClick={handleSubscribe}
                        className="w-full bg-white text-[#0E1B31] font-bold py-4 rounded-full text-lg shadow-xl active:scale-95 transition-all"
                    >
                        {selectedPlanId === 'yearly' ? 'Try Free & Subscribe' : 'Subscribe Now'}
                    </button>

                    <div className="mt-6 flex items-center justify-center gap-3 bg-white/5 rounded-2xl p-4">
                        <Bell size={20} className="text-indigo-400" />
                        <span className="text-sm font-medium">Remind me 2 days before renewal</span>
                        <div className="ml-auto w-10 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                            <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        CANCEL ANYTIME IN THE APP STORE
                    </p>
                </div>
            </div>
        </div>
    );
}


function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 px-2">
            <div className="w-5 h-5 rounded-full bg-[#2ECC71]/20 flex items-center justify-center">
                <Check size={12} className="text-[#2ECC71]" strokeWidth={3} />
            </div>
            <span className="text-sm font-medium text-gray-200">{text}</span>
        </div>
    );
}
