"use client";

import { useEffect, useRef, useState } from "react";
import {
    Activity,
    Send,
    Sparkles,
    X
} from "lucide-react";
import { PinLock } from "@/components/PinLock";
import { BusinessAnalytics } from "@/components/BusinessAnalytics";
import { store } from "@/lib/store";

type ChatMessage = { role: "user" | "ai"; text: string };

export default function ProviderAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const [advancedData, setAdvancedData] = useState<ReturnType<typeof store.getAdvancedAnalytics>>(
        () => store.getAdvancedAnalytics("main_street_coffee")
    );

    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "ai", text: "Welcome back. I've analyzed your performance. Metrics are trending upwards. Your 'Lunch Special' is peaking right now." },
    ]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (showChat) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, showChat]);

    const handleFilterChange = (start: number, end: number) => {
        const newData = store.getAdvancedAnalytics("main_street_coffee", start, end);
        setAdvancedData(newData);
    };

    const handleSendMessage = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
        setInput("");

        setTimeout(() => {
            let response = "You should keep your strongest campaign between 11:30 AM and 2:30 PM for the next three days.";
            if (userMsg.toLowerCase().includes("cost")) {
                response = "Estimated cost per redeemed customer is currently $3.70, down 8% week-on-week.";
            }
            if (userMsg.toLowerCase().includes("segment")) {
                response = "Gym and wellness has the highest conversion today at 13.4%. Prioritize that audience first.";
            }
            setMessages((prev) => [...prev, { role: "ai", text: response }]);
        }, 700);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-[#3744D2] font-black animate-pulse uppercase tracking-[0.2em] text-lg">
                    Initialising Intelligence...
                </div>
            </div>
        );
    }

    if (isLocked) {
        return <PinLock onUnlock={() => setIsLocked(false)} />;
    }

    return (
        <div className="pb-32 px-4 py-8 relative min-h-screen bg-white">
            <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3744D2] mb-1">SYSTEM ANALYTICS</p>
                    <h1 className="text-4xl font-black text-[#3744D2] tracking-tighter uppercase">ANALYTICS HUB</h1>
                    <p className="text-sm text-slate-400 mt-1 font-bold">
                        Interactive Performance & Revenue Heatmap
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-[#3744D2]/20 bg-[#3744D2]/5 px-4 py-2 text-[10px] font-black text-[#3744D2] uppercase tracking-widest shadow-sm">
                    <Activity className="h-3.5 w-3.5 animate-pulse" />
                    Live Terminal
                </div>
            </header>

            {advancedData && (
                <BusinessAnalytics
                    data={advancedData}
                    onFilterChange={handleFilterChange}
                />
            )}

            {/* AI Floating Button */}
            <button
                onClick={() => setShowChat(true)}
                className="fixed bottom-28 right-6 w-16 h-16 rounded-[2rem] bg-[#3744D2] shadow-2xl shadow-[#3744D2]/40 flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all text-white border border-white/20"
                aria-label="Open AI strategist"
            >
                <Sparkles className="h-7 w-7" />
            </button>

            {/* AI Chat Overlay */}
            {showChat && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="w-full sm:max-w-md h-[85vh] sm:h-[80vh] bg-white sm:rounded-[2.5rem] border-t sm:border border-slate-200 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 duration-500">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#3744D2]/10 flex items-center justify-center border border-[#3744D2]/10">
                                    <Sparkles className="w-7 h-7 text-[#3744D2]" />
                                </div>
                                <div>
                                    <h3 className="font-black text-[#3744D2] tracking-tight uppercase text-sm italic">AI STRATEGIST</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#3744D2] animate-pulse" />
                                        <span className="text-[10px] font-black text-[#3744D2]/60 uppercase tracking-widest">Active Insight</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setShowChat(false)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed font-bold shadow-sm ${msg.role === 'user'
                                        ? 'bg-[#3744D2] text-white rounded-tr-none'
                                        : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-8 border-t border-slate-100 bg-slate-50/30">
                            <div className="flex gap-4">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask for strategy advice..."
                                    className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-5 text-sm text-slate-900 outline-none focus:border-[#3744D2] transition-colors font-bold placeholder:text-slate-400 shadow-sm"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim()}
                                    className="p-5 bg-[#3744D2] text-white rounded-2xl disabled:opacity-50 active:scale-95 transition-transform shadow-lg shadow-[#3744D2]/20 border border-white/10"
                                >
                                    <Send className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
