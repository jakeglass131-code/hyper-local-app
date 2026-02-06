import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const business = store.businesses.get(id);

    if (!business) {
        return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    return NextResponse.json(business);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const business = store.businesses.get(id);

    if (!business) {
        return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const body = await request.json();
    const updated = { ...business, ...body, id }; // Prevent ID override

    store.businesses.set(id, updated);
    return NextResponse.json(updated);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!store.businesses.has(id)) {
        return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    store.businesses.delete(id);
    return NextResponse.json({ success: true });
}
