"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, Users, Eye, Gift, CheckCircle, MessageSquare, Send, X, Sparkles } from "lucide-react";
import { useMerchantStore } from "@/store/merchantStore";
import { PinLock } from "@/components/PinLock";

export default function ProviderAnalyticsPage() {
    const { analytics, redemptions } = useMerchantStore();
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: "Hello! I'm your business insights assistant. Ask me anything about your performance." }
    ]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 300);
    }, []);

    useEffect(() => {
        if (showChat) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, showChat]);

    const handleSendMessage = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");

        // Mock AI response
        setTimeout(() => {
            let aiResponse = "I noticed your coffee offers are performing exceptionally well this week!";
            if (userMsg.toLowerCase().includes("revenue")) {
                aiResponse = "Your revenue is up 15% compared to last week. The '50% Off Coffee' offer contributed the most.";
            } else if (userMsg.toLowerCase().includes("customer")) {
                aiResponse = "You gained 12 new customers yesterday. Retention rate is steady at 70%.";
            } else if (userMsg.toLowerCase().includes("improve")) {
                aiResponse = "Try launching a 'Happy Hour' offer between 2-4 PM to boost afternoon traffic.";
            }

            setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
        }, 1000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white/60">Loading...</div>
            </div>
        );
    }

    if (isLocked) {
        return <PinLock onUnlock={() => setIsLocked(false)} />;
    }

    return (
        <div className="pb-24 px-4 py-6 relative min-h-screen">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-sm text-white/60 mt-1">
                    Track your offer performance and customer engagement
                </p>
            </header>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                        <Eye className="h-4 w-4" />
                        <span className="text-xs">Total Views</span>
                    </div>
                    <div className="text-2xl font-bold">{analytics.totalViews}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                        <Users className="h-4 w-4" />
                        <span className="text-xs">Total Claims</span>
                    </div>
                    <div className="text-2xl font-bold">{analytics.totalClaims}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                        <Gift className="h-4 w-4" />
                        <span className="text-xs">Redemptions</span>
                    </div>
                    <div className="text-2xl font-bold">{analytics.totalRedemptions}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs">Conversion</span>
                    </div>
                    <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
                </div>
            </div>

            {/* Recent Redemptions */}
            <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4 mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Recent Redemptions
                </h3>
                {redemptions.length === 0 ? (
                    <div className="text-center text-white/40 py-8">
                        No redemptions yet
                    </div>
                ) : (
                    <div className="space-y-3">
                        {redemptions.slice(0, 10).map((redemption, index) => (
                            <div
                                key={`${redemption.id}-${index}`}
                                className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50 border border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Gift className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {redemption.type === "OFFER" ? "Offer Redeemed" : "Reward Claimed"}
                                        </p>
                                        <p className="text-xs text-white/40">
                                            {new Date(redemption.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs text-white/60 font-mono">
                                    {redemption.id.substring(0, 8).toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
                <h3 className="font-semibold mb-4">Performance Over Time</h3>
                <div className="text-center text-white/40 py-8">
                    Chart placeholder - integrate charting library
                </div>
            </div>

            {/* AI Assistant Floating Button */}
            <button
                onClick={() => setShowChat(true)}
                className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center z-40 hover:scale-105 transition-transform"
            >
                <Sparkles className="w-6 h-6 text-white" />
            </button>

            {/* AI Chat Overlay */}
            {showChat && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
                    <div className="w-full sm:max-w-md h-[80vh] bg-neutral-900 sm:rounded-3xl border border-white/10 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-neutral-800/50 rounded-t-3xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold">AI Insights</h3>
                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/10 rounded-full">
                                <X className="w-6 h-6 text-white/60" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                                            : 'bg-neutral-800 text-white/90 rounded-tl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-neutral-800/30">
                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask about your performance..."
                                    className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim()}
                                    className="p-3 bg-indigo-500 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
