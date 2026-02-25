"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Clock, MapPin, Sparkles, Tag, Trash2, Zap } from "lucide-react";
import { Offer } from "@/lib/store";
import { ScrollReveal } from "@/components/consumer/ScrollReveal";
import { cn } from "@/lib/utils";
import {
  EmptyStateCard,
  OffersHeader,
  getBusinessById,
  getDiscountLabel,
  getExpiryLabel,
  useOffersData,
} from "@/components/consumer/offers/shared";

type TokenData = {
  token: string;
  shortCode: string;
};

export default function ReservationsPage() {
  const router = useRouter();
  const { cartOffers, claims, claimOffers, totalItems, removeFromCart, loading, refresh } = useOffersData();

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);

  const points = useMemo(() => claims.length * 45 + cartOffers.length * 30 + 120, [claims.length, cartOffers.length]);

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
    <div className="min-h-screen bg-[#f6f8f5] pb-24">
      <OffersHeader
        title="Redeemed Offers"
        subtitle="Manage your active claims and redeem them at the shop to save instantly."
      />

      <main className="space-y-4 px-4 py-5">
        <ScrollReveal className="grid grid-cols-1 gap-3 sm:grid-cols-3" variant="pop">
          <MetricCard label="loyalty points" value={points} tone="text-[#3744D2]" />
          <MetricCard label="ready to redeem" value={claims.length} tone="text-[#3744D2]" />
          <MetricCard label="active reservations" value={cartOffers.length} tone="text-[#3744D2]" />
        </ScrollReveal>

        <ScrollReveal delayMs={80}>
          <section className="rounded-2xl border border-[#dfe4df] bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#eef1ff] p-2 text-[#3744D2]">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1f2937]">Points strategy</p>
                <p className="mt-1 text-sm text-[#61706a]">
                  Each redemption earns you 45 reward points. Hit 1000 to unlock exclusive high-value vouchers.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {loading ? (
          <section className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-2xl border border-[#e3ebf6] bg-white/80" />
            ))}
          </section>
        ) : totalItems === 0 ? (
          <ScrollReveal>
            <EmptyStateCard
              title="No active offers yet"
              body="Explore the map and claim an offer to see it here and start redeeming."
              ctaLabel="Browse map offers"
              onClick={() => router.push("/consumer/map")}
            />
          </ScrollReveal>
        ) : (
          <section className="space-y-3">
            {cartOffers.map((offer, index) => {
              const business = getBusinessById(offer.businessId);
              if (!business) return null;

              return (
                <ScrollReveal
                  key={`reserved-${offer.id}`}
                  className="rounded-2xl border border-[#dfe4df] bg-white p-4 shadow-[0_2px_6px_rgba(16,24,40,0.06)]"
                  delayMs={index * 70}
                  variant="pop"
                >
                  <OfferCard
                    offer={offer}
                    businessName={business.name}
                    businessAddress={business.address}
                    businessImage={business.image}
                    statusLabel="In Cart"
                    statusColor="bg-blue-50 text-blue-600 border-blue-100"
                    onRedeem={() => handleRedeemClick(offer)}
                    onRemove={() => removeFromCart(offer.id)}
                  />
                </ScrollReveal>
              );
            })}

            {claims.map((claim, index) => {
              const offer = claimOffers.get(claim.offerId);
              if (!offer) return null;

              const business = getBusinessById(offer.businessId);
              if (!business) return null;

              return (
                <ScrollReveal
                  key={claim.id}
                  className="rounded-2xl border border-[#dfe4df] bg-white p-4 shadow-[0_2px_6px_rgba(16,24,40,0.06)]"
                  delayMs={(cartOffers.length + index) * 70}
                  variant="pop"
                >
                  <OfferCard
                    offer={offer}
                    businessName={business.name}
                    businessAddress={business.address}
                    businessImage={business.image}
                    statusLabel="Claimed"
                    statusColor="bg-green-50 text-green-600 border-green-100"
                    onRedeem={() => handleRedeemClick(offer)}
                    onRemove={() => handleCancelClaim(claim.id)}
                  />
                </ScrollReveal>
              );
            })}
          </section>
        )}
      </main>

      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[2.5rem] border border-[#dfe4df] bg-white p-8 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#eef1ff] p-2 text-[#3744D2]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1f2937]">Redeem Offer</h3>
                <p className="text-sm text-[#6b7280]">Show this at the checkout counter</p>
              </div>
            </div>

            {loadingToken ? (
              <div className="flex justify-center py-12">
                <div className="h-11 w-11 animate-spin rounded-full border-b-2 border-[#3744D2]" />
              </div>
            ) : (
              <>
                <div className="mt-8 flex justify-center">
                  <div className="rounded-[2.5rem] border-4 border-[#3744D2]/10 bg-white p-6 shadow-inner">
                    <QRCodeSVG value={tokenData?.token || ""} size={180} level="H" includeMargin={false} />
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Manual Entry Code</p>
                  <p className="text-center font-mono text-4xl font-black tracking-[0.2em] text-[#3744D2]">{tokenData?.shortCode}</p>
                </div>
              </>
            )}

            <button
              onClick={() => {
                setSelectedOffer(null);
                setTokenData(null);
              }}
              className="mt-10 w-full rounded-2xl bg-[#f3f4f6] py-4 text-sm font-black text-[#1f2937] active:scale-[0.98] transition-transform"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
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

function OfferCard({
  offer,
  businessName,
  businessAddress,
  businessImage,
  statusLabel,
  statusColor,
  onRedeem,
  onRemove,
}: {
  offer: Offer;
  businessName: string;
  businessAddress: string;
  businessImage: string;
  statusLabel: string;
  statusColor: string;
  onRedeem: () => void;
  onRemove: () => void;
}) {
  return (
    <article>
      <div className="flex items-start gap-4">
        <img src={businessImage} alt={businessName} className="h-16 w-16 rounded-2xl object-cover shadow-sm" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-1 text-base font-bold text-[#1f2937]">{offer.title}</h3>
              <p className="line-clamp-1 text-sm font-medium text-[#5f6b66]">{businessName}</p>
            </div>

            <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider", statusColor)}>
              {statusLabel}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#6b7280]">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f4f6] px-2 py-0.5 font-bold">
              <Tag className="h-3 w-3" />
              {getDiscountLabel(offer)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getExpiryLabel(offer)}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              onClick={onRemove}
              className="rounded-xl border border-[#dfe4df] p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Remove"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={onRedeem}
              className="rounded-xl bg-[#3744D2] px-5 py-2 text-sm font-black text-white shadow-lg shadow-[#3744D2]/20 active:scale-95 transition-transform"
            >
              REDEEM NOW
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
