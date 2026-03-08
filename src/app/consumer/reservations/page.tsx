"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Clock, MapPin, Sparkles, Tag, Trash2, Zap, Ticket } from "lucide-react";
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
    <div className="min-h-screen bg-[#f2f2f7] pb-24 font-sans text-gray-900">
      <OffersHeader
        title="Redeemed Offers"
        subtitle="Manage your active claims and redeem them at the shop to save instantly."
      />

      <main className="space-y-4 px-4 py-5">

        <ScrollReveal delayMs={80}>
          <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="rounded-2xl bg-gray-50 p-3 text-black shrink-0">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900 tracking-tight">Status: Enthusiast</p>
              <p className="mt-1 text-sm font-medium text-gray-500 leading-relaxed">
                You're earning points with every offer. Unlock VIP discounts at local spots soon!
              </p>
            </div>
          </section>
        </ScrollReveal>

        {loading ? (
          <section className="space-y-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-[2rem] border border-gray-100 bg-white shadow-sm" />
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
                  key={`reserved-${offer.id}-${index}`}
                  className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100"
                  delayMs={index * 70}
                  variant="pop"
                >
                  <OfferCard
                    offer={offer}
                    businessName={business.name}
                    businessAddress={business.address}
                    businessImage={business.image}
                    statusLabel="In Cart"
                    statusColor="bg-gray-100 text-gray-900"
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
                  className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100"
                  delayMs={(cartOffers.length + index) * 70}
                  variant="pop"
                >
                  <OfferCard
                    offer={offer}
                    businessName={business.name}
                    businessAddress={business.address}
                    businessImage={business.image}
                    statusLabel="Claimed"
                    statusColor="bg-black text-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOffer(null)} />
          <div className="relative w-full max-w-sm rounded-[2rem] border border-gray-100 bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-gray-50 p-3 text-black shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Redeem Offer</h3>
                <p className="text-sm font-medium text-gray-500">Show this at the counter</p>
              </div>
            </div>

            {loadingToken ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
              </div>
            ) : (
              <>
                <div className="mt-8 flex justify-center">
                  <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-gray-100">
                    <QRCodeSVG value={tokenData?.token || ""} size={180} level="H" includeMargin={false} />
                  </div>
                </div>

                <div className="mt-8 space-y-2 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Manual Entry Code</p>
                  <p className="font-mono text-4xl font-black tracking-widest text-black">{tokenData?.shortCode}</p>
                </div>
              </>
            )}

            <button
              onClick={() => {
                setSelectedOffer(null);
                setTokenData(null);
              }}
              className="mt-10 w-full rounded-2xl bg-gray-50 hover:bg-gray-100 py-4 text-sm font-bold text-gray-900 active:scale-95 transition-all text-center"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
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
        <img src={businessImage} alt={businessName} className="h-16 w-16 rounded-2xl object-cover shadow-sm bg-gray-100 shrink-0" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-1 text-base font-bold text-gray-900 tracking-tight">{offer.title}</h3>
              <p className="line-clamp-1 text-sm font-medium text-gray-500">{businessName}</p>
            </div>

            <span className={cn("rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", statusColor)}>
              {statusLabel}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 px-2 py-1 text-gray-700">
              <Tag className="h-3 w-3" />
              {getDiscountLabel(offer)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 px-2 py-1">
              <Clock className="h-3 w-3" />
              {getExpiryLabel(offer)}
            </span>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              onClick={onRemove}
              className="rounded-[1rem] bg-gray-50 p-3 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors active:scale-95"
              title="Remove"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={onRedeem}
              className="rounded-[1rem] bg-black px-6 py-3 text-xs tracking-wider uppercase font-bold text-white shadow-md shadow-black/10 active:scale-95 transition-all flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              Redeem
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
