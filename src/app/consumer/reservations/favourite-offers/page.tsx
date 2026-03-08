"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Clock, MapPin, Tag } from "lucide-react";
import { ScrollReveal } from "@/components/consumer/ScrollReveal";
import {
  EmptyStateCard,
  OffersHeader,
  getBusinessById,
  getDiscountLabel,
  getExpiryLabel,
  useOffersData,
} from "@/components/consumer/offers/shared";
import { Offer } from "@/lib/store";

const EXPIRED_VISIBLE_WINDOW_MS = 24 * 60 * 60 * 1000;

export default function FavouriteOffersPage() {
  const router = useRouter();
  const { favOffers, toggleFavourite, loading } = useOffersData();

  const { activeSavedOffers, expiredSavedOffers } = useMemo(() => {
    const now = Date.now();

    return favOffers.reduce(
      (acc, offer) => {
        const endsAt = offer.endsAt ?? 0;

        if (endsAt > now) {
          acc.activeSavedOffers.push(offer);
          return acc;
        }

        if (endsAt > now - EXPIRED_VISIBLE_WINDOW_MS) {
          acc.expiredSavedOffers.push(offer);
        }

        return acc;
      },
      { activeSavedOffers: [] as Offer[], expiredSavedOffers: [] as Offer[] }
    );
  }, [favOffers]);

  const hasVisibleSavedOffers = activeSavedOffers.length > 0 || expiredSavedOffers.length > 0;

  return (
    <div className="min-h-screen bg-[#f2f2f7] pb-24 font-sans text-gray-900">
      <OffersHeader
        title="Saved Offers"
        subtitle="Your saved deals. Expired items stay visible for 24 hours, then auto-hide."
      />

      <main className="space-y-6 px-4 py-5">
        <ScrollReveal className="grid grid-cols-1 gap-3" variant="pop">
          <MetricCard label="Active saved" value={activeSavedOffers.length} tone="text-gray-900" />
        </ScrollReveal>
        {loading ? (
          <section className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-[2rem] border border-gray-100 bg-white shadow-sm" />
            ))}
          </section>
        ) : !hasVisibleSavedOffers ? (
          <ScrollReveal>
            <EmptyStateCard
              title="No saved offers yet"
              body="Tap the bookmark on a home offer card to save it here."
              ctaLabel="Browse map offers"
              onClick={() => router.push("/consumer/map")}
            />
          </ScrollReveal>
        ) : (
          <>
            {activeSavedOffers.length > 0 && (
              <section className="space-y-3">
                <p className="px-1 text-xs font-black uppercase tracking-[0.16em] text-[#62726c]">Active Saved Offers</p>
                {activeSavedOffers.map((offer, index) => (
                  <SavedOfferCard key={offer.id} offer={offer} index={index} toggleFavourite={toggleFavourite} />
                ))}
              </section>
            )}

            {expiredSavedOffers.length >= 0 && (
              <section className="space-y-3 mt-8">
                <ScrollReveal className="grid grid-cols-1 gap-3 mb-4" variant="pop">
                  <MetricCard label="Expired (24h)" value={expiredSavedOffers.length} tone="text-[#9a5800]" />
                </ScrollReveal>

                {expiredSavedOffers.length > 0 && (
                  <>
                    <p className="px-1 text-xs font-black uppercase tracking-[0.16em] text-[#9a5800]">Expired Offers (auto-remove after 24h)</p>
                    {expiredSavedOffers.map((offer, index) => (
                      <SavedOfferCard key={offer.id} offer={offer} index={index} toggleFavourite={toggleFavourite} expired />
                    ))}
                  </>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function SavedOfferCard({
  offer,
  index,
  toggleFavourite,
  expired = false,
}: {
  offer: Offer;
  index: number;
  toggleFavourite: (id: string) => void;
  expired?: boolean;
}) {
  const router = useRouter();
  const business = getBusinessById(offer.businessId);
  if (!business) return null;

  return (
    <ScrollReveal
      className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm"
      delayMs={index * 70}
      variant="pop"
    >
      <article className={expired ? "opacity-75" : ""}>
        <div className="flex items-start gap-3">
          <img src={business.image} alt={business.name} className="h-16 w-16 rounded-2xl object-cover shadow-sm bg-gray-100 shrink-0" />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="line-clamp-1 text-base font-bold tracking-tight text-gray-900">{offer.title}</h3>
                <p className="line-clamp-1 text-sm font-medium text-gray-500">{business.name}</p>
              </div>

              <button
                onClick={() => toggleFavourite(offer.id)}
                className="rounded-full p-2.5 text-[#3744D2] hover:bg-[#edf0ff] transition-colors"
                aria-label={`Remove ${offer.title} from saved offers`}
              >
                <Bookmark className="h-4.5 w-4.5 fill-current" />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 px-2 py-1 text-gray-700">
                <Tag className="h-3 w-3" />
                {getDiscountLabel(offer)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 px-2 py-1">
                <Clock className="h-3 w-3" />
                {getExpiryLabel(offer)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 px-2 py-1">
                <MapPin className="h-3 w-3" />
                {business.address}
              </span>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => router.push("/consumer/map")}
                className="rounded-[1rem] bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors active:scale-95"
              >
                View Map
              </button>
              {!expired && (
                <button
                  onClick={() => router.push("/consumer/reservations")}
                  className="rounded-[1rem] bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-black/10 transition-all active:scale-95"
                >
                  Redeem Info
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    </ScrollReveal>
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
    <article className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className={`text-xl font-black ${tone}`}>{value}</p>
    </article>
  );
}
