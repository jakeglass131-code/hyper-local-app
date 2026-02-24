"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Clock, Heart, MapPin, Sparkles, Tag } from "lucide-react";
import { ScrollReveal } from "@/components/consumer/ScrollReveal";
import {
  EmptyStateCard,
  OffersHeader,
  getBusinessById,
  getDiscountLabel,
  getExpiryLabel,
  useOffersData,
} from "@/components/consumer/offers/shared";

export default function FavouriteOffersPage() {
  const router = useRouter();
  const { favOffers, toggleFavourite, loading } = useOffersData();

  const expiringSoon = useMemo(
    () =>
      favOffers.filter((offer) => {
        const expiryLabel = getExpiryLabel(offer);
        return expiryLabel.startsWith("Ends in") && expiryLabel.endsWith("h");
      }).length,
    [favOffers]
  );

  return (
    <div className="min-h-screen bg-[#f6f8f5] pb-24">
      <OffersHeader
        title="Favourite Offers"
        subtitle="Your saved deals, organized so you can quickly act on what expires first."
      />

      <main className="space-y-4 px-4 py-5">
        <ScrollReveal className="grid grid-cols-1 gap-3 sm:grid-cols-3" variant="pop">
          <MetricCard label="Saved offers" value={favOffers.length} tone="text-[#1f6d68]" />
          <MetricCard label="Expiring in 24h" value={expiringSoon} tone="text-[#dc2626]" />
          <MetricCard label="Ready to redeem" value={Math.max(0, favOffers.length - expiringSoon)} tone="text-[#3744d2]" />
        </ScrollReveal>

        <ScrollReveal delayMs={80}>
          <section className="rounded-2xl border border-[#dfe4df] bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#fff4e9] p-2 text-[#9a5800]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1f2937]">Plan smarter</p>
                <p className="mt-1 text-sm text-[#61706a]">
                  Focus on the deals expiring soon first, then use map view to group nearby redemptions.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {loading ? (
          <section className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl border border-[#e3e8e3] bg-white/80"
              />
            ))}
          </section>
        ) : favOffers.length === 0 ? (
          <ScrollReveal>
            <EmptyStateCard
              title="No favourite offers yet"
              body="Tap the heart next to any offer to save it here for quick access later."
              ctaLabel="Browse map offers"
              onClick={() => router.push("/consumer/map")}
            />
          </ScrollReveal>
        ) : (
          <section className="space-y-3">
            {favOffers.map((offer, index) => {
              const business = getBusinessById(offer.businessId);
              if (!business) return null;

              return (
                <ScrollReveal
                  key={offer.id}
                  className="rounded-2xl border border-[#dfe4df] bg-white p-4 shadow-[0_2px_6px_rgba(16,24,40,0.06)]"
                  delayMs={index * 70}
                  variant="pop"
                >
                  <article className="flex items-start gap-3">
                    <img src={business.image} alt={business.name} className="h-14 w-14 rounded-xl object-cover" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="line-clamp-1 text-base font-semibold text-[#1f2937]">{offer.title}</h3>
                          <p className="line-clamp-1 text-sm text-[#5f6b66]">{business.name}</p>
                        </div>

                        <button
                          onClick={() => toggleFavourite(offer.id)}
                          className="rounded-full p-2 text-[#ea5a65] hover:bg-[#fff1f3]"
                          aria-label={`Remove ${offer.title} from favourites`}
                        >
                          <Heart className="h-4 w-4 fill-[#ea5a65]" />
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#6b7280]">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f4f6] px-2 py-0.5">
                          <Tag className="h-3 w-3" />
                          {getDiscountLabel(offer)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getExpiryLabel(offer)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {business.address}
                        </span>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => router.push("/consumer/map")}
                          className="rounded-lg border border-[#dde3dd] px-3 py-1.5 text-xs font-semibold text-[#4b5a55]"
                        >
                          Open map
                        </button>
                        <button
                          onClick={() => router.push("/consumer/reservations")}
                          className="rounded-lg bg-[#1f6d68] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          Go to redeem
                        </button>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <article className="rounded-2xl border border-[#dfe4df] bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
    </article>
  );
}
