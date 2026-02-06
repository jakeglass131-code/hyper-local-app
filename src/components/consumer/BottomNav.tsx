"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Wallet, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const tabs = [
        { name: "Home", href: "/consumer/home", icon: Home },
        { name: "Map", href: "/consumer/map", icon: Map },
        { name: "Favourites", href: "/consumer/favourites", icon: Heart },
        { name: "Wallet", href: "/consumer/wallet", icon: Wallet },
        { name: "Profile", href: "/consumer/profile", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-[9999] shadow-lg">
            <div className="flex justify-around items-center h-16">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-0.5 relative transition-colors",
                                isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            {/* Active indicator bar */}
                            {isActive && (
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-600" />
                            )}
                            {tab.icon && <tab.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />}
                            <span className={cn(
                                "text-[10px] font-medium",
                                isActive && "font-semibold"
                            )}>{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
