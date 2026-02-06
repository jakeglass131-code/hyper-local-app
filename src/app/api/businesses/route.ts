import { NextRequest, NextResponse } from "next/server";
import { store, Business } from "@/lib/store";

export async function GET() {
    const businesses = Array.from(store.businesses.values());
    return NextResponse.json(businesses);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name, category, suburb, lat, lng } = body;

    if (!name || !category) {
        return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    const id = Math.random().toString(36).substring(7);
    const merchantPin = store.generatePin();

    const business: Business = {
        id,
        name,
        category,
        suburb: suburb || "",
        lat: lat || 51.505,
        lng: lng || -0.09,
        merchantPin,
        createdAt: Date.now(),
    };

    store.businesses.set(id, business);
    return NextResponse.json(business);
}
