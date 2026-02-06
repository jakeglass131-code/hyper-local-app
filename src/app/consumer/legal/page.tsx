"use client";

import { LogoHeader } from "@/components/consumer/LogoHeader";
import { ChevronLeft, FileText, Shield, Scale } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LegalPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 pb-20 transition-colors">
            <LogoHeader />

            <header className="bg-white dark:bg-neutral-800 px-4 py-4 border-b border-gray-200 dark:border-white/10 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Legal Information</h1>
                </div>
            </header>

            <main className="px-4 py-6 space-y-6">
                <section className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Terms of Service</h2>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                        <p>
                            Welcome to Hyper Local. By using our app, you agree to these terms. Please read them carefully.
                        </p>
                        <h3 className="text-gray-900 dark:text-white font-semibold mt-4 mb-2">1. Acceptance of Terms</h3>
                        <p>
                            By accessing or using the Hyper Local platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                        </p>
                        <h3 className="text-gray-900 dark:text-white font-semibold mt-4 mb-2">2. User Accounts</h3>
                        <p>
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                        </p>
                        <h3 className="text-gray-900 dark:text-white font-semibold mt-4 mb-2">3. Offer Redemption</h3>
                        <p>
                            Offers are subject to availability and merchant discretion. Hyper Local is not responsible for the quality of goods or services provided by merchants.
                        </p>
                    </div>
                </section>

                <section className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Privacy Policy</h2>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                        <p>
                            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                        </p>
                        <h3 className="text-gray-900 dark:text-white font-semibold mt-4 mb-2">Data Collection</h3>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, redeem an offer, or contact support.
                        </p>
                        <h3 className="text-gray-900 dark:text-white font-semibold mt-4 mb-2">Location Data</h3>
                        <p>
                            With your permission, we may collect your precise location to show you nearby offers. You can disable this at any time in your device settings.
                        </p>
                    </div>
                </section>

                <div className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">
                    <p>Last updated: December 2025</p>
                    <p>Hyper Local Pty Ltd</p>
                </div>
            </main>
        </div>
    );
}
