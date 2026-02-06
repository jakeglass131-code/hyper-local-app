"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClaimsPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/consumer/reservations");
    }, [router]);

    return null;
}
