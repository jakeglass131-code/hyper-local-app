"use client";

import { useEffect } from "react";
import { useConsumerStore } from "@/store/consumerStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { appearance } = useConsumerStore();

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute("data-theme", appearance.highContrast ? "high-contrast" : "light");
    }, [appearance.highContrast]);

    return <>{children}</>;
}
