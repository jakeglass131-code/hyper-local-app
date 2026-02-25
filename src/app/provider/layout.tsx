import { ProviderNav } from "./components/ProviderNav";

export default function ProviderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
            <div className="mx-auto w-full max-w-7xl px-3 sm:px-6">{children}</div>
            <ProviderNav />
        </div>
    );
}
