import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConsumerState {
    favourites: string[];
    toggleFavourite: (id: string) => void;
    isFavourite: (id: string) => boolean;

    preferences: {
        categories: string[];
        distance: number;
        liveDealsOnly: boolean;
    };
    setPreferences: (prefs: Partial<ConsumerState["preferences"]>) => void;

    location: { lat: number; lng: number } | null;
    setLocation: (loc: { lat: number; lng: number }) => void;

    myClaims: string[];
    addClaim: (claimId: string) => void;

    appearance: {
        theme: "light" | "dark" | "system";
        accentColor: string;
        highContrast: boolean;
    };
    setAppearance: (appearance: Partial<ConsumerState["appearance"]>) => void;

    favouriteAlerts: Record<string, boolean>;
    toggleFavouriteAlert: (id: string) => void;
    favouriteTags: Record<string, string[]>;
    setFavouriteTags: (id: string, tags: string[]) => void;

    // Map center persistence
    lastMapCenter: { lat: number; lng: number; zoom: number } | null;
    setLastMapCenter: (center: { lat: number; lng: number; zoom: number }) => void;

    // Cart
    cart: any[];
    addToCart: (offer: any) => void;
    removeFromCart: (offerId: string) => void;
    clearCart: () => void;
}

export const useConsumerStore = create<ConsumerState>()(
    persist(
        (set, get) => ({
            favourites: [],
            toggleFavourite: (id) =>
                set((state) => {
                    const favs = new Set(state.favourites);
                    if (favs.has(id)) {
                        favs.delete(id);
                    } else {
                        favs.add(id);
                    }
                    return { favourites: Array.from(favs) };
                }),
            isFavourite: (id) => get().favourites.includes(id),

            preferences: {
                categories: [],
                distance: 5,
                liveDealsOnly: false,
            },
            setPreferences: (prefs) =>
                set((state) => ({
                    preferences: { ...state.preferences, ...prefs },
                })),

            location: null,
            setLocation: (loc) => set({ location: loc }),

            myClaims: [],
            addClaim: (claimId) =>
                set((state) => ({
                    myClaims: [...state.myClaims, claimId],
                })),

            appearance: {
                theme: "system",
                accentColor: "#3744D2",
                highContrast: false,
            },
            setAppearance: (appearance) =>
                set((state) => ({
                    appearance: { ...state.appearance, ...appearance },
                })),

            favouriteAlerts: {},
            toggleFavouriteAlert: (id) =>
                set((state) => ({
                    favouriteAlerts: {
                        ...state.favouriteAlerts,
                        [id]: !state.favouriteAlerts[id],
                    },
                })),
            favouriteTags: {},
            setFavouriteTags: (id, tags) =>
                set((state) => ({
                    favouriteTags: {
                        ...state.favouriteTags,
                        [id]: tags,
                    },
                })),

            lastMapCenter: null,
            setLastMapCenter: (center) => set({ lastMapCenter: center }),

            cart: [],
            addToCart: (offer) => set((state) => ({ cart: [...state.cart, offer] })),
            removeFromCart: (offerId) => set((state) => ({ cart: state.cart.filter((o) => o.id !== offerId) })),
            clearCart: () => set({ cart: [] }),
        }),
        {
            name: "consumer-storage",
            partialize: (state) => ({
                favourites: state.favourites,
                preferences: state.preferences,
                myClaims: state.myClaims,
                appearance: state.appearance,
                favouriteAlerts: state.favouriteAlerts,
                favouriteTags: state.favouriteTags,
                lastMapCenter: state.lastMapCenter,
                cart: state.cart,
            }),
        }
    )
);
