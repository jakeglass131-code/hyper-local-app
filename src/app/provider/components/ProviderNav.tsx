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
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-white/10">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            <div className="grid grid-cols-5 h-16">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pathname === tab.href;

                    // Logo in center
                    if (tab.name === "Logo") {
                        return (
                            <button
                                key="logo"
                                onClick={handleLogoClick}
                                className="flex flex-col items-center justify-center group"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg -mt-6 border-4 border-neutral-900 overflow-hidden group-hover:scale-110 transition-transform">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Upload className="h-5 w-5 text-white" />
                                    )}
                                </div>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                                isActive
                                    ? "text-indigo-400"
                                    : "text-white/60 hover:text-white/90"
                            )}
                        >
                            {Icon && <Icon className="h-5 w-5" />}
                            <span>{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
