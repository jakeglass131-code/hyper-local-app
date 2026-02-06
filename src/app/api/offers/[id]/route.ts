import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export const dynamic = 'force-dynamic';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const offer = store.offers.get(id);

    if (!offer) {
        return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const body = await request.json();

    const updated = { ...offer, ...body, id }; // Prevent ID override

    store.offers.set(id, updated);
    return NextResponse.json(updated);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!store.offers.has(id)) {
        return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    store.offers.delete(id);
    return NextResponse.json({ success: true });
}
