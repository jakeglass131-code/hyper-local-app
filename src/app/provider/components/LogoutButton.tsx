"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();

    return (
        <button
            onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/login");
                router.refresh();
            }}
            className="rounded-full px-3 py-2 text-sm hover:bg-white/10"
        >
            Sign out
        </button>
    );
}
