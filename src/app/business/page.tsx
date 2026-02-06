"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, TrendingUp, Gift, Coffee, Award, Pause, Play, Eye, Users, MessageCircle, CheckCircle, XCircle, Keyboard } from "lucide-react";
import { QRScanner } from "@/components/QRScanner";
import { Business, Offer, Program, MerchantProfile } from "@/lib/store";
import { CreateOfferWizard } from "@/components/CreateOfferWizard";
import { BusinessHome } from "@/components/BusinessHome";
import { BusinessProfile } from "@/components/BusinessProfile";
import { BusinessAnalytics } from "@/components/BusinessAnalytics";

import { useToast } from "@/components/Toast";

export default function BusinessPage() {
    const { showToast } = useToast();
    const [tab, setTab] = useState<"home" | "scanner" | "offers" | "analytics" | "profile">("home");

    // Businesses state
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [showBusinessForm, setShowBusinessForm] = useState(false);
    const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

    // Loyalty state
    const [program, setProgram] = useState<Program | null>(null);
    const [saving, setSaving] = useState(false);

    // Offers state
    const [offers, setOffers] = useState<Offer[]>([]);
    const [offerView, setOfferView] = useState<"active" | "paused" | "create">("active");
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

    // Analytics state
    const [analytics, setAnalytics] = useState<any>(null);

    // Profile state
    const [profile, setProfile] = useState<MerchantProfile | null>(null);

    // Scanner state
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualCode, setManualCode] = useState("");
    const [mode, setMode] = useState<"OFFER" | "STAMP">("OFFER");

    const [pendingStampRedemption, setPendingStampRedemption] = useState<string | null>(null);
    const [stampCount, setStampCount] = useState(1);

    const handleScan = async (code: string) => {
        if (processing) return;
        if (!code) {
            console.error("Attempted to scan empty code");
            setResult({ success: false, message: "Scanned code was empty. Please try again." });
            return;
        }

        console.log("Processing scan code:", code);

        // If in STAMP mode, ask for count first
        if (mode === "STAMP") {
            setPendingStampRedemption(code);
            setStampCount(1); // Reset to default
            return;
        }

        // Otherwise process immediately (Offer or Reward)
        processRedemption(code);
    };

    const processRedemption = async (code: string, count: number = 1) => {
        setProcessing(true);
        try {
            const res = await fetch("/api/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: code,
                    action: mode,
                    count: count
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setResult({ success: false, message: data.error || "Scan failed" });
            } else {
                let message = "Success!";
                if (mode === "OFFER" && data.offerTitle) {
                    message = `Redeemed: ${data.offerTitle}`;
                } else if (mode === "STAMP" && data.newStamps) {
                    message = `${count} Stamp${count > 1 ? 's' : ''} Added! Total: ${data.newStamps}`;
                }

                setResult({ success: true, message, data });
            }
        } catch (e) {
            setResult({ success: false, message: "Network error" });
        } finally {
            setProcessing(false);
            setPendingStampRedemption(null);
        }
    };

    const reset = () => {
        setResult(null);
        setProcessing(false);
        setManualCode("");
    };

    useEffect(() => {
        if (tab === "home") {
            fetchOffers();
            fetchBusinesses();
            fetchAnalytics();
            fetchProgram();
        } else if (tab === "analytics") {
            fetchAnalytics();
        } else if (tab === "offers") {
            fetchBusinesses();
            fetchOffers();
        } else if (tab === "profile") {
            fetchProfile();
        }
    }, [tab]);

    const fetchBusinesses = async () => {
        const res = await fetch("/api/businesses");
        const data = await res.json();
        setBusinesses(data);
    };

    const fetchProgram = async () => {
        const res = await fetch("/api/business");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            setProgram(data[0]);
        }
    };

    const fetchOffers = async () => {
        const res = await fetch("/api/offers?includeInactive=true", { cache: "no-store" });
        const data = await res.json();
        setOffers(data);
    };

    const fetchAnalytics = async (startDate?: number, endDate?: number) => {
        try {
            let url = "/api/analytics";
            if (startDate && endDate) {
                url += `?startDate=${startDate}&endDate=${endDate}`;
            }
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch analytics");
            const data = await res.json();
            setAnalytics(data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            // Set empty analytics to avoid crashes
            setAnalytics({ overview: {}, calendar: [] });
        }
    };

    const fetchProfile = async () => {
        // TODO: Get userId from auth
        const res = await fetch("/api/merchant/profile?userId=provider_123");
        if (res.ok) {
            const data = await res.json();
            setProfile(data);
        }
    };

    const handleSaveProfile = async (updates: Partial<MerchantProfile>) => {
        try {
            const res = await fetch("/api/merchant/profile", {
                method: "POST",
                body: JSON.stringify({
                    userId: "provider_123",
                    ...updates
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setProfile(data);
                showToast("Profile saved successfully!", "success");
            } else {
                showToast(data.error || "Failed to save profile.", "error");
            }
        } catch (e) {
            console.error(e);
            alert("Network error. Please try again.");
        }
    };

    const handleCreateBusiness = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            category: formData.get("category"),
            suburb: formData.get("suburb"),
            lat: Number(formData.get("lat")) || 51.505,
            lng: Number(formData.get("lng")) || -0.09,
        };

        const res = await fetch("/api/businesses", {
            method: "POST",
            body: JSON.stringify(data),
        });
        const business = await res.json();
        setBusinesses([...businesses, business]);
        setShowBusinessForm(false);
    };



    const handleSaveProgram = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") || program?.name, // Added name to data
            logo: formData.get("logo") || program?.logo,
            cardColor: formData.get("cardColor") || program?.cardColor,
        };

        const oldName = program?.name;
        const newName = data.name as string;

        const res = await fetch("/api/business", {
            method: "POST",
            body: JSON.stringify(data),
        });
        const updated = await res.json();
        setProgram(updated);

        // Persist to localStorage for consumer demo
        if (typeof window !== 'undefined') {
            localStorage.setItem('demo_loyalty_program', JSON.stringify(updated));

            // Cascade update: If name changed, update all consumer cards
            if (oldName && oldName !== newName) {
                const existingCards = localStorage.getItem('demo_consumer_cards');
                if (existingCards) {
                    try {
                        const cards: any[] = JSON.parse(existingCards);
                        const updatedCards = cards.map(card => {
                            if (card.programId === oldName) {
                                return { ...card, programId: newName };
                            }
                            return card;
                        });
                        localStorage.setItem('demo_consumer_cards', JSON.stringify(updatedCards));
                    } catch (e) {
                        console.error("Failed to cascade name update", e);
                    }
                }
            }
        }
        setSaving(false);
        showToast("Loyalty program saved successfully", "success");
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Business Dashboard</h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {[
                    { key: "scanner", label: "Scanner" },
                    { key: "offers", label: "Offers" },
                    { key: "home", label: "Home" },
                    { key: "analytics", label: "Analytics" },
                    { key: "profile", label: "Profile" },
                ].map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key as any)}
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${tab === t.key
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Home Tab */}
            {tab === "home" && (
                <BusinessHome
                    offers={offers}
                    businesses={businesses}
                    analytics={analytics}
                    program={program}
                    onSaveProgram={handleSaveProgram}
                    onRemoveProgram={async () => {
                        if (confirm("Are you sure you want to remove the loyalty program? This cannot be undone.")) {
                            // Mock delete
                            setProgram(null);
                            if (typeof window !== 'undefined') {
                                localStorage.removeItem('demo_loyalty_program');
                            }
                            showToast("Loyalty program removed", "success");
                        }
                    }}
                    onUpdateProgram={(updates) => {
                        if (program) {
                            setProgram({ ...program, ...updates });
                        }
                    }}
                    onNavigate={(t, s) => {
                        setTab(t as any);
                        if (s && t === "offers") setOfferView(s as any);
                    }}
                />
            )}

            {/* Scanner Tab */}
            {tab === "scanner" && (
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden min-h-[600px] flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Merchant Scanner</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Scan customer QR codes to redeem offers or give stamps
                        </p>

                        {/* Mode Toggle */}
                        {!result && !showManualInput && (
                            <div className="flex p-1 bg-gray-100 rounded-xl mt-6">
                                <button
                                    onClick={() => setMode("OFFER")}
                                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "OFFER" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    Redeem Offer
                                </button>
                                <button
                                    onClick={() => setMode("STAMP")}
                                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "STAMP" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    Give Stamp
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 relative bg-black">
                        {!result && !showManualInput && (
                            <QRScanner onScan={handleScan} />
                        )}

                        {/* Result Overlay */}
                        {result && (
                            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 z-30 animate-in fade-in zoom-in duration-300">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${result.success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                    {result.success ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.success ? "Success!" : "Error"}</h2>
                                <p className="text-gray-600 text-center mb-8">{result.message}</p>

                                <button
                                    onClick={reset}
                                    className="w-full max-w-xs bg-gray-900 text-white font-bold py-4 rounded-2xl active:scale-95 transition-transform hover:bg-gray-800"
                                >
                                    Scan Next
                                </button>
                            </div>
                        )}

                        {/* Manual Input Overlay */}
                        {showManualInput && !result && (
                            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 z-30">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Enter Code Manually</h2>
                                <p className="text-gray-500 text-sm mb-8">
                                    Mode: <span className="font-bold text-indigo-600">{mode === "OFFER" ? "Redeem Offer" : "Give Stamp"}</span>
                                </p>
                                <input
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    className="w-full max-w-xs bg-gray-50 text-gray-900 text-center text-3xl tracking-[0.5em] py-4 rounded-2xl border border-gray-200 focus:border-indigo-500 outline-none mb-8 font-mono"
                                    maxLength={6}
                                />
                                <div className="flex gap-4 w-full max-w-xs">
                                    <button
                                        onClick={() => setShowManualInput(false)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 rounded-2xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleScan(manualCode)}
                                        disabled={!manualCode}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Manual Input Toggle Button (Floating) */}
                        {!result && !showManualInput && (
                            <button
                                onClick={() => setShowManualInput(true)}
                                className="absolute bottom-6 right-6 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors z-20"
                            >
                                <Keyboard className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Offers Tab */}
            {tab === "offers" && (
                <div>
                    {/* Subheading Toggle */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setOfferView("create")}
                            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${offerView === "create"
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Create Offer
                        </button>
                        <button
                            onClick={() => setOfferView("active")}
                            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${offerView === "active"
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Active Offers
                        </button>
                        <button
                            onClick={() => setOfferView("paused")}
                            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${offerView === "paused"
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Paused Offers
                        </button>
                    </div>

                    {/* Create Offer View */}
                    {offerView === "create" && (
                        <div className="max-w-3xl mx-auto">
                            <CreateOfferWizard
                                key={editingOffer ? editingOffer.id : "new"}
                                userId="provider_123" // TODO: Get from auth
                                businesses={businesses}
                                initialData={editingOffer}
                                onComplete={() => {
                                    setTab("home");
                                    setEditingOffer(null);
                                    setOfferView("active");
                                    fetchOffers();
                                }}
                            />
                        </div>
                    )}

                    {/* Active/Paused Offers View */}
                    {(offerView === "active" || offerView === "paused") && (
                        <div className="max-w-6xl mx-auto">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {offerView === "active" ? "Active Offers" : "Paused Offers"}
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    {offerView === "active"
                                        ? "Manage your live offers visible to customers"
                                        : "Offers that are currently hidden from customers"}
                                </p>
                            </div>

                            {offers.filter(o => offerView === "active" ? o.isActive : !o.isActive).length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        {offerView === "active" ? (
                                            <Gift className="w-8 h-8 text-gray-400" />
                                        ) : (
                                            <Pause className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {offerView === "active" ? "No active offers" : "No paused offers"}
                                    </h3>
                                    <p className="text-gray-500 max-w-sm mx-auto mb-6">
                                        {offerView === "active"
                                            ? "Get started by creating your first offer to attract customers."
                                            : "Offers you pause will appear here so you can reactivate them later."}
                                    </p>
                                    {offerView === "active" && (
                                        <button
                                            onClick={() => setOfferView("create")}
                                            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                                        >
                                            Create Offer
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {offers
                                        .filter(o => offerView === "active" ? o.isActive : !o.isActive)
                                        .map((offer) => {
                                            const business = businesses.find((b) => b.id === offer.businessId);
                                            const progress = (offer.claimedCount / offer.inventory) * 100;

                                            return (
                                                <div
                                                    key={offer.id}
                                                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="text-xl font-bold text-gray-900">
                                                                    {offer.title}
                                                                </h3>
                                                                <span
                                                                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${offer.isActive
                                                                        ? "bg-green-100 text-green-700"
                                                                        : "bg-gray-100 text-gray-600"
                                                                        }`}
                                                                >
                                                                    {offer.isActive ? "Active" : "Paused"}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-500">{business?.name}</p>
                                                            <p className="text-sm text-gray-700 mt-2">
                                                                {offer.description}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingOffer(offer);
                                                                    // Don't switch view, just open modal
                                                                }}
                                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit className="h-5 w-5 text-gray-600" />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    // Optimistic Update
                                                                    const newStatus = !offer.isActive;
                                                                    setOffers(currentOffers =>
                                                                        currentOffers.map(o =>
                                                                            o.id === offer.id ? { ...o, isActive: newStatus } : o
                                                                        )
                                                                    );

                                                                    try {
                                                                        await fetch(`/api/offers/${offer.id}`, {
                                                                            method: "PUT",
                                                                            headers: { "Content-Type": "application/json" },
                                                                            body: JSON.stringify({ isActive: newStatus }),
                                                                        });
                                                                        showToast(newStatus ? "Offer activated" : "Offer paused", "success");
                                                                    } catch (e) {
                                                                        console.error("Error updating offer:", e);
                                                                        showToast("Failed to update offer", "error");
                                                                        // Revert on error
                                                                        fetchOffers();
                                                                    }
                                                                }}
                                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                                title={offer.isActive ? "Pause" : "Activate"}
                                                            >
                                                                {offer.isActive ? (
                                                                    <Pause className="h-5 w-5 text-gray-600" />
                                                                ) : (
                                                                    <Play className="h-5 w-5 text-gray-600" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (!confirm("Are you sure you want to delete this offer?")) return;
                                                                    try {
                                                                        await fetch(`/api/offers/${offer.id}`, {
                                                                            method: "DELETE",
                                                                        });
                                                                        fetchOffers();
                                                                    } catch (e) {
                                                                        console.error(e);
                                                                    }
                                                                }}
                                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-5 w-5 text-red-600" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <Eye className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">
                                                                {offer.claimedCount} views
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">
                                                                {offer.redemptionCount} redemptions
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <TrendingUp className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">
                                                                {offer.discountType === "percent"
                                                                    ? `${offer.value}% off`
                                                                    : `$${offer.value} off`}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                            <span>Inventory</span>
                                                            <span>
                                                                {offer.claimedCount}/{offer.inventory}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                                            <div
                                                                className="bg-indigo-600 h-2 rounded-full transition-all"
                                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}



            {/* Analytics Tab */}
            {tab === "analytics" && (
                <PinProtectedContent
                    title="Analytics"
                    isLocked={true} // Always lock initially
                    onUnlock={() => { }} // Handled internally by component state if we wanted, but here we just show content
                >
                    {analytics && (
                        <BusinessAnalytics
                            data={analytics}
                            onFilterChange={(start, end) => fetchAnalytics(start, end)}
                        />
                    )}
                </PinProtectedContent>
            )}

            {/* Profile Tab */}
            {tab === "profile" && (
                <PinProtectedContent
                    title="Profile"
                    isLocked={true}
                    onUnlock={() => { }}
                >
                    <BusinessProfile
                        profile={profile}
                        onSave={handleSaveProfile}
                    />
                </PinProtectedContent>
            )}


            {/* Edit Offer Modal */}
            {editingOffer && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl">
                        <div className="relative">
                            <button
                                onClick={() => setEditingOffer(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
                            >
                                <XCircle className="h-6 w-6 text-gray-500" />
                            </button>
                            <CreateOfferWizard
                                key={editingOffer.id}
                                userId="provider_123"
                                businesses={businesses}
                                initialData={editingOffer}
                                onComplete={() => {
                                    setEditingOffer(null);
                                    fetchOffers();
                                    showToast("Offer updated successfully", "success");
                                }}
                                onCancel={() => setEditingOffer(null)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Stamp Count Modal */}
            {pendingStampRedemption && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 animate-in zoom-in-95">
                        <h3 className="text-xl font-bold mb-4">How many stamps?</h3>
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <button
                                onClick={() => setStampCount(Math.max(1, stampCount - 1))}
                                className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold hover:bg-gray-200"
                            >
                                -
                            </button>
                            <span className="text-4xl font-bold w-16 text-center">{stampCount}</span>
                            <button
                                onClick={() => setStampCount(Math.min(10, stampCount + 1))}
                                className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold hover:bg-indigo-200"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPendingStampRedemption(null)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => processRedemption(pendingStampRedemption, stampCount)}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function PinProtectedContent({ children, title, isLocked, onUnlock }: { children: React.ReactNode, title: string, isLocked: boolean, onUnlock: () => void }) {
    const [locked, setLocked] = useState(isLocked);
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    if (!locked) return <>{children}</>;

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock PIN check - accept '1234' or any 4 digit for demo
        if (pin.length === 4) {
            setLocked(false);
            onUnlock();
        } else {
            setError(true);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 text-indigo-600">🔒</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Locked Content</h2>
            <p className="text-gray-500 mb-8">Enter your Merchant PIN to access {title}</p>

            <form onSubmit={handleUnlock} className="space-y-4">
                <input
                    type="password"
                    value={pin}
                    onChange={(e) => {
                        setPin(e.target.value);
                        setError(false);
                    }}
                    maxLength={4}
                    className="w-full text-center text-3xl tracking-[1em] font-mono border-b-2 border-gray-200 py-2 focus:border-indigo-600 focus:outline-none"
                    placeholder="••••"
                    autoFocus
                />
                {error && <p className="text-red-500 text-sm">Incorrect PIN</p>}
                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                    Unlock
                </button>
            </form>
        </div>
    );
}
function StatCard({ icon: Icon, title, value, color }: any) {
    const colors: any = {
        purple: "bg-purple-100 text-purple-600",
        blue: "bg-blue-100 text-blue-600",
        yellow: "bg-yellow-100 text-yellow-600",
        green: "bg-green-100 text-green-600",
        indigo: "bg-indigo-100 text-indigo-600",
        pink: "bg-pink-100 text-pink-600",
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${colors[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}
