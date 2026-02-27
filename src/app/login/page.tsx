"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Role = "consumer" | "provider";
type ForgotPasswordState = "idle" | "sending" | "success" | "error";

import { AuthShell } from "@/components/auth/AuthShell";

function LoginForm() {
    const router = useRouter();
    const sp = useSearchParams();
    const next = sp.get("next") || "";
    const roleFromQuery = sp.get("role");

    const [role, setRole] = useState<Role>(roleFromQuery === "provider" ? "provider" : "consumer");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const isMerchant = role === "provider";
    const brandColor = isMerchant ? "#008A5E" : "#3744D2";

    const target = useMemo(() => {
        if (next) return next;
        return role === "consumer" ? "/consumer/home" : "/business";
    }, [role, next]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ role, businessName: email.split('@')[0] || "User" }),
        });

        setLoading(false);
        if (!res.ok) return alert("Login failed");

        router.push(target);
        router.refresh();
    }

    return (
        <AuthShell role={isMerchant ? "merchant" : "consumer"}>
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black tracking-tight text-white italic">Sign in</h1>
                <p className="mt-2 text-sm font-medium text-white/50">
                    Access your {isMerchant ? "merchant" : "personal"} portal.
                </p>
            </div>

            <div className="mb-10">
                <div className="flex p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                    <button
                        type="button"
                        onClick={() => setRole("consumer")}
                        className={`flex-1 rounded-xl py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${role === "consumer"
                            ? "bg-white text-black shadow-lg"
                            : "text-white/40 hover:text-white/60"
                            }`}
                    >
                        Consumer
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("provider")}
                        className={`flex-1 rounded-xl py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${role === "provider"
                            ? "bg-white text-black shadow-lg"
                            : "text-white/40 hover:text-white/60"
                            }`}
                    >
                        Merchant
                    </button>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
                        Account Email
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 text-sm font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
                        placeholder="name@email.com"
                        style={{ '--focus-color': brandColor } as React.CSSProperties}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                            Password
                        </label>
                        <button type="button" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors" style={{ color: brandColor }}>
                            Forgot?
                        </button>
                    </div>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 text-sm font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="group relative h-14 w-full overflow-hidden rounded-2xl bg-white text-sm font-black uppercase tracking-[0.2em] text-black shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? "Signing in..." : "Continue"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>
            </form>

            <div className="mt-10 text-center">
                <p className="text-[11px] font-bold text-white/30 tracking-wide">
                    New here?{" "}
                    <button
                        onClick={() => router.push(isMerchant ? "/business/register" : "/auth/signup")}
                        className="font-black text-white hover:opacity-80 transition-opacity underline decoration-white/20 decoration-2 underline-offset-4"
                        style={{ textDecorationColor: brandColor }}
                    >
                        Create an account
                    </button>
                </p>
            </div>
        </AuthShell>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
