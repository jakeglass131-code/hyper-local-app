"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { RegisterButton } from "@/components/website/RegisterButton";

const navItems = [
    { href: "/business", label: "Overview" },
    { href: "/business/how-it-works", label: "How it works" },
    { href: "/business/benefits", label: "Benefits" },
    { href: "/business/subscriptions", label: "Subscriptions" },
];

function isActive(pathname: string, href: string) {
    if (href === "/business") return pathname === "/business";
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function BusinessHeader() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-[#e2f0ea] bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link href="/business" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#008A5E] text-white">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-[0.2em] text-[#008A5E] leading-none">Business</span>
                        <span className="text-lg font-bold tracking-tight text-[#1f2a2a] leading-tight">Hyper Local</span>
                    </div>
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                    {navItems.map((item) => {
                        const active = isActive(pathname, item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                                    active ? "bg-[#f0fdf4] text-[#008A5E]" : "text-[#4d5d58] hover:bg-[#f4f8f5]"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-6">
                    <div className="hidden items-center gap-4 lg:flex">
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-[#008A5E]"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Consumers
                        </Link>
                        <div className="h-4 w-px bg-[#d6dfd8]" />
                        <Link
                            href="/provider/home"
                            className="text-sm font-bold text-[#4d5d58] transition-colors hover:text-[#008A5E]"
                        >
                            Launch App
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/login?role=provider"
                            className="hidden text-sm font-bold text-[#1f2a2a] transition-colors hover:text-[#008A5E] sm:block"
                        >
                            Login
                        </Link>
                        <RegisterButton
                            className="rounded-xl bg-[#008A5E] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-[#008A5E]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Register
                        </RegisterButton>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d6dfd8] bg-white text-[#008A5E] md:hidden"
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenuOpen ? (
                <div className="border-t border-[#e2f0ea] bg-white px-4 py-3 sm:hidden">
                    <div className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const active = isActive(pathname, item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "rounded-lg px-3 py-2 text-sm font-semibold",
                                        active ? "bg-[#f0fdf4] text-[#008A5E]" : "text-[#4d5d58] hover:bg-[#f4f8f5]"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                        <Link
                            href="/provider/home"
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-lg bg-[#f0fdf4] px-3 py-2 text-sm font-semibold text-[#008A5E]"
                        >
                            Launch App
                        </Link>
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-lg border border-[#d6dfd8] bg-white px-3 py-2 text-sm font-semibold text-[#4d5d58]"
                        >
                            Back to Consumers
                        </Link>
                        <Link
                            href="/login?role=provider"
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-lg border border-[#d6dfd8] bg-white px-3 py-2 text-sm font-semibold text-[#1f2a2a]"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            ) : null}
        </header>
    );
}
