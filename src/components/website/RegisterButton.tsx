"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface RegisterButtonProps {
    className?: string;
    children?: React.ReactNode;
    tierId?: string;
}

export function RegisterButton({ className, children, tierId }: RegisterButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        const url = tierId ? `/business/register?plan=${tierId}` : "/business/register";
        router.push(url);
    };

    return (
        <button
            onClick={handleClick}
            className={cn(className)}
        >
            {children || "Register"}
        </button>
    );
}
