import { WebsiteShell } from "@/components/website/WebsiteShell";

export default function PrivacyPage() {
  return (
    <WebsiteShell>
      <section className="mx-auto max-w-3xl rounded-3xl border border-[#dfe5df] bg-white p-6 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight text-[#1f2a2a]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[#5f6d68]">Last updated: February 26, 2026</p>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#4d5d58]">
          <section>
            <h2 className="text-base font-bold text-[#1f2a2a]">1. Data We Collect</h2>
            <p className="mt-1">
              We collect account details, usage events, and optional location data to power nearby discovery and secure redemptions.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1f2a2a]">2. How We Use Data</h2>
            <p className="mt-1">
              Data is used to provide app features, prevent fraud, improve recommendations, and support merchants with analytics.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1f2a2a]">3. Sharing</h2>
            <p className="mt-1">
              We do not sell personal data. We may share limited information with service providers required to operate the platform.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#1f2a2a]">4. Your Controls</h2>
            <p className="mt-1">
              You can request account updates, data export, or deletion by contacting support@hyper-local.app.
            </p>
          </section>
        </div>
      </section>
    </WebsiteShell>
  );
}
