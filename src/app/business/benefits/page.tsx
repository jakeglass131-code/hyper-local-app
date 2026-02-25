"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Building2, CheckCircle2, TrendingUp, Users, MapPin, Sparkles } from "lucide-react";
import { BusinessShell } from "@/components/website/BusinessShell";
import { WebsiteScrollReveal } from "@/components/website/WebsiteScrollReveal";
import { cn } from "@/lib/utils";
import { RegisterButton } from "@/components/website/RegisterButton";

const idleHourRecovery = [
    { time: "11am-1pm", before: 45, after: 58, lift: 29 },
    { time: "2pm-4pm", before: 28, after: 39, lift: 39 },
    { time: "4pm-6pm", before: 36, after: 49, lift: 36 },
    { time: "7pm-9pm", before: 51, after: 63, lift: 24 },
] as const;

export default function BusinessBenefitsPage() {
    const [liveHeights, setLiveHeights] = useState([28, 34, 26, 42, 39, 56, 31, 61, 44, 49, 36, 53]);
    const [isVisible, setIsVisible] = useState(false);
    const [activities, setActivities] = useState([
        { id: 1, user: "Sarah M.", action: "Redeemed 'Movie Night 2-for-1'", time: "2 mins ago", iconColor: "bg-green-100 text-green-600" },
        { id: 2, user: "David K.", action: "Claimed 'Gel Nails Package'", time: "12 mins ago", iconColor: "bg-indigo-100 text-indigo-600" },
        { id: 3, user: "Emma W.", action: "Redeemed '7-Day Gym Pass'", time: "28 mins ago", iconColor: "bg-purple-100 text-purple-600" },
    ]);
    const observerRef = useRef(null);

    useEffect(() => {
        // Live chart randomization
        const chartInterval = setInterval(() => {
            setLiveHeights(prev => prev.map(h => {
                const delta = (Math.random() - 0.5) * 15;
                return Math.max(15, Math.min(95, h + delta));
            }));
        }, 2200);

        // Live activity generation
        const names = ["Michael R.", "Jessica L.", "Chris P.", "Alex T.", "Taylor S.", "Jordan B.", "Casey J.", "Ryan W.", "Olivia M.", "Ethan H."];
        const actions = [
            "Claimed 'Movie Tickets 2-for-1'",
            "Redeemed 'Cinema Gold Class Upgrade'",
            "Claimed 'Gel Nails & Design'",
            "Redeemed 'Nail Studio Express Set'",
            "Claimed '7-Day Gym Membership'",
            "Redeemed 'PT Intro Session'",
            "Claimed 'Pilates Starter Pack'",
            "Redeemed 'Yoga Drop-In Pass'",
            "Claimed 'Massage Recovery Slot'",
            "Redeemed 'Float Therapy Intro'",
            "Claimed 'Skin Clinic Trial'",
            "Redeemed 'Dental Whitening Consult'",
            "Claimed 'Barber Fade + Beard'",
            "Redeemed 'Car Wash Deluxe'",
            "Claimed 'VR Arcade Credits'",
            "Redeemed 'Escape Room Team Deal'",
            "Claimed 'Bowling Family Pack'",
            "Redeemed 'Co-Working Day Pass'",
            "Claimed 'Pet Grooming Special'",
            "Redeemed 'Flash Espresso'",
        ];
        const colors = ["bg-green-100 text-green-600", "bg-indigo-100 text-indigo-600", "bg-purple-100 text-purple-600", "bg-pink-100 text-pink-600", "bg-teal-100 text-teal-600", "bg-orange-100 text-orange-600"];

        const activityInterval = setInterval(() => {
            setActivities(prev => {
                const nextId = Math.max(...prev.map(a => a.id), 0) + 1;
                const newActivity = {
                    id: nextId,
                    user: names[Math.floor(Math.random() * names.length)],
                    action: actions[Math.floor(Math.random() * actions.length)],
                    time: "Just now",
                    iconColor: colors[Math.floor(Math.random() * colors.length)]
                };
                const updated = [newActivity, ...prev.map(a => ({
                    ...a,
                    time: a.time === "Just now" ? "1 min ago" : a.time.includes("min") ? `${parseInt(a.time) + 1} mins ago` : a.time
                }))];
                return updated.slice(0, 3);
            });
        }, 6000 + Math.random() * 4000);

        // Intersection Observer
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, { threshold: 0.1 });

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            clearInterval(chartInterval);
            clearInterval(activityInterval);
            observer.disconnect();
        };
    }, []);

    return (
        <BusinessShell>
            {/* ... rest of the component remains the same ... */}
            {/* Hero Section */}
            <WebsiteScrollReveal>
                <section className="text-center py-12 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-green-50/50 rounded-full blur-[100px] -z-10" />
                    <p className="inline-flex items-center gap-2 rounded-full bg-[#eaf4ef] px-4 py-1 text-xs font-black uppercase tracking-widest text-[#3744D2] mb-4">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        Live Intelligence
                    </p>
                    <h1 className="text-4xl md:text-6xl font-black text-[#1f2a2a] tracking-tighter max-w-4xl mx-auto leading-tight">
                        The numbers don&apos;t lie. <br />
                        <span className="text-[#3744D2]">See the potential.</span>
                    </h1>
                    <p className="mt-6 text-lg text-[#4d5d58] max-w-2xl mx-auto font-medium">
                        We drive high-intent customers to your door with a measurable, scalable operating system.
                    </p>
                </section>
            </WebsiteScrollReveal>

            {/* Performance Comparison: Legacy vs HyperLocal */}
            <section ref={observerRef} className="py-12 border-t border-gray-100">
                <div className="grid gap-10 lg:grid-cols-2 items-center">
                    <WebsiteScrollReveal>
                        <div>
                            <h2 className="text-4xl font-black text-[#1f2a2a] tracking-tight mb-2">Conversion Engine</h2>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#3744D2] mb-8">One metric. Clear outcome.</p>

                            <div className="rounded-[2rem] border border-[#dce7e0] bg-gradient-to-br from-[#f5fbf8] to-white p-6 sm:p-8 shadow-sm">
                                <div className="mb-8 flex items-center gap-6">
                                    <div className="relative h-28 w-28 shrink-0 rounded-full bg-[conic-gradient(#3744D2_0_270deg,#dbe1ff_270deg_360deg)] p-1">
                                        <div className="relative h-full w-full rounded-full bg-white">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Lift</p>
                                                    <p className="text-3xl font-black text-[#3744D2]">3.1x</p>
                                                </div>
                                            </div>
                                            <div className="absolute left-1/2 top-1/2 h-0.5 w-10 -translate-y-1/2 origin-left bg-[#3744D2] animate-[spin_3s_linear_infinite]" />
                                        </div>
                                    </div>
                                    <div className="w-full rounded-2xl border border-[#d4e6de] bg-white p-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Average conversion rate</p>
                                        <p className="mt-2 text-5xl font-black tracking-tight text-[#3744D2]">4.9%</p>
                                        <p className="mt-1 text-sm font-bold text-gray-500">vs 1.6% with broad ads</p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-white p-5">
                                    <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-gray-400">Redemptions from same audience size</p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <p className="w-20 text-[10px] font-bold uppercase tracking-wide text-gray-400">Standard</p>
                                            <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-gray-300 transition-all duration-[2000ms]"
                                                    style={{ width: isVisible ? "24%" : "0%" }}
                                                />
                                            </div>
                                            <p className="w-10 text-right text-xs font-black text-gray-500">16</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="w-20 text-[10px] font-bold uppercase tracking-wide text-[#3744D2]">HyperLocal</p>
                                            <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#eaf4ef]">
                                                <div
                                                    className="relative h-full rounded-full bg-gradient-to-r from-[#3744D2] to-[#00aa7c] transition-all duration-[2200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                                    style={{ width: isVisible ? "74%" : "0%" }}
                                                >
                                                    <span className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full border border-white bg-[#3744D2] shadow-md animate-pulse" />
                                                </div>
                                            </div>
                                            <p className="w-10 text-right text-xs font-black text-[#3744D2]">49</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </WebsiteScrollReveal>

                    <WebsiteScrollReveal delayMs={200}>
                        <div className="rounded-[2.5rem] border border-[#d6e4dc] bg-white p-8 shadow-2xl relative overflow-hidden sm:p-10">
                            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#3744D2]/10 blur-3xl" />
                            <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-[#3744D2] mb-3">Revenue Impact</p>
                            <h3 className="relative z-10 text-3xl font-black text-[#1f2a2a] leading-none">Idle-Hour Recovery</h3>
                            <p className="relative z-10 mt-3 text-sm font-bold text-gray-500">Capacity used during low-traffic windows.</p>

                            <div className="relative z-10 mt-8 space-y-4">
                                {idleHourRecovery.map((slot, index) => (
                                    <div key={slot.time} className="rounded-2xl border border-gray-100 bg-[#fbfcfb] p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="text-[11px] font-black uppercase tracking-wider text-[#1f2a2a]">{slot.time}</p>
                                            <p className="text-[11px] font-black text-[#3744D2]">+{slot.lift}%</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-14 text-[9px] font-black uppercase tracking-wide text-gray-400">Before</span>
                                                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className="h-full rounded-full bg-gray-300 transition-all duration-[1800ms]"
                                                        style={{ width: isVisible ? `${slot.before}%` : "0%" }}
                                                    />
                                                </div>
                                                <span className="w-8 text-right text-[10px] font-black text-gray-500">{slot.before}%</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-14 text-[9px] font-black uppercase tracking-wide text-[#3744D2]">After</span>
                                                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#eaf4ef]">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-[#3744D2] to-[#00aa7c] transition-all duration-[2200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                                        style={{ width: isVisible ? `${slot.after}%` : "0%", transitionDelay: `${index * 120}ms` }}
                                                    />
                                                </div>
                                                <span className="w-8 text-right text-[10px] font-black text-[#3744D2]">{slot.after}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="relative z-10 mt-6 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-green-600">Seats Utilized</p>
                                    <p className="mt-1 text-2xl font-black text-green-700">+18%</p>
                                    <p className="text-[10px] font-bold text-green-700/80">During 2pm-5pm</p>
                                </div>
                                <div className="rounded-2xl border border-[#d4e6de] bg-[#eaf4ef] p-4">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#3744D2]">Recovered Revenue</p>
                                    <p className="mt-1 text-2xl font-black text-[#3744D2]">+$620</p>
                                    <p className="text-[10px] font-bold text-[#3744D2]/80">Average weekly lift</p>
                                </div>
                            </div>
                        </div>
                    </WebsiteScrollReveal>
                </div>
            </section>

            {/* District Density & User Potential */}
            <section className="py-16 bg-[#f5fbf8] rounded-[3rem] border border-green-50 overflow-hidden relative shadow-inner">
                <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-green-100/50 blur-[100px]" />
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="grid gap-12 lg:grid-cols-2 items-center">
                        <WebsiteScrollReveal variant="pop">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Active Nodes", value: "860", sub: "Users in District" },
                                    { label: "Open Rate", value: "71%", sub: "Push Notifications" },
                                    { label: "Avg Yield", value: "2.9x", sub: "ROI on Offers" },
                                    { label: "Growth", value: "+9%", sub: "Week over Week" },
                                ].map((card) => (
                                    <div key={card.label} className="bg-white p-8 rounded-[2rem] border border-green-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                                        <p className="text-[10px] font-black text-[#3744D2] uppercase tracking-widest mb-1">{card.label}</p>
                                        <p className="text-3xl font-black text-[#1f2a2a] tabular-nums">{card.value}</p>
                                        <p className="text-xs font-bold text-gray-400 mt-1">{card.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </WebsiteScrollReveal>

                        <WebsiteScrollReveal delayMs={200}>
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black text-[#1f2a2a] tracking-tight mb-6">Hyper-Local <br /><span className="text-[#3744D2]">Saturation.</span></h2>
                                <p className="text-lg text-[#5f6d68] mb-8 leading-relaxed font-medium">
                                    Our geofencing technology ensures your message is only sent to the people who can actually visit your shop in the next 5 minutes.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 group hover:border-[#3744D2]/30 transition-all cursor-default">
                                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-[#3744D2]/10 transition-colors">
                                            <MapPin className="h-5 w-5 text-[#3744D2] animate-bounce" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[#1f2a2a]">500 Meter Geofence</p>
                                            <p className="text-xs font-bold text-gray-400">Zero impressions outside your district</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 group hover:border-green-300 transition-all cursor-default">
                                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                            <Users className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[#1f2a2a]">Verified Walk-ins Only</p>
                                            <p className="text-xs font-bold text-gray-400">Fraud-proof QR verification system</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </WebsiteScrollReveal>
                    </div>
                </div>
            </section>

            {/* Real-time Pulse (The Animated Chart) */}
            <section className="py-16">
                <WebsiteScrollReveal>
                    <div className="text-center mb-10">
                        <h2 className="text-4xl md:text-5xl font-black text-[#1f2a2a] tracking-tight mb-4">Real-time <span className="text-[#3744D2]">Pulse.</span></h2>
                        <p className="text-lg text-[#5f6d68] max-w-2xl mx-auto">
                            The Analytics Dashboard you&apos;ll actually use. Every claim and redemption pulsed in high-fidelity.
                        </p>
                    </div>
                </WebsiteScrollReveal>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Stat Cards Row */}
                    {[
                        { label: "District Traffic", value: "780+", sub: "Daily Active Users", icon: Users, color: "text-green-600 bg-green-50" },
                        { label: "Conversion", value: "9.4%", sub: "+1.3 pts lift", icon: TrendingUp, color: "text-green-600 bg-green-50" },
                        { label: "Total Claims", value: "148", sub: "Last 7 days", icon: Sparkles, color: "text-orange-600 bg-orange-50" },
                    ].map((stat, i) => (
                        <WebsiteScrollReveal key={i} delayMs={150 + (i * 100)} variant="pop">
                            <div className="p-5 rounded-[2rem] border border-gray-100 bg-white shadow-sm flex items-center gap-4 group hover:border-[#3744D2]/30 transition-all">
                                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-inner", stat.color)}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#3744D2] mb-0.5">{stat.label}</p>
                                    <p className="text-2xl font-black text-[#1f2a2a] leading-none tabular-nums">{stat.value}</p>
                                </div>
                            </div>
                        </WebsiteScrollReveal>
                    ))}
                </div>

                <WebsiteScrollReveal delayMs={300} className="mt-8">
                    <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-2xl shadow-[#3744D2]/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse ring-4 ring-green-100" />
                                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live Feed</span>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-10 items-start">
                            <div className="lg:col-span-7">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Performance Insight</p>
                                        <h3 className="text-2xl font-black text-[#1f2a2a]">Live Yield Tracking</h3>
                                    </div>
                                    <div className="flex gap-1 items-end h-6">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-full w-1 bg-green-50 rounded-full animate-bounce"
                                                style={{ animationDelay: `${i * 100}ms`, animationDuration: '0.8s' }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* ACTUAL MOVING CHART */}
                                <div className="h-40 flex items-end gap-2 mb-8">
                                    {liveHeights.map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-gradient-to-t from-[#3744D2] to-[#00aa7c] rounded-full transition-all duration-[1200ms] ease-in-out origin-bottom hover:brightness-110 hover:shadow-lg relative group/bar"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1f2a2a] text-white px-2 py-1 rounded md flex items-center justify-center opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                                <span className="text-[10px] font-bold tabular-nums">{Math.round(h)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-[#f5fbf8] border border-green-100 hover:bg-white transition-colors">
                                        <p className="text-[10px] font-bold text-green-500 uppercase mb-1">Top Performer</p>
                                        <p className="font-black text-lg text-[#1f2a2a]">Flash Espresso</p>
                                        <p className="text-xs font-bold text-[#3744D2] mt-0.5 tabular-nums">34 Redemptions</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-[#f5fbf8] border border-green-100 hover:bg-white transition-colors">
                                        <p className="text-[10px] font-bold text-green-400 uppercase mb-1">Retention</p>
                                        <p className="font-black text-lg text-[#1f2a2a] tabular-nums">39% Return</p>
                                        <p className="text-xs font-bold text-green-600 mt-0.5">+6% vs Avg</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Feed */}
                            <div className="lg:col-span-5 h-full flex flex-col pt-10 lg:pt-0">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Recent Activity</p>
                                <div className="space-y-3 flex-1">
                                    {activities.map((act, i) => (
                                        <div key={act.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/50 border border-gray-100/50 hover:bg-white transition-all hover:shadow-md group/act cursor-default animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 150}ms` }}>
                                            <div className="flex items-center gap-3">
                                                <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-[9px] font-black transition-transform group-hover/act:rotate-12", act.iconColor)}>
                                                    {act.user.split(' ')[0][0]}{act.user.split(' ')[1][0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#1f2a2a] leading-none">{act.user}</p>
                                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wide mt-1">{act.action}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {act.time === "Just now" && <div className="h-1 w-1 rounded-full bg-[#3744D2] animate-ping" />}
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{act.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </WebsiteScrollReveal>
            </section>

            {/* Beta Section */}
            <WebsiteScrollReveal delayMs={100} className="mt-20">
                <section className="rounded-[3.5rem] bg-[#1f2a2a] p-16 text-white relative overflow-hidden mb-24 shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3744D2]/20 rounded-full blur-[140px] -mr-64 -mt-64" />
                    <div className="website-orb-slow absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[#3744D2]/15 blur-[120px]" />

                    <div className="relative z-10 grid gap-16 lg:grid-cols-2 items-center">
                        <div>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.85] mb-8">Join the limited <br />merchant beta.</h2>
                            <p className="text-white/60 text-xl mb-10 max-w-lg leading-relaxed font-medium">
                                We are currently onboarding a select group of pioneers in each district. Lock in your spot and get featured on our main discovery page.
                            </p>
                            <div className="flex flex-wrap gap-5">
                                <RegisterButton className="bg-[#3744D2] text-white px-10 py-6 text-xl rounded-2xl font-black shadow-2xl shadow-[#3744D2]/50 hover:scale-105 active:scale-95 transition-all">
                                    Apply for Beta
                                </RegisterButton>
                                <Link href="/business/how-it-works" className="bg-white/5 backdrop-blur-md text-white border border-white/20 px-10 py-6 text-xl rounded-2xl font-black hover:bg-white/15 transition-all">
                                    Plan Roadmap
                                </Link>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {[
                                "Featured listing for 3 months",
                                "Priority customer support",
                                "Custom branded QR posters",
                                "Direct access to our engineering team"
                            ].map((perk, i) => (
                                <WebsiteScrollReveal key={perk} delayMs={200 + (i * 100)} variant="pop">
                                    <div className="flex items-center gap-5 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-sm group hover:bg-white/15 transition-all hover:translate-x-2">
                                        <div className="h-10 w-10 rounded-full bg-[#3744D2]/20 border border-[#3744D2] flex items-center justify-center shrink-0 shadow-lg">
                                            <CheckCircle2 className="h-5 w-5 text-[#3744D2]" />
                                        </div>
                                        <span className="font-black text-xl text-white/90">{perk}</span>
                                    </div>
                                </WebsiteScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>
            </WebsiteScrollReveal>

            <WebsiteScrollReveal delayMs={200} className="mt-8 mb-24">
                <section className="rounded-[2.5rem] border border-[#d6e4dc] bg-[#f5fbf8] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-[2rem] bg-white flex items-center justify-center text-[#3744D2] shadow-sm shrink-0 border border-[#d6e4dc]">
                            <Building2 className="h-10 w-10" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-2xl font-black text-[#1f2a2a] tracking-tight">Access Merchant Dashboard</h2>
                            <p className="mt-2 text-[#4d5d58] max-w-sm font-medium">
                                Ready to put these metrics to work? Open your dashboard to launch your first offer or view live performance.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/provider/home"
                        className="inline-flex items-center gap-3 rounded-2xl bg-[#3744D2] px-10 py-5 text-lg font-black text-white shadow-xl shadow-[#3744D2]/30 hover:scale-105 transition-transform"
                    >
                        Launch App
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </section>
            </WebsiteScrollReveal>
        </BusinessShell >
    );
}
