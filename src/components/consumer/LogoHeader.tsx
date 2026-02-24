"use client";

import { Upload, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const LOGO_STORAGE_KEY = "app-logo";

export function LogoHeader() {
    const router = useRouter();
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load logo from localStorage on mount
    useEffect(() => {
        const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
        if (savedLogo) {
            setLogoUrl(savedLogo);
        }
    }, []);

    const handleLogoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setLogoUrl(result);
                // Save to localStorage
                localStorage.setItem(LOGO_STORAGE_KEY, result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white px-5 pt-4 pb-2 flex items-center justify-between border-b border-gray-100">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                onClick={handleLogoClick}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm hover:bg-gray-50 transition-all active:scale-95"
                aria-label="Upload logo"
            >
                {logoUrl ? (
                    <span
                        className="h-6 w-6 rounded-md border border-brand/40 bg-cover bg-center"
                        style={{ backgroundImage: `url(${logoUrl})` }}
                    />
                ) : (
                    <Upload className="h-4 w-4 text-brand" />
                )}
                <span className="text-sm font-bold tracking-tight">
                    {logoUrl ? "Sync Brand" : "Setup Brand"}
                </span>
            </button>

            <button
                onClick={() => router.push("/consumer/profile")}
                className="relative group rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm active:scale-95 transition-all overflow-hidden"
                aria-label="Profile"
            >
                <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <User className="h-4 w-4 text-brand relative z-10" />
            </button>
        </div>
    );

}
