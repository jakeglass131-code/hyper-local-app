"use client";

import { BarChart3, Home, ScanLine, Upload, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
    { name: "Home", href: "/provider/home", icon: Home },
    { name: "Offers", href: "/provider/offers", icon: Upload },
    { name: "Scanner", href: "/provider/scanner", icon: ScanLine },
    { name: "Analytics", href: "/provider/analytics", icon: BarChart3 },
    { name: "Profile", href: "/provider/profile", icon: User },
];

export function ProviderNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/90 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto grid h-20 w-full max-w-7xl grid-cols-5 px-2 sm:px-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all",
                                isActive
                                    ? "text-[#008A5E]"
                                    : "text-slate-500 hover:text-slate-800"
                            )}
                        >
                            <div
                                className={cn(
                                    "rounded-xl border px-2 py-1 transition-all",
                                    isActive
                                        ? "border-[#008A5E]/25 bg-[#008A5E]/10"
                                        : "border-transparent bg-transparent"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive && "scale-105")} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wide">
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
