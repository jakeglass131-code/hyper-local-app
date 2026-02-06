"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type FavoriteStarProps = {
    initialFilled?: boolean;
    onClick?: () => void;
};

export default function FavoriteStar({ initialFilled = false, onClick }: FavoriteStarProps) {
    return (
        <Star
            suppressHydrationWarning
            className={cn(
                "h-5 w-5 transition-colors",
                initialFilled ? "fill-red-500 text-red-500" : "text-gray-300"
            )}
            onClick={onClick}
            aria-hidden="true"
        />
    );
}
