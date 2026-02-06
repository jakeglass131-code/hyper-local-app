"use client";

import type { SVGProps } from "react";
import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Role = "consumer" | "provider";

function LoginForm() {
    const router = useRouter();
    const sp = useSearchParams();
    const next = sp.get("next") || "";

    const [role, setRole] = useState<Role>("consumer");
    const [businessName, setBusinessName] = useState("Jake’s Ice Cream");
    const [loading, setLoading] = useState(false);

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
            body: JSON.stringify({ role, businessName }),
        });

        setLoading(false);
        if (!res.ok) return alert("Login failed");

        router.push(target);
        router.refresh();
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900/60 p-6 shadow-xl"
            >
                <h1 className="text-2xl font-semibold">Log in</h1>
                <p className="mt-1 text-sm text-white/70">
                    Choose Consumer or Provider to enter the correct version of the app.
                </p>

                <div className="mt-5">
                    <label className="text-sm text-white/70">Role</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setRole("consumer")}
                            className={`rounded-2xl px-4 py-3 text-sm font-medium border ${role === "consumer"
                                    ? "bg-white text-neutral-900 border-white"
                                    : "bg-transparent text-white border-white/15 hover:border-white/30"
                                }`}
                        >
                            Consumer
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("provider")}
                            className={`rounded-2xl px-4 py-3 text-sm font-medium border ${role === "provider"
                                    ? "bg-white text-neutral-900 border-white"
                                    : "bg-transparent text-white border-white/15 hover:border-white/30"
                                }`}
                        >
                            Provider
                        </button>
                    </div>
                </div>

                {role === "provider" && (
                    <div className="mt-4">
                        <label className="text-sm text-white/70">Business name</label>
                        <input
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="mt-2 w-full rounded-2xl bg-neutral-950/60 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30"
                            placeholder="e.g. Jake’s Ice Cream"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium py-3"
                >
                    {loading ? "Signing in…" : "Continue →"}
                </button>

                <p className="mt-4 text-xs text-white/50">
                    MVP login uses cookies + roles. Swap to real auth later.
                </p>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
