"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Target, BarChart3, ArrowRight, Sparkles } from "lucide-react";

const FEATURES = [
    {
        id: "analytics",
        label: "Track",
        title: "Growth",
        prefix: "Real-time",
        description: "Experience total clarity with AI-driven analytics that reveal exactly how your business is scaling.",
        color: "from-[#7C3AED] to-[#4C1D95]", // Brand Violet
        accent: "#7C3AED",
        card: {
            metric: "$12,482",
            change: "+14.2%",
            label: "Revenue this week",
            graph: [40, 70, 45, 90, 65, 80, 50]
        }
    },
    {
        id: "marketing",
        label: "Reach",
        title: "Customers",
        prefix: "Smart",
        description: "Targeted local marketing that puts your best offers in front of the people most likely to visit.",
        color: "from-[#BEF264] to-[#4D7C0F]", // Accent Lime
        accent: "#BEF264",
        card: {
            metric: "2,840",
            change: "+32.5%",
            label: "Active local reach",
            graph: [30, 45, 60, 55, 75, 90, 95]
        }
    },
    {
        id: "loyalty",
        label: "Build",
        title: "Loyalty",
        prefix: "Seamless",
        description: "Turn casual explorers into loyal advocates with automated precision engagement and rewards.",
        color: "from-[#7C3AED] via-[#BEF264] to-[#7C3AED]", // Transition blend
        accent: "#BEF264",
        card: {
            metric: "84%",
            change: "+8.7%",
            label: "Retention Rate",
            graph: [60, 65, 62, 70, 75, 82, 84]
        }
    }
];

export function BusinessShowcase() {
    const [index, setIndex] = useState(0);
    const feature = FEATURES[index];

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % FEATURES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-[800px] flex flex-col items-center justify-center overflow-hidden py-20 px-6">
            {/* Background elements */}
            <div className={`absolute inset-0 transition-colors duration-1000 bg-gradient-to-b opacity-10 ${feature.color.replace('from-', 'from-').replace('to-', 'to-')}`} />

            {/* Animated Circles/Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px]">
                <div
                    className={`absolute inset-0 blur-[120px] rounded-full transition-all duration-1000 bg-gradient-to-br ${feature.color} opacity-20`}
                />
            </div>

            {/* Headline Area */}
            <div className="relative z-10 text-center mb-16 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white/80">Hyper Local for Business</span>
                </div>

                <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8">
                    <span className="opacity-60">{feature.prefix} </span>
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r ${feature.color} transition-all duration-700`}>
                        {feature.label}
                    </span>
                    <br />
                    <span>up to </span>
                    <span className="transition-all duration-700">{feature.card.change.replace('+', '')}</span>
                </h2>

                <p className="text-xl text-white/60 leading-relaxed mb-10 transition-all duration-500">
                    {feature.description}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2`}>
                        Start Growing Now
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all">
                        View Demo
                    </button>
                </div>
            </div>

            {/* Central 3D Card Showcase */}
            <div className="relative z-10 w-full max-w-5xl h-[500px] perspective-1000">
                {/* Decorative Stones/Objects inspired by Legend */}
                <div className="absolute -left-20 bottom-10 w-40 h-24 bg-zinc-800 rounded-[2rem] blur-sm rotate-12 opacity-40 mix-blend-overlay" />
                <div className="absolute -right-10 top-0 w-32 h-32 bg-zinc-700 rounded-full blur-md opacity-30 mix-blend-overlay" />

                {/* Floating Card */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm">
                    <div className="relative group transition-all duration-700 transform hover:rotate-2">
                        {/* Glow effect */}
                        <div className={`absolute -inset-1 rounded-[2.5rem] blur-xl opacity-40 bg-gradient-to-r ${feature.color} transition-all duration-1000 group-hover:opacity-60`} />

                        {/* The Actual Card */}
                        <div className="relative bg-[#121212] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-3xl overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                                    <BarChart3 className={`w-6 h-6 transition-colors duration-700`} style={{ color: feature.accent }} />
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-700 ${feature.id === 'analytics' ? 'bg-blue-500/20 text-blue-400' : feature.id === 'marketing' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                    {feature.card.change}
                                </div>
                            </div>

                            <h4 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-1">
                                {feature.card.label}
                            </h4>
                            <div className="text-5xl font-bold text-white mb-8 tracking-tight">
                                {feature.card.metric}
                            </div>

                            {/* Animated Graph */}
                            <div className="h-32 flex items-end gap-2 mb-4">
                                {feature.card.graph.map((val, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-t-lg transition-all duration-1000 animate-in fade-in slide-in-from-bottom duration-1000`}
                                        style={{
                                            height: `${val}%`,
                                            backgroundColor: feature.accent,
                                            opacity: 0.2 + (i / 10),
                                            transitionDelay: `${i * 100}ms`
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#121212] bg-zinc-800" />
                                    ))}
                                </div>
                                <span className="text-xs font-semibold text-white/40">Real-time Activity</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Cards (Peeking) */}
                <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-full w-64 h-80 bg-white/5 border border-white/10 rounded-[2rem] blur-[2px] rotate-[-15deg] opacity-20 hidden md:block" />
                <div className="absolute right-1/4 top-1/2 -translate-y-1/2 translate-x-full w-64 h-80 bg-white/5 border border-white/10 rounded-[2rem] blur-[2px] rotate-[15deg] opacity-20 hidden md:block" />
            </div>

            {/* Feature Indicators */}
            <div className="relative z-10 flex gap-4 mt-12">
                {FEATURES.map((f, i) => (
                    <button
                        key={f.id}
                        onClick={() => setIndex(i)}
                        className={`group relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 ${index === i
                            ? 'bg-white/10 border-white/20'
                            : 'bg-transparent border-transparent grayscale opacity-50 hover:opacity-100 hover:grayscale-0'}`}
                    >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${f.color} ${index === i ? 'scale-125' : 'scale-100'}`} />
                        <span className="text-sm font-bold text-white uppercase tracking-widest">{f.label}</span>
                    </button>
                ))}
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </section>
    );
}
