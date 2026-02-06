"use client";

import { useState } from "react";
import { ChevronRight, Bell, Palette, FileText, Mail, LogOut, Sun, Moon, Monitor, Check, User, Edit2, Save, X } from "lucide-react";
import { useConsumerStore } from "@/store/consumerStore";
import { LogoHeader } from "@/components/consumer/LogoHeader";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const { preferences, setPreferences, appearance, setAppearance } = useConsumerStore();
    const [showAppearance, setShowAppearance] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+61 400 000 000"
    });

    const settingsGroups = [
        {
            title: "Preferences",
            items: [
                {
                    icon: Bell,
                    label: "Notifications",
                    action: () => alert("Notifications settings coming soon"),
                },
                {
                    icon: Palette,
                    label: "Appearance",
                    action: () => setShowAppearance(!showAppearance),
                },
            ],
        },
        {
            title: "Support",
            items: [
                {
                    icon: FileText,
                    label: "Legal Information",
                    action: () => router.push("/consumer/legal"),
                },
                {
                    icon: Mail,
                    label: "Contact Us",
                    action: () => router.push("/consumer/contact"),
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 pb-20 transition-colors">
            <LogoHeader />
            {/* Header */}
            <header className="bg-white dark:bg-neutral-800 px-4 py-6 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-full text-gray-600 dark:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    // Save logic here
                                }}
                                className="p-2 bg-indigo-600 rounded-full text-white"
                            >
                                <Save className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-full text-gray-600 dark:text-gray-300"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full bg-gray-100 dark:bg-neutral-700 px-3 py-1.5 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Name"
                                />
                                <input
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full bg-gray-100 dark:bg-neutral-700 px-3 py-1.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Email"
                                />
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="px-4 py-6 space-y-6">


                {/* Appearance Settings EXPANDED */}
                {showAppearance && (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-white/5 space-y-4 animate-in slide-in-from-top-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Appearance</h3>

                        {/* Theme Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: "light", icon: Sun, label: "Light", desc: "White" },
                                    { value: "dark", icon: Moon, label: "Dark", desc: "Black" },
                                    { value: "system", icon: Monitor, label: "System", desc: "Auto" },
                                ].map((theme) => (
                                    <button
                                        key={theme.value}
                                        onClick={() => setAppearance({ theme: theme.value as any })}
                                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${appearance.theme === theme.value
                                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm"
                                            : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-gray-300 dark:hover:border-neutral-600"
                                            }`}
                                    >
                                        <theme.icon className={`h-6 w-6 mb-2 ${appearance.theme === theme.value ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400"}`} />
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{theme.label}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{theme.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Groups */}
                {settingsGroups.map((group, i) => (
                    <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
                            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">{group.title}</h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {group.items.map((item, j) => (
                                <button
                                    key={j}
                                    onClick={item.action}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-900 dark:text-white">{item.label}</span>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Sign Out */}
                <button
                    onClick={() => alert("Sign out functionality coming soon")}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </main>
        </div>
    );
}
