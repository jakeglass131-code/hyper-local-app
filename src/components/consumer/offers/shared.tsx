"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Heart, Ticket } from "lucide-react";
import { LogoHeader } from "@/components/consumer/LogoHeader";
import { MOCK_BUSINESSES } from "@/lib/mockData";
import { Offer, Claim } from "@/lib/store";
import { useConsumerStore } from "@/store/consumerStore";
import { cn } from "@/lib/utils";

const userId = "user_123";

type HeaderProps = {
  title: string;
  subtitle: string;
};

type OffersData = {
  cartOffers: Offer[];
  claims: Claim[];
  claimOffers: Map<string, Offer>;
  allOffers: Offer[];
  favOffers: Offer[];
  totalItems: number;
  totalFavourites: number;
  favourites: string[];
  toggleFavourite: (id: string) => void;
  removeFromCart: (offerId: string) => void;
  loading: boolean;
  refresh: () => Promise<void>;
};

const tabs = [
  { href: "/consumer/reservations", label: "Redeemed", icon: Ticket },
  { href: "/consumer/reservations/favourite-offers", label: "Saved Offers", icon: Heart },
];

export function getDiscountLabel(offer: Offer): string {
  if (offer.discountType === "percent") return `${offer.value}% off`;
  if (offer.discountType === "fixed") return `$${offer.value} off`;
  return "Special offer";
}

export function getExpiryLabel(offer: Offer): string {
  const endsAt = offer.endsAt ?? 0;
  const msRemaining = endsAt - Date.now();
  if (msRemaining <= 0) return "Expired";

  const hoursRemaining = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60)));
  if (hoursRemaining < 24) return `Ends in ${hoursRemaining}h`;

  const daysRemaining = Math.ceil(hoursRemaining / 24);
  return `Ends in ${daysRemaining}d`;
}

export function getBusinessById(id: string) {
  return MOCK_BUSINESSES.find((business) => business.id === id);
}

export function OffersHeader({ title, subtitle }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 px-4 pt-10 pb-6 bg-[#f2f2f7]/95 backdrop-blur-md border-b border-gray-200/50 flex flex-col gap-6">
      <LogoHeader />
      <div className="flex flex-col gap-2 mt-4">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">{title}</h1>
        <p className="text-sm font-medium text-gray-500 leading-relaxed">{subtitle}</p>
      </div>

      <nav className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "snap-start inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all whitespace-nowrap active:scale-95",
                isActive
                  ? "bg-black text-white shadow-md shadow-black/10"
                  : "bg-white text-gray-500 border border-gray-200/60 hover:border-gray-300"
              )}
            >
              <tab.icon className={cn("h-4 w-4", isActive && "stroke-[2.5]")} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export function EmptyStateCard({
  title,
  body,
  ctaLabel,
  onClick,
}: {
  title: string;
  body: string;
  ctaLabel: string;
  onClick: () => void;
}) {
  return (
    <section className="bg-white rounded-[2rem] border border-gray-100 p-8 text-center shadow-sm flex flex-col items-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
        <Ticket className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm font-medium text-gray-500 leading-relaxed">{body}</p>
      <button
        onClick={onClick}
        className="mt-6 rounded-2xl bg-black px-8 py-3.5 text-sm font-bold text-white transition-transform active:scale-95 shadow-md shadow-black/10"
      >
        {ctaLabel}
      </button>
    </section>
  );
}

export function useOffersData(): OffersData {
  const { cart, removeFromCart, favourites, toggleFavourite } = useConsumerStore();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [claimOffers, setClaimOffers] = useState<Map<string, Offer>>(new Map());
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const cartOffers = useMemo(() => cart as Offer[], [cart]);

  const fetchClaimsAndOffers = useCallback(async () => {
    try {
      const [claimsRes, offersRes] = await Promise.all([
        fetch(`/api/claims?userId=${userId}`),
        fetch("/api/offers?includeInactive=true"),
      ]);

      const claimsData: Claim[] = await claimsRes.json();
      const offersData: Offer[] = await offersRes.json();

      setClaims(claimsData);
      setAllOffers(offersData);

      const offerIds = new Set(claimsData.map((claim) => claim.offerId));
      const offersMap = new Map<string, Offer>();
      offersData.forEach((offer) => {
        if (offerIds.has(offer.id)) offersMap.set(offer.id, offer);
      });

      setClaimOffers(offersMap);
    } catch (error) {
      console.error("Failed to load offers data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaimsAndOffers();
  }, [fetchClaimsAndOffers]);

  const favOfferPool = useMemo(() => {
    const merged = [...allOffers, ...Array.from(claimOffers.values()), ...cartOffers];
    const seen = new Set<string>();

    return merged.filter((offer) => {
      if (!offer?.id || seen.has(offer.id)) return false;
      seen.add(offer.id);
      return true;
    });
  }, [allOffers, claimOffers, cartOffers]);

  const favOffers = useMemo(
    () => favOfferPool.filter((offer) => favourites.includes(offer.id)),
    [favOfferPool, favourites]
  );

  return {
    cartOffers,
    claims,
    claimOffers,
    allOffers,
    favOffers,
    totalItems: cartOffers.length + claims.length,
    totalFavourites: favOffers.length,
    favourites,
    toggleFavourite,
    removeFromCart,
    loading,
    refresh: fetchClaimsAndOffers,
  };
}
