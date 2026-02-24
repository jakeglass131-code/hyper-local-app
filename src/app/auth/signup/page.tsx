"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const products = [
    { icon: "🎬", label: "Movie Tickets", bg: "#F7E6B5" },
    { icon: "💇", label: "Haircuts", bg: "#CDE5FF" },
    { icon: "🍔", label: "Food", bg: "#FFD8D8" },
    { icon: "💅", label: "Nails", bg: "#FCE1F2" },
    { icon: "☕", label: "Coffee", bg: "#FDE4C9" },
    { icon: "🧘", label: "Wellness", bg: "#D5F5ED" },
    { icon: "🛒", label: "Groceries", bg: "#FFE8C9" },
    { icon: "🎟️", label: "Events", bg: "#FFE3D5" },
    { icon: "🍣", label: "Dining", bg: "#D7F1FF" },
  ];

  return (
    <div
      className="min-h-screen px-4 pb-10 pt-8 sm:px-6"
      style={{
        background:
          "radial-gradient(circle at top, #f8f7f2 0%, #f2f2ec 42%, #ecece6 100%)",
        fontFamily: '"Avenir Next", "Nunito Sans", "Segoe UI", sans-serif',
      }}
    >
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#3d6332] shadow-lg shadow-[#304e27]/30">
          <Sparkles className="h-8 w-8 text-[#f1f6e8]" />
        </div>

        <h1
          className="text-center text-[48px] leading-[1.08] text-[#2b1313]"
          style={{
            fontFamily:
              '"Iowan Old Style", "Palatino Linotype", Palatino, "Times New Roman", serif',
          }}
        >
          <span className="font-semibold italic text-[#375f2d] underline decoration-[#375f2d]/70">
            Discover local
          </span>{" "}
          deals without the hassle
        </h1>

        <p className="mb-8 mt-3 text-center text-sm text-[#5f5348]">
          Movie tickets, haircuts, food, nails, and more in one app.
        </p>

        <div className="grid w-full grid-cols-3 gap-3 sm:gap-4">
          {products.map((product, index) => (
            <div
              key={product.label}
              className="auth-tile"
              style={{
                backgroundColor: product.bg,
                animationDelay: `${index * 160}ms`,
                animationDuration: `${3800 + (index % 4) * 600}ms`,
              }}
            >
              <div className="text-5xl leading-none">{product.icon}</div>
              <p className="mt-2 text-center text-xs font-semibold text-[#3f3328]">
                {product.label}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/auth/signup/form")}
          className="mt-10 w-full rounded-[22px] bg-[#2f5b28] px-6 py-4 text-lg font-semibold text-[#f5f8ef] shadow-[0_16px_36px_-18px_rgba(42,86,35,0.9)] transition-transform active:scale-[0.98]"
        >
          Sign Up
        </button>

        <button
          onClick={() => router.push("/login")}
          className="mt-4 w-full rounded-[22px] border border-[#344f2e]/30 bg-white/90 px-6 py-4 text-lg font-semibold text-[#344f2e] shadow-[0_14px_30px_-20px_rgba(35,42,35,0.8)] transition-colors hover:bg-white"
        >
          Log In
        </button>
      </div>
      <style jsx>{`
        .auth-tile {
          border-radius: 28px;
          min-height: 122px;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 16px 30px -22px rgba(47, 42, 35, 0.55);
          animation-name: tileDrift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          transform-origin: center;
          will-change: transform;
        }

        @keyframes tileDrift {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate3d(0, -8px, 0) rotate(-0.8deg) scale(1.01);
          }
          50% {
            transform: translate3d(0, 2px, 0) rotate(0.9deg) scale(1);
          }
          75% {
            transform: translate3d(0, -6px, 0) rotate(-0.5deg) scale(1.01);
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
