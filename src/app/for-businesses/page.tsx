import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Layers3,
  MapPinned,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";
import { WebsiteShell } from "@/components/website/WebsiteShell";
import { WebsiteScrollReveal } from "@/components/website/WebsiteScrollReveal";

const outcomes = [
  {
    title: "Acquire nearby customers",
    body: "Launch location-aware offers that appear in map + feed when consumers are close enough to act.",
    icon: <MapPinned className="h-4 w-4" />,
  },
  {
    title: "Convert with less discount waste",
    body: "Set inventory caps, time windows, and clear redemption rules so every offer has controlled spend.",
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    title: "Retain with measurable loops",
    body: "Track repeat claims, redemption frequency, and offer-level performance in one operating view.",
    icon: <BarChart3 className="h-4 w-4" />,
  },
];

const capabilityGrid = [
  {
    title: "Offer Builder",
    body: "Create percent, fixed, or bundle offers in minutes with radius and inventory controls.",
    icon: <Layers3 className="h-4 w-4" />,
  },
  {
    title: "Redemption Security",
    body: "Dynamic token + scanner validation reduces fraud and keeps checkout flow fast for staff.",
    icon: <ScanLine className="h-4 w-4" />,
  },
  {
    title: "Promotion Control",
    body: "Pause, resume, or adjust live offers without waiting on external ad platforms.",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    title: "Live Dashboard",
    body: "Monitor impressions, claims, redemptions, and net revenue by date range and campaign.",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    title: "Loyalty Layer",
    body: "Run digital stamp and reward programs to increase return visits and repeat spend.",
    icon: <Store className="h-4 w-4" />,
  },
  {
    title: "Operational Fit",
    body: "Simple enough for single-location teams, structured enough for multi-site rollout.",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
];

const rollout = [
  {
    step: "Week 1",
    title: "Setup + training",
    body: "Profile, scanner workflow, and first offer templates.",
  },
  {
    step: "Week 2",
    title: "First campaign live",
    body: "Launch local discovery offer with controlled inventory.",
  },
  {
    step: "Week 3",
    title: "Optimization cycle",
    body: "Review conversion funnel and adjust targeting + timing.",
  },
  {
    step: "Week 4",
    title: "Retention push",
    body: "Add loyalty or repeat-customer campaigns.",
  },
];

const faqs = [
  {
    q: "How quickly can we launch our first offer?",
    a: "Most merchants publish a first offer the same day after onboarding and scanner setup.",
  },
  {
    q: "Does this work for small teams?",
    a: "Yes. The workflow is intentionally lightweight: create offer, scan redemption, review results.",
  },
  {
    q: "Can we control discount exposure?",
    a: "You can set radius, inventory limits, active windows, and pause offers at any time.",
  },
  {
    q: "How does checkout validation work?",
    a: "Each redemption uses a dynamic token and short code validated at scan time.",
  },
];

export default function BusinessesPage() {
  return (
    <WebsiteShell>
      <WebsiteScrollReveal>
        <section className="relative overflow-hidden rounded-3xl border border-[#dbe3db] bg-gradient-to-br from-[#eff4ff] via-[#f8fbff] to-[#eef8f3] p-8 sm:p-10">
          <div className="website-orb-fast absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#3744d2]/15 blur-3xl" />
          <div className="website-orb-slow absolute -right-24 -bottom-20 h-72 w-72 rounded-full bg-[#1f6d68]/12 blur-3xl" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#3744d2]">
                <Sparkles className="h-3.5 w-3.5" />
                Business Growth Platform
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-[#1f2a2a] sm:text-5xl">
                Turn local attention into
                <span className="text-[#3744d2]"> measurable revenue.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base text-[#4d5d58] sm:text-lg">
                Hyper Local helps businesses acquire nearby customers, control discount spend, and prove campaign ROI
                with scanner-verified redemptions.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/provider/onboarding" className="rounded-xl bg-[#3744d2] px-4 py-2.5 text-sm font-semibold text-white">
                  Start business onboarding
                </Link>
                <Link href="/how-it-works" className="rounded-xl border border-[#cfd6f5] bg-white px-4 py-2.5 text-sm font-semibold text-[#1f2a2a]">
                  View customer-to-checkout flow
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d9e1ff] bg-white/90 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#3744d2]">Typical first 30 days</p>
              <div className="mt-4 space-y-3">
                <MetricRow label="Offer launch time" value="< 1 day" />
                <MetricRow label="Redemption verification" value="Scanner + token" />
                <MetricRow label="Campaign visibility" value="Live in map + feed" />
                <MetricRow label="Optimization cadence" value="Weekly" />
              </div>
            </div>
          </div>
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={70} className="mt-8" variant="pop">
        <section className="grid gap-4 md:grid-cols-3">
          {outcomes.map((outcome) => (
            <article key={outcome.title} className="rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-sm">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#3744d2]">
                {outcome.icon}
                Outcome
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[#1f2a2a]">{outcome.title}</h2>
              <p className="mt-2 text-sm text-[#5f6d68]">{outcome.body}</p>
            </article>
          ))}
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={100} className="mt-8" variant="pop">
        <section className="rounded-2xl border border-[#dfe5df] bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[#1f2a2a]">Everything your team needs to run offers well</h2>
            <Link href="/provider/onboarding" className="hidden items-center gap-1 text-sm font-semibold text-[#3744d2] sm:inline-flex">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {capabilityGrid.map((item) => (
              <article key={item.title} className="rounded-xl border border-[#e4e8e4] bg-[#fbfcfb] p-4">
                <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#1f6d68]">
                  {item.icon}
                  Capability
                </p>
                <h3 className="mt-2 text-base font-semibold text-[#1f2a2a]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#5f6d68]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={130} className="mt-8" variant="pop">
        <section className="rounded-2xl border border-[#dfe5df] bg-white p-6">
          <h2 className="text-xl font-bold text-[#1f2a2a]">4-week rollout playbook</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {rollout.map((item) => (
              <article key={item.step} className="rounded-xl border border-[#e4e8e4] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#3744d2]">{item.step}</p>
                <h3 className="mt-2 text-base font-semibold text-[#1f2a2a]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#5f6d68]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={160} className="mt-8" variant="pop">
        <section className="rounded-2xl border border-[#dfe5df] bg-white p-6">
          <h2 className="text-xl font-bold text-[#1f2a2a]">Business FAQ</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((item) => (
              <article key={item.q} className="rounded-xl border border-[#e4e8e4] p-4">
                <p className="text-sm font-semibold text-[#1f2a2a]">{item.q}</p>
                <p className="mt-1 text-sm text-[#5f6d68]">{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={190} className="mt-8" variant="pop">
        <section className="rounded-2xl border border-[#3744d2]/20 bg-[#3744d2] p-6 text-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Ready to run your first local growth loop?</h2>
              <p className="mt-1 text-sm text-white/80">Onboard once, launch quickly, and optimize with live data.</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/provider/onboarding"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#3744d2]"
              >
                Register business
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/business"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <QrCode className="h-4 w-4" />
                Open merchant app
              </Link>
            </div>
          </div>
        </section>
      </WebsiteScrollReveal>
    </WebsiteShell>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#e6eaf8] bg-[#f8f9ff] px-3 py-2.5">
      <span className="text-sm text-[#50607c]">{label}</span>
      <span className="text-sm font-semibold text-[#1f2a2a]">{value}</span>
    </div>
  );
}
