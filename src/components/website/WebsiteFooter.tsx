import Link from "next/link";

export function WebsiteFooter() {
  return (
    <footer className="border-t border-[#dfe5df] bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-[#6b7280] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© 2026 Hyper Local. All rights reserved.</p>
        <div className="flex items-center gap-4 font-semibold uppercase tracking-widest text-[10px]">
          <Link href="/" className="hover:text-[#3744D2]">Overview</Link>
          <Link href="/for-consumers" className="hover:text-[#3744D2]">Consumers</Link>
          <Link href="/business" className="hover:text-[#3744D2]">Businesses</Link>
          <Link href="/business/subscriptions" className="hover:text-[#3744D2]">Subscriptions</Link>
          <Link href="/how-it-works" className="hover:text-[#3744D2]">How it works</Link>
        </div>
      </div>
    </footer>
  );
}
