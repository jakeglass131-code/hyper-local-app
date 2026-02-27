import { WebsiteShell } from "@/components/website/WebsiteShell";

export default function TermsPage() {
  return (
    <WebsiteShell>
      <section className="mx-auto max-w-3xl rounded-3xl border border-[#dfe5df] bg-white p-6 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight text-[#1f2a2a]">Terms & Conditions</h1>
        <p className="mt-2 text-sm text-[#5f6d68]">Last updated: February 26, 2026</p>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#4d5d58]">
          <section>
            <h2 className="text-base font-bold text-[#1f2a2a]">1. Use of Service</h2>
            <p className="mt-1">
              Hyper Local helps users discover and redeem offers from participating businesses. By using the site and app, you agree to use the service lawfully and responsibly.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1f2a2a]">2. Accounts</h2>
            <p className="mt-1">
              You are responsible for activity on your account and for keeping your credentials and PIN secure.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1f2a2a]">3. Offers and Redemptions</h2>
            <p className="mt-1">
              Offers are created and fulfilled by businesses. Availability, terms, and redemption rules may change at any time.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1f2a2a]">4. Liability</h2>
            <p className="mt-1">
              Hyper Local is not responsible for products or services delivered by third-party businesses.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1f2a2a]">5. Contact</h2>
            <p className="mt-1">For legal or terms questions, email support@hyper-local.app.</p>
          </section>
        </div>
      </section>
    </WebsiteShell>
  );
}
