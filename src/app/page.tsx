"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, Store } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Hyper Local</h1>
          <p className="text-xl text-white/90">Choose your experience</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Consumer Card */}
          <button
            onClick={() => router.push("/consumer/home")}
            className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 active:scale-95 text-left group"
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Consumer</h2>
            <p className="text-gray-600 mb-6">
              Discover amazing local deals, claim offers, and save money at your favorite spots.
            </p>
            <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-3 transition-all">
              <span>Get Started</span>
              <span className="ml-2 group-hover:ml-0 transition-all">→</span>
            </div>
          </button>

          {/* Provider Card */}
          <button
            onClick={() => router.push("/business")}
            className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 active:scale-95 text-left group"
          >
            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
              <Store className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Provider</h2>
            <p className="text-gray-600 mb-6">
              Manage your business, create offers, and attract more customers to your venue.
            </p>
            <div className="flex items-center text-purple-600 font-semibold group-hover:gap-3 transition-all">
              <span>Get Started</span>
              <span className="ml-2 group-hover:ml-0 transition-all">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
