import Link from "next/link";
import { ArrowRight, Clock3, Heart, MapPinned, QrCode, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import { WebsiteShell } from "@/components/website/WebsiteShell";
import WebsiteScrollReveal from "@/components/website/WebsiteScrollReveal";

const consumerFeatures = [
  {
    title: "Fast discovery",
    body: "Nearby businesses and deals are surfaced clearly on map and feed.",
    icon: <MapPinned className="h-4 w-4" />,
  },
  {
    title: "Smooth claiming",
    body: "Claim in one tap, track status, and keep everything organized in offers.",
    icon: <Ticket className="h-4 w-4" />,
  },
  {
    title: "Secure redemption",
    body: "Dynamic QR + short code keeps in-store redemption quick and safe.",
    icon: <QrCode className="h-4 w-4" />,
  },
];

const flow = [
  { step: "1", title: "Browse", body: "Open Home or Map and scan nearby offers." },
  { step: "2", title: "Save", body: "Heart the businesses and offers you want to revisit." },
  { step: "3", title: "Reserve", body: "Claim now to lock in inventory before it runs out." },
  { step: "4", title: "Redeem", body: "Show your code at checkout and complete in seconds." },
];

export default function ConsumersPage() {
  return (
    <WebsiteShell>
      <WebsiteScrollReveal>
        <section className="relative overflow-hidden rounded-3xl border border-[#dbe3db] bg-gradient-to-br from-[#f3f5ff] via-[#f9fbff] to-[#edf5ff] p-8 sm:p-10">
          <div className="website-orb-slow absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#3744D2]/15 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#3744D2]">
              <Sparkles className="h-3.5 w-3.5" />
              Consumer Experience
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-[#1f2a2a] sm:text-5xl">
              Clean local discovery,
              <span className="text-[#3744D2]"> from browse to redeem.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[#4d5d58] sm:text-lg">
              We designed the consumer flow to stay fast and uncluttered, even as users save more offers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/auth/signup" className="rounded-xl bg-[#3744D2] px-4 py-2.5 text-sm font-semibold text-white">
                Start as consumer
              </Link>
              <Link href="/consumer/home" className="rounded-xl border border-[#cdd8d1] bg-white px-4 py-2.5 text-sm font-semibold text-[#1f2a2a]">
                Open consumer app
              </Link>
            </div>
          </div>
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={80} className="mt-8" variant="pop">
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Avg redeem time" value="< 20 sec" icon={<Clock3 className="h-4 w-4" />} />
          <StatCard label="Saved favourites" value="Business + Offer" icon={<Heart className="h-4 w-4" />} />
          <StatCard label="Token format" value="QR + short code" icon={<ShieldCheck className="h-4 w-4" />} />
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={110} className="mt-8" variant="pop">
        <section className="rounded-2xl border border-[#dfe5df] bg-white p-6">
          <h2 className="text-xl font-bold text-[#1f2a2a]">Core features</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {consumerFeatures.map((feature, index) => (
              <article
                key={feature.title}
                className="rounded-xl border border-[#e4e8e4] bg-[#fbfcfb] p-4"
              >
                <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#3744D2]">
                  {feature.icon}
                  Feature {index + 1}
                </p>
                <h3 className="mt-2 text-base font-semibold text-[#1f2a2a]">{feature.title}</h3>
                <p className="mt-1 text-sm text-[#5f6d68]">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={140} className="mt-8" variant="pop">
        <section className="rounded-2xl border border-[#dfe5df] bg-white p-6">
          <h2 className="text-xl font-bold text-[#1f2a2a]">User flow</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {flow.map((item) => (
              <article key={item.step} className="rounded-xl border border-[#e4e8e4] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#3744D2]">Step {item.step}</p>
                <h3 className="mt-2 text-base font-semibold text-[#1f2a2a]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#5f6d68]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={170} className="mt-8" variant="pop">
        <section className="rounded-2xl border border-[#3744D2]/20 bg-[#3744D2] p-6 text-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Ready to try it live?</h2>
              <p className="mt-1 text-sm text-white/80">Get the free download and start claiming local offers today.</p>
            </div>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#3744D2]">
              Free Download
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </WebsiteScrollReveal>
    </WebsiteShell>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[#dfe5df] bg-white p-4 shadow-sm">
      <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#3744D2]">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-[#1f2a2a]">{value}</p>
    </article>
  );
}
