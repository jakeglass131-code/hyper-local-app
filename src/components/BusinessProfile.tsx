"use client";

import { useState, useEffect } from "react";
import { Business, MerchantProfile } from "@/lib/store";
import { Camera, MapPin, Mail, Phone, Save } from "lucide-react";

interface BusinessProfileProps {
    profile: MerchantProfile | null;
    onSave: (data: Partial<MerchantProfile>) => Promise<void>;
}

export function BusinessProfile({ profile, onSave }: BusinessProfileProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<MerchantProfile>>(profile || {});
    const [emailError, setEmailError] = useState<string | null>(null);

    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        await onSave(formData);
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Business Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Logo Upload */}
                    <div className="flex items-center gap-6">
                        <div className="relative h-24 w-24 group cursor-pointer">
                            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden group-hover:bg-gray-200 transition-colors">
                                {formData.businessLogo ? (
                                    <img
                                        src={formData.businessLogo}
                                        alt="Logo"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Camera className="h-8 w-8 text-gray-400" />
                                )}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-medium">Change</span>
                            </div>
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData({ ...formData, businessLogo: reader.result as string });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">Business Logo</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Click the image to upload a new logo. JPG or PNG, max 2MB.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business Name</label>
                            <input
                                type="text"
                                value={formData.businessName || ""}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={formData.businessCategory || ""}
                                onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            >
                                <option value="">Select a category</option>
                                <option value="Cafe">Cafe</option>
                                <option value="Restaurant">Restaurant</option>
                                <option value="Retail">Retail</option>
                                <option value="Service">Service</option>
                                <option value="Beauty">Beauty</option>
                                <option value="Health">Health</option>
                                <option value="Entertainment">Entertainment</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.businessAddress || ""}
                                    onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm p-2 border"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={formData.contactEmail || ""}
                                    onChange={(e) => {
                                        setFormData({ ...formData, contactEmail: e.target.value });
                                        if (emailError) setEmailError(null);
                                    }}
                                    className={`block w-full pl-10 rounded-md shadow-sm p-2 border ${emailError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"}`}
                                />
                            </div>
                            {emailError && (
                                <p className="mt-1 text-sm text-red-600">{emailError}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <div className="flex items-center gap-2 px-3 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 min-w-[140px]">
                                    <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <select
                                        value={formData.contactPhone?.split(" ")[0] || "+1"}
                                        onChange={(e) => {
                                            const currentNumber = formData.contactPhone?.split(" ")[1] || "";
                                            setFormData({ ...formData, contactPhone: `${e.target.value} ${currentNumber}` });
                                        }}
                                        className="bg-transparent border-none focus:ring-0 p-0 text-sm text-gray-500 w-full cursor-pointer outline-none"
                                    >
                                        <option value="+61">🇦🇺 +61</option>
                                        <option value="+55">🇧🇷 +55</option>
                                        <option value="+86">🇨🇳 +86</option>
                                        <option value="+33">🇫🇷 +33</option>
                                        <option value="+49">🇩🇪 +49</option>
                                        <option value="+91">🇮🇳 +91</option>
                                        <option value="+39">🇮🇹 +39</option>
                                        <option value="+81">🇯🇵 +81</option>
                                        <option value="+7">🇷🇺 +7</option>
                                        <option value="+44">🇬🇧 +44</option>
                                        <option value="+1">🇺🇸 +1</option>
                                    </select>
                                </div>
                                <input
                                    type="tel"
                                    value={formData.contactPhone?.split(" ")[1] || ""}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                        const currentCode = formData.contactPhone?.split(" ")[0] || "+1";
                                        setFormData({ ...formData, contactPhone: `${currentCode} ${val}` });
                                    }}
                                    placeholder="1234567890"
                                    className="block w-full rounded-r-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Subscription & Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-500">Current Plan</p>
                            <p className="font-bold text-indigo-600 capitalize">{profile?.subscriptionTier || "Free"}</p>
                        </div>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            Upgrade
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Merchant PIN</p>
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-xl font-bold tracking-wider">{profile?.merchantPin || "****"}</p>
                            <button className="text-sm text-gray-500 hover:text-gray-700">Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
