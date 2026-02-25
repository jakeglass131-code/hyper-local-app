"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Heart, Sparkles, Store, Ticket } from "lucide-react";
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
  favBusinesses: typeof MOCK_BUSINESSES;
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
  { href: "/consumer/reservations/favourite-offers", label: "Favourite Offers", icon: Heart },
  { href: "/consumer/reservations/favourite-businesses", label: "Favourite Businesses", icon: Store },
];

export function getDiscountLabel(offer: Offer): string {
  if (offer.discountType === "percent") return `${offer.value}% off`;
  if (offer.discountType === "fixed") return `$${offer.value} off`;
  return "Special offer";
}

export function getExpiryLabel(offer: Offer): string {
  const msRemaining = offer.endsAt - Date.now();
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
    <header className="sticky top-0 z-20 border-b border-[#dfe4df] bg-[#f6f8f5]/95 backdrop-blur">
      <LogoHeader />

      <div className="space-y-4 px-4 pb-4">
        <div>
          <p className="inline-flex items-center gap-1 rounded-full bg-[#eef1ff] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#3744D2]">
            <Sparkles className="h-3 w-3" />
            My Offers Hub
          </p>
          <h1 className="mt-2 text-[30px] font-bold tracking-tight text-[#1f2937]">{title}</h1>
          <p className="mt-1 text-sm text-[#60706a]">{subtitle}</p>
        </div>

        <nav className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "border-[#d7dcff] bg-[#eef1ff] text-[#3744D2]"
                    : "border-[#dde3dd] bg-white text-[#61706a] hover:bg-[#f9fbf9]"
                )}
              >
                <tab.icon className={cn("h-4 w-4", isActive && "stroke-[2.5]")} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
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
    <section className="rounded-2xl border border-dashed border-[#d0d7d1] bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef1ff]">
        <Ticket className="h-7 w-7 text-[#3744D2]" />
      </div>
      <h2 className="text-lg font-semibold text-[#1f2937]">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-[#6b7280]">{body}</p>
      <button
        onClick={onClick}
        className="mt-5 rounded-xl bg-[#3744D2] px-5 py-2.5 text-sm font-semibold text-white"
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

  const favBusinesses = useMemo(
    () => MOCK_BUSINESSES.filter((business) => favourites.includes(business.id)),
    [favourites]
  );

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
    favBusinesses,
    favOffers,
    totalItems: cartOffers.length + claims.length,
    totalFavourites: favBusinesses.length + favOffers.length,
    favourites,
    toggleFavourite,
    removeFromCart,
    loading,
    refresh: fetchClaimsAndOffers,
  };
}
