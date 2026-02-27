import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  CircleHelp,
  Download,
  Heart,
  MapPinned,
  QrCode,
  Sparkles,
  Ticket,
  Zap,
} from "lucide-react";
import { WebsiteShell } from "@/components/website/WebsiteShell";
import WebsiteScrollReveal from "@/components/website/WebsiteScrollReveal";

const consumerStats = [
  { value: "Live", label: "Real-time map discovery" },
  { value: "< 20s", label: "Instant redemption" },
  { value: "Secure", label: "Verified local deals" },
  { value: "Free", label: "No hidden fees ever" },
];

const features = [
  {
    title: "Discover Nearby",
    body: "Find hidden gems and exclusive offers within walking distance of your current location.",
    icon: <MapPinned className="h-4 w-4" />,
  },
  {
    title: "One-Tap Claiming",
    body: "Reserved your spot instantly. No more missing out on limited-time local specials.",
    icon: <Ticket className="h-4 w-4" />,
  },
  {
    title: "Seamless Flow",
    body: "Show your digital token at the counter and you're done. No paper, no fuss.",
    icon: <QrCode className="h-4 w-4" />,
  },
];

const steps = [
  {
    title: "Explore",
    body: "Open the map to see exactly what's happening around you right now.",
    icon: <BellRing className="h-4 w-4" />,
  },
  {
    title: "Claim",
    body: "Tap once to lock in an offer. It's saved in your wallet instantly.",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    title: "Enjoy",
    body: "Visit the shop, scan your code, and enjoy your local savings.",
    icon: <Zap className="h-4 w-4" />,
  },
];

export default function WebsiteHome() {
  return (
    <WebsiteShell>
      <WebsiteScrollReveal>
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[#dbe3db] bg-gradient-to-br from-[#f0f9ff] via-white to-[#fff7ed] p-8 sm:p-16">
          <div className="website-orb-slow absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[#3744D2]/10 blur-[100px]" />
          <div className="website-orb-fast absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#ff7a59]/10 blur-[100px]" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d6e4dc] bg-white/90 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#3744D2] mb-6 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Revolutionizing Local Discovery
            </p>
            <h1 className="text-5xl font-black leading-[0.9] tracking-tighter text-[#1f2a2a] sm:text-7xl">
              Your neighborhood, <br />
              <span className="text-[#3744D2]">re-discovered.</span>
            </h1>
            <p className="mt-8 max-w-2xl mx-auto text-lg text-[#4f5f59] font-medium leading-relaxed">
              Find the best deals, hidden gems, and local favorites within a 5-minute walk.
              Start claiming exclusive offers from businesses right outside your door.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-3 rounded-2xl bg-[#3744D2] px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-[#3744D2]/30 transition-transform hover:scale-105 active:scale-95"
              >
                <Download className="h-5 w-5" />
                Download App
              </Link>
              <Link
                href="/for-consumers"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#ced9d1] bg-white px-8 py-4 text-lg font-bold text-[#1f2a2a] hover:bg-[#f8fbf9] transition-colors"
              >
                Learn More
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={100} className="mt-12" variant="pop">
        <section className="grid gap-6 md:grid-cols-4">
          {consumerStats.map((item) => (
            <div key={item.label} className="rounded-3xl border border-[#dfe5df] bg-white p-6 shadow-sm group hover:border-[#3744D2]/30 transition-colors">
              <p className="text-3xl font-black tracking-tight text-[#1f2a2a] group-hover:text-[#3744D2] transition-colors">{item.value}</p>
              <p className="mt-1 text-sm font-bold text-[#5f6d68] uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={200} className="mt-12">
        <section className="rounded-[3rem] border border-[#dfe5df] bg-white p-10 sm:p-16">
          <div className="max-w-3xl mb-12">
            <h2 className="text-4xl font-black tracking-tight text-[#1f2a2a]">Zero friction. <br />All local value.</h2>
            <p className="mt-4 text-lg text-[#5f6d68] font-medium">We built Hyper Local to make discovering your city as easy as scrolling social media—but with actual tangible rewards.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((item) => (
              <article key={item.title} className="rounded-[2rem] border border-[#e4e8e4] bg-[#fbfcfb] p-8 hover:bg-white hover:shadow-xl transition-all">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3744D2]/10 text-[#3744D2]">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-[#1f2a2a]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5f6d68] font-medium">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={300} className="mt-12">
        <section className="rounded-[3rem] bg-[#f8fbff] border border-blue-50 p-10 sm:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
            <Heart className="h-64 w-64 rotate-12" />
          </div>
          <h2 className="text-4xl font-black tracking-tight text-[#1f2a2a] mb-12">How it works in <span className="text-[#3744D2]">3 simple steps.</span></h2>
          <div className="grid gap-12 md:grid-cols-3 relative z-10">
            {steps.map((item, i) => (
              <div key={item.title} className="relative">
                <p className="text-[8rem] font-black text-[#3744D2]/5 absolute -top-20 -left-4 leading-none select-none">0{i + 1}</p>
                <div className="relative">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#3744D2]/10 text-[#3744D2]">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black text-[#1f2a2a]">{item.title}</h3>
                  <p className="mt-2 text-[#5f6d68] font-medium leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={340} className="mt-12" variant="pop">
        <section className="rounded-[2.5rem] border border-[#dfe5df] bg-white p-8 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#3744D2]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#3744D2]">
                <CircleHelp className="h-3.5 w-3.5" />
                Contact us
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#1f2a2a]">Need help or want to partner?</h2>
              <p className="mt-2 max-w-2xl text-sm text-[#5f6d68] sm:text-base">
                Reach support for account issues, merchant onboarding, and local partnership requests.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3744D2] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#3744D2]/20 hover:bg-[#2e38ad]"
            >
              Open Contact Form
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </WebsiteScrollReveal>

      <WebsiteScrollReveal delayMs={400} className="my-12">
        <section className="relative overflow-hidden rounded-[3rem] border border-[#dfe5df] bg-[#1f2a2a] p-12 text-white sm:p-20 text-center">
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#3744D2]/20 blur-[100px]" />
          <div className="absolute left-0 bottom-0 h-96 w-96 translate-y-1/2 -translate-x-1/2 rounded-full bg-[#ff7a59]/10 blur-[100px]" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black leading-[0.9] tracking-tighter sm:text-6xl mb-8">
              Start exploring <br />your city today.
            </h2>
            <p className="text-lg text-white/70 mb-10 font-medium">
              Join thousands of locals getting more out of their neighborhood. Download the app and see what&apos;s happening nearby.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-[#1f2a2a] shadow-2xl hover:scale-105 transition-transform"
              >
                Create Account
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-8 py-4 text-lg font-bold text-white hover:bg-white/10 transition-all"
              >
                <Download className="h-5 w-5" />
                iOS & Android
              </Link>
            </div>
          </div>
        </section>
      </WebsiteScrollReveal>
    </WebsiteShell>
  );
}
