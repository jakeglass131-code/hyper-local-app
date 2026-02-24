"use client";

import { useEffect, useState, useRef } from "react";
import { Coffee } from "lucide-react";

interface FlyingIconProps {
    startPosition: { x: number; y: number };
    onComplete: () => void;
}

export function FlyingStampAnimation({ startPosition, onComplete }: FlyingIconProps) {
    const [position, setPosition] = useState(startPosition);
    const [opacity, setOpacity] = useState(1);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        // Target: Wallet icon in bottom nav (approximate bottom right for desktop, bottom center for mobile)
        // For this demo, let's target the card grid area or just fly up and out
        const targetElement = document.querySelector('[data-wallet-tab]');

        let targetPosition = {
            x: window.innerWidth / 2,
            y: window.innerHeight - 50
        };

        if (targetElement) {
            const targetRect = targetElement.getBoundingClientRect();
            targetPosition = {
                x: targetRect.left + targetRect.width / 2,
                y: targetRect.top + targetRect.height / 2,
            };
        }

        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing
            const eased = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            setPosition({
                x: startPosition.x + (targetPosition.x - startPosition.x) * eased,
                y: startPosition.y + (targetPosition.y - startPosition.y) * eased,
            });

            setRotation(eased * 360);

            if (progress < 0.8) {
                setScale(1 + Math.sin(progress * Math.PI) * 0.5);
            } else {
                setScale(Math.max(0, 1.5 - (progress - 0.8) * 7.5));
            }

            if (progress > 0.8) {
                setOpacity(1 - (progress - 0.8) / 0.2);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                onComplete();
            }
        };

        requestAnimationFrame(animate);
    }, []);

    return (
        <div
            className="fixed z-[9999] pointer-events-none"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                opacity,
            }}
        >
            <div className="bg-[#1e6a67] text-white p-3 rounded-xl shadow-xl border-2 border-white">
                <Coffee className="h-6 w-6" />
            </div>
        </div>
    );
}
