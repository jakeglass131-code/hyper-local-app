"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/business", label: "Overview" },
    { href: "/business/how-it-works", label: "How it works" },
    { href: "/business/benefits", label: "Benefits" },
];

function isActive(pathname: string, href: string) {
    if (href === "/business") return pathname === "/business";
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function BusinessHeader() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-40 border-b border-[#eef2ff] bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link href="/business" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3744d2] text-white">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-[0.2em] text-[#3744d2] leading-none">Business</span>
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
                                    active ? "bg-[#eff3ff] text-[#3744d2]" : "text-[#4d5d58] hover:bg-[#f4f7ff]"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="hidden items-center gap-2 rounded-xl border border-[#d6dfd8] bg-white px-4 py-2 text-sm font-semibold text-[#4d5d58] hover:bg-gray-50 sm:inline-flex"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Consumers
                    </Link>
                    <Link
                        href="/provider/onboarding"
                        className="rounded-xl bg-[#3744d2] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#3744d2]/20 hover:scale-[1.02] transition-transform"
                    >
                        Join Network
                    </Link>
                </div>
            </div>
        </header>
    );
}
