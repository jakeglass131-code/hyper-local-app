import { BottomNav } from "@/components/consumer/BottomNav";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function ConsumerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-50 pb-20">
                {children}
                <BottomNav />
            </div>
        </ThemeProvider>
    );
}
