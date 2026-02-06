"use client";

import dynamic from "next/dynamic";
import { LogoHeader } from "@/components/consumer/LogoHeader";

const MapComponent = dynamic(() => import("@/components/consumer/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-screen flex items-center justify-center">Loading Map...</div>,
});

export default function MapPage() {
    return (
        <div className="pb-20">
            <MapComponent />
        </div>
    );
}
