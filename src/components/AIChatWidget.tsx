"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type Message = {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: number;
};

export function AIChatWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            text: "Greetings! 🧠 I'm your HyperLocal Genius. I've analyzed all 42 active deals in your vicinity. What are you in the mood for?",
            sender: "ai",
            timestamp: Date.now(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMounted(true);
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    // Don't show on business dashboard
    if (pathname?.startsWith("/business")) {
        return null;
    }

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI thinking and response
        setTimeout(() => {
            const responseText = generateResponse(userMsg.text);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: "ai",
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1200);
    };

    const generateResponse = (text: string): string => {
        const lower = text.toLowerCase();

        // Genius Logic 🧠
        if (lower.includes("coffee") || lower.includes("caffeine") || lower.includes("latte")) {
            return "Based on your location and current time, 'Brew Haven' is the optimal choice. They have a 50% off deal on single-origin lattes. It's rated 4.8/5 by coffee aficionados. ☕️✨";
        }
        if (lower.includes("lunch") || lower.includes("dinner") || lower.includes("hungry") || lower.includes("food")) {
            return "I've detected a hunger spike! 📉📈 'The Burger Joint' has a high-value offer: Free Fries with any burger. Alternatively, 'Urban Wellness' offers a nutrient-dense bowl at 30% off. Which culinary path shall we take? 🍔🥗";
        }
        if (lower.includes("cheap") || lower.includes("budget") || lower.includes("deal")) {
            return "Calculating maximum savings... 🧮 The 'Ending Soon' tab contains a 70% off clearance at 'Retail Therapy'. That is statistically the best value per dollar right now.";
        }
        if (lower.includes("date") || lower.includes("romantic")) {
            return "For a romantic atmosphere, my algorithms suggest 'Sunset Bar'. They have a 2-for-1 cocktail hour starting in 45 minutes. The ambiance score is in the 95th percentile. 🍸🌹";
        }
        if (lower.includes("hello") || lower.includes("hi")) {
            return "Hello! My neural networks are primed to find you the best local experiences. Try asking about 'coffee', 'lunch', or 'best value'.";
        }

        return "Interesting query. While I cross-reference that with our live inventory, I suggest checking the 'Trending' tab. My predictive models indicate those deals will sell out within the hour. 🔥";
    };

    return (
        <>
            {/* Floating Button - Lower z-index to not block modals */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-24 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
                    isOpen ? "bg-red-500 hover:bg-red-600" : "bg-brand hover:bg-brand-dark"
                )}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="h-7 w-7 text-white" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7181FF] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#3744D2]"></span>
                        </span>
                    </div>
                )}
            </button>

            {/* Chat Window - Lower z-index */}
            <div
                className={cn(
                    "fixed bottom-40 right-6 z-30 w-[350px] overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-gray-200 dark:border-neutral-800 transition-all duration-300 origin-bottom-right",
                    isOpen
                        ? "scale-100 opacity-100 translate-y-0"
                        : "scale-95 opacity-0 translate-y-10 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-brand to-[#5c68ff] p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Genius Concierge</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-[#7181FF]"></span>
                                <span className="text-xs font-medium text-white/80">Online & Calculating</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-neutral-950/50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-max max-w-[80%] flex-col gap-1 rounded-2xl px-4 py-2 text-sm shadow-sm",
                                msg.sender === "user"
                                    ? "ml-auto bg-brand text-white rounded-br-none"
                                    : "bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-neutral-700"
                            )}
                        >
                            {msg.text}
                            <span className={cn(
                                "text-[10px] opacity-70",
                                msg.sender === "user" ? "text-brand-light" : "text-gray-400"
                            )}>
                                {mounted ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                            </span>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex w-max max-w-[80%] items-center gap-1 rounded-2xl rounded-bl-none bg-white dark:bg-neutral-800 px-4 py-3 shadow-sm border border-gray-100 dark:border-neutral-700">
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-0"></span>
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-150"></span>
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-300"></span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask the genius..."
                            className="w-full rounded-full bg-gray-100 dark:bg-neutral-800 py-2.5 pl-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-brand text-gray-900 dark:text-white placeholder:text-gray-500"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-1.5 rounded-full bg-brand p-1.5 text-white transition-colors hover:bg-brand-dark disabled:bg-gray-300 dark:disabled:bg-neutral-700"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="mt-2 flex justify-center">
                        <span className="flex items-center text-[10px] text-gray-400">
                            <Sparkles className="mr-1 h-3 w-3 text-brand-light" />
                            Powered by HyperLocal Genius AI
                        </span>

                    </div>
                </form>
            </div>
        </>
    );
}

export default AIChatWidget;
