import { BusinessHeader } from "@/components/website/BusinessHeader";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SubscriptionProvider } from "@/components/website/SubscriptionProvider";

export function BusinessShell({ children }: { children: React.ReactNode }) {
    return (
        <SubscriptionProvider>
            <div
                className="min-h-screen bg-[#fcfdff] text-[#1f2a2a]"
                style={{ fontFamily: '"Avenir Next", "Nunito Sans", "Segoe UI", sans-serif' }}
            >
                <BusinessHeader />
                <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">{children}</main>
                <WebsiteFooter tone="business" />
            </div>
        </SubscriptionProvider>
    );
}
