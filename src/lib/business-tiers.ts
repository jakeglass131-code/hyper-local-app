import { Zap, Shield, Crown } from "lucide-react";

export const businessTiers = [
    {
        id: "free",
        name: "Free Trial",
        price: "$0",
        description: "Perfect for testing the local waters and seeing immediate impact.",
        duration: "14 days",
        icon: Zap,
        color: "bg-slate-100 text-slate-600 border-slate-200",
        accent: "text-slate-500",
        features: [
            "1 Active Campaign",
            "Basic Map Visibility",
            "Manual QR Validation",
            "Standard Analytics Dashboard",
            "Radius limit: 1000m",
            "Community Support",
        ],
        cta: "Start 14-Day Trial",
        href: "/provider/onboarding?plan=free",
        popular: false
    },
    {
        id: "catalyst",
        name: "Catalyst",
        price: "$49",
        description: "Accelerate your local presence with advanced tools and higher visibility.",
        duration: "per month",
        icon: Shield,
        color: "bg-[#3744D2]/5 text-[#3744D2] border-[#3744D2]/20",
        accent: "text-[#3744D2]",
        features: [
            "5 Active Campaigns",
            "High Map Priority",
            "Advanced AI Performance Insights",
            "Mobile Scanner App Access",
            "Dynamic Geofencing",
            "Priority Email & Chat Support",
            "Weekly Growth Reports",
        ],
        cta: "Scale with Catalyst",
        href: "/provider/onboarding?plan=catalyst",
        popular: true
    },
    {
        id: "apex",
        name: "Apex",
        price: "$99",
        description: "The ultimate tool for district leaders to dominate local commerce.",
        duration: "per month",
        icon: Crown,
        color: "bg-amber-50 text-amber-600 border-amber-200",
        accent: "text-amber-600",
        features: [
            "Unlimited Campaigns",
            "Elite Map Visibility (Animated)",
            "Predictive Customer Flow AI",
            "Multi-location Management",
            "Unlimited Team Seats",
            "24/7 VIP Phone Support",
            "Smart API Access",
            "White-label Reporting",
        ],
        cta: "Unlock Apex",
        href: "/provider/onboarding?plan=apex",
        popular: false
    }
];
