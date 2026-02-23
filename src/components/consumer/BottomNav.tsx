"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Wallet, User, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const tabs = [
        { name: "Home", href: "/consumer/home", icon: Home },
        { name: "Map", href: "/consumer/map", icon: Map },
        { name: "Offers", href: "/consumer/offers", icon: Tag },
        { name: "Wallet", href: "/consumer/wallet", icon: Wallet },
        { name: "Profile", href: "/consumer/profile", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 pb-safe z-[9999] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-16">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;

                    return (
                        <Link
                            key={tab.name}
                            id={tab.name === "Offers" ? "nav-item-offers" : undefined}

                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-all duration-200",
                                isActive
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                            )}
                        >
                            {/* Active indicator bar */}
                            {isActive && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-b-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
                            )}

                            {tab.icon && (
                                <tab.icon
                                    className={cn(
                                        "h-6 w-6 transition-transform duration-200",
                                        isActive ? "scale-110 stroke-[2.5]" : "stroke-[2]"
                                    )}
                                />
                            )}
                            <span className={cn(
                                "text-[10px] font-medium leading-none",
                                isActive && "font-bold"
                            )}>{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
