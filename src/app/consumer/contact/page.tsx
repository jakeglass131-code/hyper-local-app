"use client";

import { LogoHeader } from "@/components/consumer/LogoHeader";
import { ChevronLeft, Mail, MessageSquare, Phone, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContactPage() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        // Mock send
        setTimeout(() => {
            setSent(false);
            setMessage("");
            alert("Message sent! We'll get back to you shortly.");
        }, 2000);
    };

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
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
                </div>
            </header>

            <main className="px-4 py-6 space-y-6">
                <section className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                        Have a question or feedback? We'd love to hear from you. Fill out the form below or reach out directly.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Subject
                            </label>
                            <select className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                                <option>General Inquiry</option>
                                <option>Technical Support</option>
                                <option>Business Partnership</option>
                                <option>Report an Issue</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={5}
                                className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                                placeholder="How can we help you?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sent || !message.trim()}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sent ? (
                                "Sending..."
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                </section>

                <section className="grid grid-cols-1 gap-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Email Us</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">support@hyper-local.app</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                            <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Live Chat</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Available 9am - 5pm EST</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
