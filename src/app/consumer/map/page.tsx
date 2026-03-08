"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/consumer/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center">Loading Map...</div>,
});

export default function MapPage() {
    return (
        <div className="h-[100dvh] w-full">
            <MapComponent />
        </div>
    );
}
