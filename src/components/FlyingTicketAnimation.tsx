"use client";

import { useEffect, useState, useRef } from "react";
import { Ticket } from "lucide-react";

interface FlyingIconProps {
    startPosition: { x: number; y: number };
    targetId?: string;
    text?: string;
    onComplete: () => void;
}

export function FlyingTicketAnimation({ startPosition, targetId = "nav-item-offers", text, onComplete }: FlyingIconProps) {
    const [position, setPosition] = useState(startPosition);
    const [opacity, setOpacity] = useState(1);
    const [scale, setScale] = useState(1);
    const hasAnimated = useRef(false);

    useEffect(() => {
        // Prevent multiple animations from the same instance
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        // Get target - try multiple selectors for robustness
        const targetElement =
            document.getElementById(targetId) ||
            document.querySelector('[data-offers-tab]') ||
            document.querySelector('[data-reservations-button]');

        if (!targetElement) {
            console.log('FlyingTicketAnimation: Target element not found', targetId);
            onComplete();
            return;
        }

        const targetRect = targetElement.getBoundingClientRect();
        const targetPosition = {
            x: targetRect.left + targetRect.width / 2,
            y: targetRect.top + targetRect.height / 2,
        };

        // Animate to target
        const duration = 1200; // Slower for visibility
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-in-out for smoother motion)
            const eased = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const currentX = startPosition.x + (targetPosition.x - startPosition.x) * eased;
            const currentY = startPosition.y + (targetPosition.y - startPosition.y) * eased;

            setPosition({ x: currentX, y: currentY });

            // Scale logic: Start big (1.2), stay big, shrink at very end
            if (progress < 0.8) {
                setScale(1.2);
            } else {
                setScale(1.2 - (progress - 0.8) * 5); // Shrink to ~0.2
            }

            // Fade out near the end
            if (progress > 0.9) {
                setOpacity(1 - (progress - 0.9) / 0.1);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        };

        requestAnimationFrame(animate);
    }, [onComplete, startPosition.x, startPosition.y, targetId]);

    return (
        <div
            className="fixed z-[9999] pointer-events-none flex flex-col items-center"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
            }}
        >
            <div className="rounded-full border-2 border-white bg-[#ff6b3d] p-4 text-white shadow-[0_0_20px_rgba(255,107,61,0.5)]">
                <Ticket className="h-8 w-8" />
            </div>
            {text && (
                <div className="mt-2 bg-white/90 backdrop-blur-md text-[#1f2a2a] px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-[#dfe6df] whitespace-nowrap">
                    {text}
                </div>
            )}
        </div>
    );
}
