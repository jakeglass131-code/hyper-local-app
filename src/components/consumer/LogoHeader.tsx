"use client";

import { Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LOGO_STORAGE_KEY = "app-logo";

export function LogoHeader() {
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
        <div className="flex justify-center py-4 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                onClick={handleLogoClick}
                className="group relative w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg hover:scale-105 transition-transform overflow-hidden"
            >
                {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center gap-1">
                        <Upload className="h-6 w-6 text-white" />
                        <span className="text-[10px] text-white/80">Add Logo</span>
                    </div>
                )}
            </button>
        </div>
    );
}
