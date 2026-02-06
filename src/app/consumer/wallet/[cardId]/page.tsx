"use client";

import { useState, useEffect } from "react";
import { Card } from "@/lib/store";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Coffee, Gift, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CardDetailPage() {
    const params = useParams();
    const cardId = params.cardId as string;

    const [card, setCard] = useState<Card | null>(null);
    const [loading, setLoading] = useState(true);
    const [tokenData, setTokenData] = useState<{
        token: string;
        shortCode: string;
        expiresAt: number;
        type: "STAMP" | "REWARD";
    } | null>(null);

    useEffect(() => {
        fetchCard();
    }, [cardId]);

    const fetchCard = async () => {
        try {
            const userId = "user_123";
            const res = await fetch(`/api/card?userId=${userId}`);
            let foundCard = null;

            if (res.ok) {
                const data = await res.json();
                // Check if this is the right card
                if (data && data.id === cardId) {
                    foundCard = data;
                }
            }

            // If not found in API, check localStorage for demo cards
            if (!foundCard && typeof window !== 'undefined') {
                const local = localStorage.getItem('demo_consumer_cards');
                if (local) {
                    const localCards = JSON.parse(local);
                    foundCard = localCards.find((c: Card) => c.id === cardId);
                }
            }

            if (foundCard) {
                setCard(foundCard);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const generateToken = async (type: "stamp" | "reward") => {
        if (!card) return;
        const res = await fetch(`/api/token/${type}`, {
            method: "POST",
            body: JSON.stringify({ cardId: card.id }),
        });
        const data = await res.json();
        if (data.error) {
            alert(data.error);
            return;
        }
        setTokenData({ ...data, type: type.toUpperCase() });
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!card) return <div className="p-8">Card not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white px-4 py-6 border-b border-gray-200 sticky top-0 z-10">
                <Link href="/consumer/wallet" className="flex items-center text-indigo-600 mb-3">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Wallet
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Card Details</h1>
            </header>

            <main className="px-4 py-6 max-w-2xl mx-auto">
                <div className="space-y-6">
                    {/* Card Detail View */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                            <h2 className="text-xl font-bold">{card.programId}</h2>
                            <p className="text-indigo-100 text-sm mt-1">Earn 10 stamps for a free coffee</p>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-bold">{card.stamps}</span>
                                <span className="text-indigo-100 ml-2">/ 10 stamps</span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-5 gap-3 mb-6">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "aspect-square rounded-full flex items-center justify-center border-2",
                                            i < card.stamps
                                                ? "bg-indigo-100 border-indigo-600 text-indigo-600"
                                                : "bg-gray-50 border-gray-200 text-gray-300"
                                        )}
                                    >
                                        <Coffee className="h-5 w-5" />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    onClick={() => generateToken("stamp")}
                                    className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                >
                                    Request Stamp
                                </button>
                                <button
                                    onClick={() => generateToken("reward")}
                                    disabled={card.stamps < 10}
                                    className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Gift className="mr-2 h-4 w-4" /> Redeem
                                </button>
                            </div>

                            {/* History */}
                            {card.history.length > 0 && (
                                <div className="border-t border-gray-100 pt-4">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
                                    <div className="space-y-2">
                                        {card.history
                                            .slice(-5)
                                            .reverse()
                                            .map((item, i) => (
                                                <div key={i} className="flex justify-between text-xs">
                                                    <span className={item.action === "STAMP" ? "text-green-600" : "text-purple-600"}>
                                                        {item.action === "STAMP" ? "Stamp earned" : "Reward redeemed"}
                                                    </span>
                                                    <span className="text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Token Modal */}
            {tokenData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="relative w-full max-w-sm">
                        <button onClick={() => setTokenData(null)} className="absolute -top-12 right-0 text-white font-bold">
                            Close
                        </button>
                        <QRCodeDisplay
                            value={tokenData.token}
                            shortCode={tokenData.shortCode}
                            expiresAt={tokenData.expiresAt}
                            type={tokenData.type}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
