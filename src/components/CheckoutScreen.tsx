"use client";

import React from "react";
import { ChevronLeft, ChevronRight, CreditCard, MapPin, Tag, Info, ShoppingBag } from "lucide-react";

interface CheckoutScreenProps {
    planName: string;
    price: string;
    subtext: string;
    onBack: () => void;
    onPlaceOrder: () => void;
}

export function CheckoutScreen({ planName, price, subtext, onBack, onPlaceOrder }: CheckoutScreenProps) {
    // Extract price value for calculations
    const priceValue = parseFloat(price.replace('$', '').split('/')[0]) || 0;
    const tax = (priceValue * 0.08); // 8% mock tax
    const total = priceValue + tax;

    return (
        <div className="fixed inset-0 z-[110] bg-white text-gray-900 overflow-y-auto animate-in fade-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold">Review and place order</h1>
                <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            <div className="max-w-md mx-auto">
                {/* Order Summary */}
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-600 uppercase tracking-tight">Hyper Local Premium ({planName})</span>
                        <span className="font-medium">${priceValue.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-50">
                        <span className="text-gray-500">Subtotal</span>
                        <span>${priceValue.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-amber-800">
                        <div className="flex items-center gap-1">
                            <span>First week discount</span>
                            <Info size={14} className="text-amber-600" />
                        </div>
                        <span className="font-medium">-$0.00</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1">
                            <span>Estimated tax</span>
                            <Info size={14} className="text-gray-400" />
                        </div>
                        <span>${tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-gray-100">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={onPlaceOrder}
                            className="w-full bg-[#2A2A2A] text-white font-bold py-4 rounded-lg shadow-lg active:scale-[0.98] transition-all hover:bg-black"
                        >
                            Place order
                        </button>
                    </div>

                    <button className="w-full flex justify-between items-center py-4 border-b border-gray-100 text-sm font-medium">
                        <span>Add promo code</span>
                        <ChevronRight size={18} className="text-gray-400" />
                    </button>
                </div>

                <div className="h-2 bg-gray-50/80 w-full" />

                {/* Delivery & Payment Section */}
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">Subscription & Payment</h2>

                    <div className="space-y-6">
                        {/* Plan Item */}
                        <div className="flex items-center justify-between group cursor-pointer">
                            <div>
                                <p className="text-sm font-bold">Plan</p>
                                <p className="text-gray-500 text-sm">Hyper Local Premium - {planName}</p>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </div>

                        {/* Billing Address (Replaced Shipping) */}
                        <div className="flex items-center justify-between group cursor-pointer">
                            <div>
                                <p className="text-sm font-bold">Billing address</p>
                                <p className="text-gray-500 text-sm">Alex Smith</p>
                                <p className="text-gray-500 text-sm">1226 University Drive Menlo Park CA 94025-4221</p>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </div>

                        {/* Payment Method */}
                        <div className="flex items-center justify-between group cursor-pointer">
                            <div className="flex-1">
                                <p className="text-sm font-bold">Payment method</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-[8px] text-white font-bold">
                                        MASTER
                                    </div>
                                    <p className="text-gray-500 text-sm">•••• 4242 Exp 12/26</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </div>

                        {/* Payment Option */}
                        <div className="group">
                            <p className="text-sm font-bold">Subscription terms</p>
                            <p className="text-gray-500 text-sm mt-1">Automatic renewal {planName.toLowerCase() === 'monthly' ? 'every month' : 'every year'}.</p>
                            <p className="text-xs text-gray-400 mt-2">You'll be charged when your trial ends. Cancel anytime in profile settings.</p>
                        </div>
                    </div>
                </div>

                {/* Footer Brand */}
                <div className="p-8 pb-12 flex flex-col items-center justify-center opacity-40">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-black text-white rounded-md flex items-center justify-center text-[10px] font-bold">HL</div>
                        <span className="text-xs font-bold uppercase tracking-widest">Hyper Local</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
