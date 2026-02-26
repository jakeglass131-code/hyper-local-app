"use client";

import { useState, useEffect } from "react";
import { Card, Program } from "@/lib/store";
import { Plus, Search, Coffee, TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LogoHeader } from "@/components/consumer/LogoHeader";
import { useRouter } from "next/navigation";
import { FlyingStampAnimation } from "@/components/FlyingStampAnimation";

export default function WalletHomePage() {
    const router = useRouter();
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
    const [storageUpdate, setStorageUpdate] = useState(0); // Force re-render on storage change

    useEffect(() => {
        const handleStorage = () => setStorageUpdate(prev => prev + 1);
        window.addEventListener('storage', handleStorage);
        const interval = setInterval(handleStorage, 2000);
        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

    const [sortBy, setSortBy] = useState<"closest" | "recent" | "alpha">("closest");
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [activeAnimation, setActiveAnimation] = useState<{ x: number, y: number } | null>(null);

    // Mock savings data - in production, fetch from redemption history
    const [savingsThisMonth] = useState(46.30);
    const [savingsLastMonth] = useState(41.50);
    const [totalRedemptions] = useState(12);

    const userId = "user_123";

    useEffect(() => {
        fetchCards();
        fetchAvailablePrograms();
    }, [storageUpdate]);

    const fetchAvailablePrograms = async () => {
        try {
            const res = await fetch("/api/business");
            if (res.ok) {
                const data = await res.json();
                setAvailablePrograms(data);
            }
        } catch (e) {
            console.error("Failed to fetch programs", e);
        }
    };



    const fetchCards = async () => {
        try {
            const res = await fetch(`/api/card?userId=${userId}`);
            let fetchedCards: Card[] = [];
            if (res.ok) {
                const data = await res.json();
                fetchedCards = data ? [data] : [];
            }

            if (typeof window !== 'undefined') {
                const local = localStorage.getItem('demo_consumer_cards');
                if (local) {
                    const localCards = JSON.parse(local);
                    localCards.forEach((lc: Card) => {
                        if (!fetchedCards.find(fc => fc.id === lc.id)) {
                            fetchedCards.push(lc);
                        }
                    });
                }
            }
            setCards(fetchedCards);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const sortedCards = [...cards].sort((a, b) => {
        if (sortBy === "closest") {
            const progressA = a.stamps / 10;
            const progressB = b.stamps / 10;
            return progressB - progressA;
        } else if (sortBy === "recent") {
            const lastA = a.history[a.history.length - 1]?.timestamp || 0;
            const lastB = b.history[b.history.length - 1]?.timestamp || 0;
            return lastB - lastA;
        } else {
            return a.programId.localeCompare(b.programId);
        }
    });

    const filteredCards = sortedCards.filter((card) =>
        card.programId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter out programs the user already has
    const discoverablePrograms = availablePrograms.filter(p =>
        !cards.find(c => c.programId === p.id || c.programId === p.name)
    );

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="pb-20">
            <LogoHeader />

            <header className="bg-white px-4 py-6 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Your Wallet</h1>
                    <button
                        onClick={() => setShowSearchModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                        <Plus className="h-4 w-4" />
                        Add Card
                    </button>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Sort Options */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setSortBy("closest")}
                        className={cn(
                            "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all active:scale-95",
                            sortBy === "closest"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        By Progress
                    </button>
                    <button
                        onClick={() => setSortBy("alpha")}
                        className={cn(
                            "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all active:scale-95",
                            sortBy === "alpha"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        A-Z
                    </button>
                </div>


            </header>

            {/* Discover Section - Only show if new programs available */}
            {discoverablePrograms.length > 0 && (
                <div className="px-4 py-8 bg-[#eaf3ef] border-y border-[#d1e0d7]">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-[#1e6a67]" />
                        <h2 className="text-lg font-bold text-gray-900">New Programs Near You</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {discoverablePrograms.map((program) => (
                            <div
                                key={program.id}
                                className="min-w-[280px] bg-white rounded-2xl p-4 shadow-sm border border-[#d1e0d7] flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500"
                            >
                                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                                    {program.logo ? (
                                        <img src={program.logo} alt={program.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Coffee className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 truncate">{program.name}</h3>
                                    <p className="text-xs text-gray-500 mb-2">{program.stampsRequired} stamps for reward</p>
                                    <button
                                        onClick={async (e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setActiveAnimation({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

                                            const newCard = {
                                                id: `card_${Date.now()}`,
                                                programId: program.id,
                                                userId: "user_123",
                                                stamps: 0,
                                                history: []
                                            };
                                            const updatedCards = [...cards, newCard];
                                            setCards(updatedCards);
                                            // Persist for demo
                                            const existing = localStorage.getItem('demo_consumer_cards');
                                            const localCards = existing ? JSON.parse(existing) : [];
                                            localCards.push(newCard);
                                            localStorage.setItem('demo_consumer_cards', JSON.stringify(localCards));
                                            setStorageUpdate(s => s + 1);
                                        }}
                                        className="text-xs font-bold text-white bg-[#1e6a67] px-4 py-1.5 rounded-lg hover:opacity-90 transition-all active:scale-90"
                                    >
                                        Join Program
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cards Grid */}
            <div className="px-4 py-6">
                {filteredCards.length === 0 ? (
                    <div className="text-center py-12">
                        <Coffee className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Loyalty Cards Yet</h3>
                        <button onClick={() => setShowSearchModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"><Plus className="h-5 w-5" /> Add Your First Card</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCards.map((card) => {
                            let stampsRequired = 10;
                            let customStyle = {};
                            let customLogo = null;
                            if (typeof window !== 'undefined') {
                                const localProgram = localStorage.getItem('demo_loyalty_program');
                                if (localProgram) {
                                    try {
                                        const p = JSON.parse(localProgram);
                                        if (p.id === card.programId || p.name === card.programId) {
                                            if (p.stampsRequired) {
                                                stampsRequired = p.stampsRequired;
                                            }
                                            if (p.cardColor) {
                                                customStyle = { background: `linear-gradient(135deg, ${p.cardColor}, #1a1a1a)` };
                                            }
                                            if (p.logo) {
                                                // Enlarged logo as requested
                                                customLogo = <img src={p.logo} alt="Logo" className="w-12 h-12 object-cover rounded-full border-2 border-white/20" />;
                                            }
                                        }
                                    } catch (e) { }
                                }
                            }
                            const progress = Math.min(100, (card.stamps / stampsRequired) * 100);
                            return (
                                <Link
                                    key={card.id}
                                    href={`/consumer/wallet/${card.id}`}
                                    className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all active:scale-[0.98] duration-100"
                                >
                                    {/* Card Header */}
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white"
                                        style={customStyle}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            {customLogo || <Coffee className="h-8 w-8" />}
                                            <span className="text-sm font-medium bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                                                {card.stamps} / {stampsRequired}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg">{card.programId}</h3>
                                        <p className="text-xs text-white/80">Loyalty Program</p>
                                    </div>
                                    <div className="px-4 py-3">
                                        <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-600">Progress to Reward</span><span className="text-xs font-semibold text-indigo-600">{progress.toFixed(0)}%</span></div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
                                        <p className="text-xs text-gray-500 mt-2">{Math.max(0, stampsRequired - card.stamps)} more {Math.max(0, stampsRequired - card.stamps) === 1 ? 'stamp' : 'stamps'} to reward</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )
                }
            </div>

            {showSearchModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Add Loyalty Card</h2>
                            <button onClick={() => setShowSearchModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <Plus className="rotate-45" />
                            </button>
                        </div>
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input type="text" placeholder="Search businesses..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500" autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {(() => {
                                const results = [
                                    { name: "Daily Grind Coffee", category: "Cafe", logo: <Coffee className="w-5 h-5" /> },
                                    { name: "Bakers Delight", category: "Bakery", logo: <Coffee className="w-5 h-5" /> },
                                    { name: "Smoothie King", category: "Drinks", logo: <Coffee className="w-5 h-5" /> },
                                ];
                                if (typeof window !== 'undefined') {
                                    const localProgram = localStorage.getItem('demo_loyalty_program');
                                    if (localProgram) {
                                        try {
                                            const p = JSON.parse(localProgram);
                                            if (!results.find(r => r.name === p.name)) {
                                                results.unshift({ name: p.name, category: "Local Business", logo: p.logo || <Coffee className="w-5 h-5" /> });
                                            }
                                        } catch (e) { }
                                    }
                                }
                                return results.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((biz, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            const newCard = { id: `card_${Date.now()}`, programId: biz.name, userId: "user_123", stamps: 0, history: [] };
                                            if (!cards.find(c => c.programId === biz.name)) {
                                                const updatedCards = [...cards, newCard];
                                                setCards(updatedCards);
                                                if (typeof window !== 'undefined') {
                                                    const existing = localStorage.getItem('demo_consumer_cards');
                                                    const localCards = existing ? JSON.parse(existing) : [];
                                                    localCards.push(newCard);
                                                    localStorage.setItem('demo_consumer_cards', JSON.stringify(localCards));
                                                }
                                            }
                                            setShowSearchModal(false);
                                        }}
                                        className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group"
                                    >
                                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors overflow-hidden">
                                            {typeof biz.logo === 'string' ? <img src={biz.logo} alt={biz.name} className="w-full h-full object-cover" /> : biz.logo}
                                        </div>
                                        <div className="flex-1"><h3 className="font-bold text-gray-900">{biz.name}</h3><p className="text-sm text-gray-500">{biz.category}</p></div>
                                        <div className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">Add</div>
                                    </button>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            )}
            {/* Animations */}
            {activeAnimation && (
                <FlyingStampAnimation
                    startPosition={activeAnimation}
                    onComplete={() => setActiveAnimation(null)}
                />
            )}
        </div>
    );
}
