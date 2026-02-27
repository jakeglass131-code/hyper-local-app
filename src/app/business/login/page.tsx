"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, Lock, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";

export default function BusinessLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ role: "provider", businessName: email.split('@')[0] || "Merchant" }),
        });

        setLoading(false);
        if (res.ok) {
            router.push("/provider/home");
        } else {
            alert("Login failed");
        }
    };

    return (
        <AuthShell role="merchant">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-black tracking-tight text-white italic">Welcome back</h1>
                <p className="mt-2 text-sm font-medium text-white/50">Manage your district presence.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                        Work Email
                    </label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-[#008A5E]" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] pl-12 pr-4 text-sm font-medium text-white outline-none transition-all focus:border-[#008A5E]/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-[#008A5E]/10 placeholder:text-white/20"
                            placeholder="name@business.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                            Password
                        </label>
                        <button type="button" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#008A5E] hover:text-[#008A5E]/80 transition-colors">
                            Forgot?
                        </button>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-[#008A5E]" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] pl-12 pr-4 text-sm font-medium text-white outline-none transition-all focus:border-[#008A5E]/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-[#008A5E]/10 placeholder:text-white/20"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-4 h-14 w-full overflow-hidden rounded-2xl bg-white text-sm font-black uppercase tracking-[0.2em] text-black shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? "Authenticating..." : "Continue"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>
            </form>

            <div className="mt-10 text-center">
                <p className="text-[11px] font-bold text-white/30 tracking-wide">
                    New to Hyper Local?{" "}
                    <button
                        onClick={() => router.push("/business/register")}
                        className="font-black text-white hover:text-[#008A5E] transition-colors underline decoration-[#008A5E] decoration-2 underline-offset-4"
                    >
                        Register your business
                    </button>
                </p>
            </div>
        </AuthShell>
    );
}
