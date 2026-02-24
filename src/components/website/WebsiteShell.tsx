import { WebsiteHeader } from "@/components/website/WebsiteHeader";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";

export function WebsiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-white text-[#1f2a2a]"
      style={{ fontFamily: '"Avenir Next", "Nunito Sans", "Segoe UI", sans-serif' }}
    >
      <WebsiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">{children}</main>
      <WebsiteFooter />
    </div>
  );
}
