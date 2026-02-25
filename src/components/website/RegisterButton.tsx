"use client";

import { useSubscriptionModal } from "@/components/website/SubscriptionProvider";
import { cn } from "@/lib/utils";

interface RegisterButtonProps {
    className?: string;
    children?: React.ReactNode;
    tierId?: string;
}

export function RegisterButton({ className, children, tierId }: RegisterButtonProps) {
    const { openModal } = useSubscriptionModal();

    return (
        <button
            onClick={() => openModal(tierId)}
            className={cn(className)}
        >
            {children || "Register"}
        </button>
    );
}
