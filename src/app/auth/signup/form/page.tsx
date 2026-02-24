"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, ChevronDown } from "lucide-react";

export default function SignUpFormPage() {
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between pb-8">
      <div className="relative w-full h-[380px] overflow-hidden">
        <div className="absolute inset-0 bg-[#E03546]">
          <Image
            src="/images/auth-bg.png"
            alt="Food Pattern"
            fill
            className="object-cover opacity-90"
          />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-white text-6xl font-[1000] italic tracking-tight drop-shadow-lg">
            hyper local
          </h1>
        </div>

        <button className="absolute top-10 right-6 bg-black/40 text-white px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
          Skip
        </button>
      </div>

      <div className="w-full max-w-md px-6 -mt-10 relative z-10 bg-white rounded-t-[40px] flex flex-col items-center">
        <div className="pt-8 w-full">
          <h2 className="text-[28px] font-extrabold text-[#1c1c1c] text-center leading-tight">
            Singapore&apos;s #1 Local Food &amp; Deals App
          </h2>

          <div className="mt-8 flex items-center justify-center gap-4 text-gray-400">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="text-sm font-medium text-gray-500">Log in or sign up</span>
            <div className="h-[1px] bg-gray-200 flex-1"></div>
          </div>

          <div className="mt-8 flex gap-3">
            <button className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-3 shadow-sm hover:border-gray-400 transition-colors">
              <span className="text-lg">🇺🇸</span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            <div className="flex-1 flex items-center border border-gray-300 rounded-xl px-4 py-3 shadow-sm focus-within:border-[#ef4f5f] transition-colors gap-3">
              <span className="text-gray-900 font-medium">+1</span>
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                className="flex-1 outline-none text-[#1c1c1c] placeholder-gray-400 bg-transparent"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <button className="mt-4 w-full bg-[#ef4f5f] text-white font-semibold py-4 rounded-xl shadow-md active:scale-[0.98] transition-all text-lg">
            Continue
          </button>

          <div className="mt-8 flex items-center justify-center gap-4 text-gray-400">
            <div className="h-[1px] bg-gray-100 flex-1"></div>
            <span className="text-sm font-medium text-gray-400">or</span>
            <div className="h-[1px] bg-gray-100 flex-1"></div>
          </div>

          <div className="mt-8 flex justify-center gap-6">
            <SocialButton icon={<GoogleIcon />} />
            <SocialButton icon={<AppleIcon />} />
            <SocialButton icon={<Mail size={24} className="text-red-500" />} />
          </div>

          <div className="mt-12 text-center text-[11px] leading-relaxed text-gray-500 px-4">
            By continuing, you agree to our
            <br />
            <span className="border-b border-dotted border-gray-400 mx-1">Terms of Service</span>
            <span className="border-b border-dotted border-gray-400 mx-1">Privacy Policy</span>
            <span className="border-b border-dotted border-gray-400 mx-1">Content Policies</span>
          </div>
        </div>
      </div>

      <div className="w-32 h-1 bg-black rounded-full mt-4"></div>
    </div>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-14 h-14 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
      {icon}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.96.95-2.21 1.72-3.71 1.72-1.45 0-2.31-.77-3.76-.77-1.45 0-2.45.75-3.69.75-1.5 0-2.75-.8-3.71-1.74-2.1-2.1-3.61-6.23-1.44-10.05 1-1.77 2.76-2.9 4.67-2.9 1.45 0 2.45.74 3.65.74 1.2 0 2.05-.72 3.66-.72 1.55 0 2.85.75 3.75 1.85-3.15 1.9-2.65 6.35.5 8.1-.65 1.6-1.55 3.05-2.55 4h-.01zM12.03 5.4c-.1 1.7 1.35 3.5 3.05 3.5.15-1.8-1.35-3.6-3.05-3.5z" />
    </svg>
  );
}
