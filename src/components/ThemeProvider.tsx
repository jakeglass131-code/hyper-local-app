"use client";

import { useEffect } from "react";
import { useConsumerStore } from "@/store/consumerStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { appearance } = useConsumerStore();

    useEffect(() => {
        const root = document.documentElement;

        // Apply theme
        if (appearance.theme === "system") {
            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.setAttribute("data-theme", isDark ? "dark" : "light");
        } else {
            root.setAttribute("data-theme", appearance.theme);
        }
    }, [appearance.theme]);

    return <>{children}</>;
}
