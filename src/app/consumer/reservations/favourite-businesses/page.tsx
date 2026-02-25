"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Star, Store, Ticket } from "lucide-react";
import { ScrollReveal } from "@/components/consumer/ScrollReveal";
import { EmptyStateCard, OffersHeader, useOffersData } from "@/components/consumer/offers/shared";

export default function FavouriteBusinessesPage() {
  const router = useRouter();
  const { favBusinesses, allOffers, toggleFavourite, loading } = useOffersData();

  const activeOffersByBusiness = useMemo(() => {
    const map = new Map<string, number>();

    allOffers.forEach((offer) => {
      if (!offer.isActive) return;
      map.set(offer.businessId, (map.get(offer.businessId) || 0) + 1);
    });

    return map;
  }, [allOffers]);

  const businessesWithDeals = useMemo(
    () => favBusinesses.filter((business) => (activeOffersByBusiness.get(business.id) || 0) > 0).length,
    [favBusinesses, activeOffersByBusiness]
  );

  return (
    <div className="min-h-screen bg-[#f6f8f5] pb-24">
      <OffersHeader
        title="Favourite Businesses"
        subtitle="Your saved stores in one place, with active deal visibility for faster planning."
      />

      <main className="space-y-4 px-4 py-5">
        <ScrollReveal className="grid grid-cols-1 gap-3 sm:grid-cols-3" variant="pop">
          <MetricCard label="Saved businesses" value={favBusinesses.length} tone="text-[#3744D2]" />
          <MetricCard label="With live deals" value={businessesWithDeals} tone="text-[#3744d2]" />
          <MetricCard label="To revisit" value={Math.max(0, favBusinesses.length - businessesWithDeals)} tone="text-[#9a5800]" />
        </ScrollReveal>

        <ScrollReveal delayMs={80}>
          <section className="rounded-2xl border border-[#dfe4df] bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#eef2ff] p-2 text-[#3744d2]">
                <Store className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1f2937]">Business watchlist</p>
                <p className="mt-1 text-sm text-[#61706a]">
                  Keep your top local businesses here and jump into map view when new offers go live.
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
        ) : favBusinesses.length === 0 ? (
          <ScrollReveal>
            <EmptyStateCard
              title="No favourite businesses yet"
              body="Tap the shop button next to a business to keep it here for quick access."
              ctaLabel="Find nearby businesses"
              onClick={() => router.push("/consumer/map")}
            />
          </ScrollReveal>
        ) : (
          <section className="space-y-3">
            {favBusinesses.map((business, index) => {
              const activeDealCount = activeOffersByBusiness.get(business.id) || 0;

              return (
                <ScrollReveal
                  key={business.id}
                  className="rounded-2xl border border-[#dfe4df] bg-white p-4 shadow-[0_2px_6px_rgba(16,24,40,0.06)]"
                  delayMs={index * 70}
                  variant="pop"
                >
                  <article className="flex items-start gap-3">
                    <img src={business.image} alt={business.name} className="h-14 w-14 rounded-xl object-cover" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="line-clamp-1 text-base font-semibold text-[#1f2937]">{business.name}</h3>
                          <p className="line-clamp-1 text-sm text-[#5f6b66]">{business.category}</p>
                        </div>

                        <button
                          onClick={() => toggleFavourite(business.id)}
                          className="rounded-full bg-[#ef4444] p-2 text-white hover:bg-[#dc2626]"
                          aria-label={`Remove ${business.name} from favourites`}
                        >
                          <Store className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#6b7280]">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
                          {business.rating.toFixed(1)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {business.address}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#eef1ff] px-2 py-0.5 font-semibold text-[#3744D2]">
                          <Ticket className="h-3 w-3" />
                          {activeDealCount} live {activeDealCount === 1 ? "deal" : "deals"}
                        </span>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => router.push("/consumer/map")}
                          className="rounded-lg bg-[#3744D2] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          View on map
                        </button>
                        <button
                          onClick={() => router.push("/consumer/reservations/favourite-offers")}
                          className="rounded-lg border border-[#dde3dd] px-3 py-1.5 text-xs font-semibold text-[#4b5a55]"
                        >
                          Open offers
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
