import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MerchantState {
    analytics: {
        totalViews: number;
        totalClaims: number;
        totalRedemptions: number;
        conversionRate: number;
    };
    redemptions: any[];
    addRedemption: (redemption: any) => void;
    updateAnalytics: (data: Partial<MerchantState["analytics"]>) => void;
}

export const useMerchantStore = create<MerchantState>()(
    persist(
        (set) => ({
            analytics: {
                totalViews: 1234,
                totalClaims: 89,
                totalRedemptions: 45,
                conversionRate: 7.2,
            },
            redemptions: [],
            addRedemption: (redemption) =>
                set((state) => ({
                    redemptions: [redemption, ...state.redemptions],
                    analytics: {
                        ...state.analytics,
                        totalRedemptions: state.analytics.totalRedemptions + 1,
                    },
                })),
            updateAnalytics: (data) =>
                set((state) => ({
                    analytics: { ...state.analytics, ...data },
                })),
        }),
        {
            name: "merchant-storage",
        }
    )
);
