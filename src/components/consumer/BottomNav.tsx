"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Wallet, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const tabs = [
        { name: "Home", href: "/consumer/home", icon: Home },
        { name: "Map", href: "/consumer/map", icon: Map },
        { name: "Offers", href: "/consumer/reservations", icon: Ticket },
        { name: "Wallet", href: "/consumer/wallet", icon: Wallet },
    ];


    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-[9999] shadow-[0_-15px_35px_rgba(0,0,0,0.08)]">
            <div className="flex justify-around items-center h-24 max-w-lg mx-auto">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href || (tab.href !== "/consumer/home" && pathname.startsWith(tab.href));

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1.5 relative transition-all",
                                isActive ? "text-brand" : "text-[#8a9791] hover:text-[#1f2a2a]"
                            )}
                        >
                            {/* Active indicator bar */}
                            {isActive && (
                                <div className="absolute top-0 left-2 right-2 h-1 rounded-b-full bg-brand shadow-[0_2px_10px_rgba(55,68,210,0.35)] animate-in slide-in-from-top-1 duration-300" />
                            )}

                            {tab.icon && (
                                <tab.icon
                                    className={cn(
                                        "h-8 w-8 transition-all duration-300",
                                        isActive ? "stroke-[2.5] scale-110" : "stroke-[1.5]"
                                    )}
                                />
                            )}
                            <span className={cn(
                                "text-xs font-black uppercase tracking-widest transition-all",
                                isActive ? "text-brand" : "text-[#8a9791]"
                            )}>
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
