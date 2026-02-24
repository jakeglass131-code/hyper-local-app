import { ProviderNav } from "./components/ProviderNav";

export default function ProviderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0B0B0F] text-white">
            {children}
            <ProviderNav />
        </div>
    );

}
