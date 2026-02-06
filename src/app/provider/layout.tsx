import { ProviderNav } from "./components/ProviderNav";

export default function ProviderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            {children}
            <ProviderNav />
        </div>
    );
}
