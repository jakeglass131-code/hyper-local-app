"use client";

import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";

export default function SignUpPage() {
  const router = useRouter();

  const products = [
    { icon: "🎬", label: "Movies", bg: "rgba(247, 230, 181, 0.05)", border: "rgba(247, 230, 181, 0.2)" },
    { icon: "💇", label: "Beauty", bg: "rgba(205, 229, 255, 0.05)", border: "rgba(205, 229, 255, 0.2)" },
    { icon: "🍔", label: "Dining", bg: "rgba(255, 216, 216, 0.05)", border: "rgba(255, 216, 216, 0.2)" },
    { icon: "💅", label: "Nails", bg: "rgba(252, 225, 242, 0.05)", border: "rgba(252, 225, 242, 0.2)" },
    { icon: "☕", label: "Coffee", bg: "rgba(253, 228, 201, 0.05)", border: "rgba(253, 228, 201, 0.2)" },
    { icon: "🧘", label: "Zen", bg: "rgba(213, 245, 237, 0.05)", border: "rgba(213, 245, 237, 0.2)" },
  ];

  return (
    <AuthShell role="consumer">
      <div className="flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white italic leading-tight">
            Discover local <br />
            <span className="text-[#3744D2]">without the hassle.</span>
          </h1>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-white/30 max-w-[240px] mx-auto">
            High-intent deals from nearby districts.
          </p>
        </div>

        <div className="grid w-full grid-cols-3 gap-3">
          {products.map((product, index) => (
            <div
              key={product.label}
              className="auth-tile group flex flex-col items-center justify-center rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] p-4 transition-all hover:scale-105 hover:bg-white/[0.06]"
              style={{
                animationDelay: `${index * 150}ms`,
                animationDuration: '4s'
              }}
            >
              <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500">{product.icon}</div>
              <p className="mt-2 text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">
                {product.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 w-full space-y-3">
          <button
            onClick={() => router.push("/auth/signup/form")}
            className="group relative h-14 w-full overflow-hidden rounded-2xl bg-white text-[10px] font-black uppercase tracking-[0.3em] text-black shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>

          <button
            onClick={() => router.push("/login")}
            className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.3em] text-white/60 transition-all hover:text-white hover:bg-white/[0.06]"
          >
            Login
          </button>
        </div>
      </div>

      <style jsx>{`
                .auth-tile {
                    animation-name: tileDrift;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                }

                @keyframes tileDrift {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-6px) rotate(1deg); }
                }
            `}</style>
    </AuthShell>
  );
}
