"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/for-consumers", label: "For Consumers" },
  { href: "/how-it-works", label: "How It Works" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function WebsiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#e3e9e4] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1f6d68] text-white">
            <Globe2 className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#1f2a2a]">Hyper Local</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  active ? "bg-[#e8f4ef] text-[#1f6d68]" : "text-[#4d5d58] hover:bg-[#f4f8f5]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/business"
            className="hidden items-center gap-2 rounded-xl border border-[#d6dfd8] bg-white px-4 py-2 text-sm font-bold text-[#1f6d68] hover:bg-gray-50 sm:inline-flex"
          >
            For Businesses
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-[#1f6d68] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#1f6d68]/20 hover:scale-[1.02] transition-transform"
          >
            Get the App
          </Link>
        </div>
      </div>
    </header>
  );
}
