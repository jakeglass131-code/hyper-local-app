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
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        >
            Sign out
        </button>
    );
}
