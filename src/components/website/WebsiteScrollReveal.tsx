"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type WebsiteScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  variant?: "slide" | "pop";
};

export function WebsiteScrollReveal({
  children,
  className,
  delayMs = 0,
  variant = "slide",
}: WebsiteScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none",
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : variant === "pop"
            ? "translate-y-5 scale-[0.97] opacity-0"
            : "translate-y-8 scale-[0.99] opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export default WebsiteScrollReveal;
