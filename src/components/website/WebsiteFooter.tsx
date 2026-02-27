import Link from "next/link";

export function WebsiteFooter({ tone = "default" }: { tone?: "default" | "business" }) {
  const accent = tone === "business" ? "#008A5E" : "#3744D2";
  const linkHoverClass = tone === "business" ? "hover:text-[#008A5E]" : "hover:text-[#3744D2]";

  return (
    <footer className="border-t border-[#dfe5df] bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 border-b border-[#e7ece8] pb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>Hyper Local</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#66756f]">
              Discover nearby offers, claim in seconds, and redeem securely with a single app for consumers and merchants.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>Explore</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[#4f5f59]">
              <Link href="/" className={linkHoverClass}>Overview</Link>
              <Link href="/for-consumers" className={linkHoverClass}>For Consumers</Link>
              <Link href="/for-businesses" className={linkHoverClass}>For Businesses</Link>
              <Link href="/how-it-works" className={linkHoverClass}>How It Works</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>Legal</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[#4f5f59]">
              <Link href="/terms" className={linkHoverClass}>Terms & Conditions</Link>
              <Link href="/privacy" className={linkHoverClass}>Privacy Policy</Link>
              <Link href="/business/subscriptions" className={linkHoverClass}>Subscriptions</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>Contact Us</p>
            <div className="mt-3 space-y-1 text-sm text-[#4f5f59]">
              <p>support@hyper-local.app</p>
              <p>+1 (888) 555-0143</p>
              <Link href="/contact" className="inline-flex pt-1 font-semibold hover:underline" style={{ color: accent }}>
                Open Contact Form
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-4 text-xs text-[#7a8782] sm:flex sm:items-center sm:justify-between">
          <p>© 2026 Hyper Local. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built for local businesses and local communities.</p>
        </div>
      </div>
    </footer>
  );
}
