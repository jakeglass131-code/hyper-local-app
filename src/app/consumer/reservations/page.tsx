"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { BellRing, CheckCircle2, Clock, Fuel, MapPin, Tag, Trash2, Zap } from "lucide-react";
import { Offer } from "@/lib/store";
import { LogoHeader } from "@/components/consumer/LogoHeader";
import { getBusinessById, getDiscountLabel, getExpiryLabel, useOffersData } from "@/components/consumer/offers/shared";

type TokenData = {
  token: string;
  shortCode: string;
};

export default function ReservationsPage() {
  const router = useRouter();
  const { cartOffers, claims, claimOffers, allOffers, totalItems, removeFromCart, loading, refresh } = useOffersData();

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);

  const liveOffers = useMemo(
    () => allOffers.filter((offer) => offer.isActive && offer.claimedCount < offer.inventory),
    [allOffers]
  );

  const featuredOffers = useMemo(() => liveOffers.slice(0, 8), [liveOffers]);

  const fuelOffersCount = useMemo(
    () =>
      liveOffers.filter((offer) => {
        const haystack = `${offer.title} ${offer.description} ${offer.productType || ""}`.toLowerCase();
        return haystack.includes("fuel") || haystack.includes("petrol") || haystack.includes("gas") || haystack.includes("diesel");
      }).length,
    [liveOffers]
  );

  const points = useMemo(() => claims.length * 45 + cartOffers.length * 30 + 120, [claims.length, cartOffers.length]);
  const pointsCap = 1000;
  const progress = Math.min(100, (points / pointsCap) * 100);
  const pointsRemaining = Math.max(pointsCap - points, 0);

  const handleRedeemClick = async (offer: Offer) => {
    setSelectedOffer(offer);
    setLoadingToken(true);

    try {
      const res = await fetch("/api/token/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId: offer.id }),
      });
      const data = await res.json();

      if (res.ok) {
        setTokenData(data);
      } else {
        alert("Failed to generate redemption token");
        setSelectedOffer(null);
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
      setSelectedOffer(null);
    } finally {
      setLoadingToken(false);
    }
  };

  const handleCancelClaim = async (claimId: string) => {
    if (!confirm("Cancel this claim?")) return;

    try {
      await fetch(`/api/claims/${claimId}`, { method: "DELETE" });
      await refresh();
    } catch {
      alert("Failed to cancel claim");
    }
  };

  return (
    <div className="min-h-screen bg-[#d8f2fb] pb-28">
      <LogoHeader />

      <header className="px-5 pb-3 pt-4">
        <p className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1d4f93]">
          <BellRing className="h-3.5 w-3.5" />
          Offers
        </p>
        <h1 className="mt-2 text-[32px] font-bold tracking-tight text-[#163b79]">Available offers</h1>
        <p className="text-sm text-[#31527e]">Activate and redeem your local discounts in one place.</p>
      </header>

      <main className="space-y-4 px-4">
        <section className="overflow-x-auto pb-1 no-scrollbar">
          <div className="flex gap-3">
            {featuredOffers.map((offer) => {
              const business = getBusinessById(offer.businessId);
              if (!business) return null;

              return (
                <button
                  type="button"
                  key={offer.id}
                  onClick={() => router.push("/consumer/map")}
                  className="w-[90px] shrink-0 text-left"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-[#57a6f4] bg-white p-0.5 shadow-sm">
                    <img src={business.image} alt={business.name} className="h-full w-full rounded-full object-cover" />
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#163b79]">{business.name}</p>
                  <p className="line-clamp-1 text-[11px] text-[#4b638a]">{offer.title}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-[#d9e7f8] bg-white p-5 shadow-sm">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[48px] font-bold leading-none tracking-tight text-[#1f66d5]">{points}</p>
            <p className="text-lg font-semibold text-[#1f66d5]">points</p>
          </div>

          <div className="mt-4 h-2 rounded-full bg-[#dff0fb]">
            <div className="h-2 rounded-full bg-gradient-to-r from-[#8e73ff] to-[#4ab9ee]" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-2 flex items-center justify-between text-sm text-[#4a6a96]">
            <span>{pointsRemaining} points until your next discount bonus</span>
            <span>{pointsCap}</span>
          </div>
        </section>

        <section className="space-y-3">
          <SummaryRow
            icon={<Zap className="h-5 w-5 text-[#1f66d5]" />}
            title="Available offers"
            subtitle="Activate offers to earn more points"
            count={liveOffers.length}
          />
          <SummaryRow
            icon={<CheckCircle2 className="h-5 w-5 text-[#1f66d5]" />}
            title="Activated offers"
            subtitle="Offers ready to use now"
            count={totalItems}
          />
          <SummaryRow
            icon={<Fuel className="h-5 w-5 text-[#1f66d5]" />}
            title="Fuel offers"
            subtitle="Activate fuel offers before you refill"
            count={fuelOffersCount}
          />
        </section>

        <section className="rounded-3xl border border-[#d9e7f8] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#163b79]">My offers</h2>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1f66d5]">
              <Link href="/consumer/reservations/favourite-offers" className="hover:underline">
                Favourite offers
              </Link>
              <span className="text-[#9cb1d3]">•</span>
              <Link href="/consumer/reservations/favourite-businesses" className="hover:underline">
                Businesses
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-2xl border border-[#e3ebf6] bg-[#f7fbff]" />
              ))}
            </div>
          ) : totalItems === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d7e3f3] bg-[#f8fcff] p-6 text-center">
              <p className="text-sm font-semibold text-[#163b79]">No active offers yet</p>
              <p className="mt-1 text-sm text-[#57719a]">Explore the map and claim an offer to see it here.</p>
              <button
                onClick={() => router.push("/consumer/map")}
                className="mt-4 rounded-xl bg-[#1f66d5] px-4 py-2 text-sm font-semibold text-white"
              >
                Explore map
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {cartOffers.map((offer) => {
                const business = getBusinessById(offer.businessId);
                if (!business) return null;

                return (
                  <OfferCard
                    key={`reserved-${offer.id}`}
                    offer={offer}
                    businessName={business.name}
                    businessAddress={business.address}
                    businessImage={business.image}
                    statusLabel="Reserved"
                    onRedeem={() => handleRedeemClick(offer)}
                    onRemove={() => removeFromCart(offer.id)}
                  />
                );
              })}

              {claims.map((claim) => {
                const offer = claimOffers.get(claim.offerId);
                if (!offer) return null;

                const business = getBusinessById(offer.businessId);
                if (!business) return null;

                return (
                  <OfferCard
                    key={claim.id}
                    offer={offer}
                    businessName={business.name}
                    businessAddress={business.address}
                    businessImage={business.image}
                    statusLabel="Ready"
                    onRedeem={() => handleRedeemClick(offer)}
                    onRemove={() => handleCancelClaim(claim.id)}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-sm rounded-3xl border border-[#dfe4df] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-[#1f2937]">Redeem offer</h3>
            <p className="mt-1 text-sm text-[#6b7280]">Show this QR code to the merchant</p>

            {loadingToken ? (
              <div className="flex justify-center py-12">
                <div className="h-11 w-11 animate-spin rounded-full border-b-2 border-[#1f6d68]" />
              </div>
            ) : (
              <>
                <div className="mt-6 flex justify-center">
                  <div className="rounded-2xl border border-dashed border-[#d7ddd7] p-4">
                    <QRCodeSVG value={tokenData?.token || ""} size={200} level="H" includeMargin={true} />
                  </div>
                </div>

                <p className="mt-5 text-center text-xs text-[#9ca3af]">MANUAL CODE</p>
                <p className="mt-1 text-center font-mono text-3xl font-bold tracking-widest text-[#1f6d68]">{tokenData?.shortCode}</p>
              </>
            )}

            <button
              onClick={() => {
                setSelectedOffer(null);
                setTokenData(null);
              }}
              className="mt-6 w-full rounded-xl bg-[#eef2ef] py-3 text-sm font-semibold text-[#1f2937]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({
  icon,
  title,
  subtitle,
  count,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  count: number;
}) {
  return (
    <article className="flex items-center justify-between rounded-3xl border border-[#d9e7f8] bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-[#e4f3ff] p-2.5">{icon}</div>
        <div>
          <p className="text-lg font-semibold leading-tight text-[#163b79]">{title}</p>
          <p className="text-sm text-[#5f78a0]">{subtitle}</p>
        </div>
      </div>
      <p className="text-3xl font-semibold text-[#1f66d5]">{count}</p>
    </article>
  );
}

function OfferCard({
  offer,
  businessName,
  businessAddress,
  businessImage,
  statusLabel,
  onRedeem,
  onRemove,
}: {
  offer: Offer;
  businessName: string;
  businessAddress: string;
  businessImage: string;
  statusLabel: string;
  onRedeem: () => void;
  onRemove: () => void;
}) {
  return (
    <article className="rounded-2xl border border-[#dce7f5] bg-[#f9fcff] p-3">
      <div className="flex items-start gap-3">
        <img src={businessImage} alt={businessName} className="h-14 w-14 rounded-xl object-cover" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-1 text-base font-semibold text-[#183f7f]">{offer.title}</h3>
              <p className="line-clamp-1 text-sm text-[#55739d]">{businessName}</p>
            </div>

            <span className="rounded-full bg-[#e9f3ff] px-2.5 py-1 text-xs font-semibold text-[#1f66d5]">{statusLabel}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#5f78a0]">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5">
              <Tag className="h-3 w-3" />
              {getDiscountLabel(offer)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {businessAddress}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getExpiryLabel(offer)}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button onClick={onRedeem} className="rounded-xl bg-[#1f66d5] px-4 py-2 text-sm font-semibold text-white">
              Redeem
            </button>
            <button
              onClick={onRemove}
              className="rounded-xl border border-[#cddcf0] bg-white p-2.5 text-[#8398b8] hover:text-[#ef4444]"
              title="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
