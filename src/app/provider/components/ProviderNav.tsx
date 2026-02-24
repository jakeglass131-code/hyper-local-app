"use client";

import { Home, ScanLine, BarChart3, User, Upload } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

export function ProviderNav() {
    const pathname = usePathname();
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { name: "Scanner", href: "/provider/scanner", icon: ScanLine },
        { name: "Offers", href: "/provider/offers", icon: Upload },
        { name: "Home", href: "/provider/home", icon: Home },
        { name: "Analytics", href: "/provider/analytics", icon: BarChart3 },
        { name: "Profile", href: "/provider/profile", icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            <div className="grid grid-cols-5 h-24">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pathname === tab.href;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1.5 transition-all text-gray-400 hover:text-gray-900",
                                isActive && "text-brand"
                            )}
                        >
                            {Icon && <Icon className={cn("h-7 w-7 transition-transform", isActive && "scale-110 stroke-[2.5]")} />}
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                isActive ? "opacity-100" : "opacity-60"
                            )}>{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>

    );
}
