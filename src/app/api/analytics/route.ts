import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    // TODO: Get businessId from auth context
    const businessId = "business_123"; // Mock ID

    const startDate = searchParams.get("startDate") ? Number(searchParams.get("startDate")) : undefined;
    const endDate = searchParams.get("endDate") ? Number(searchParams.get("endDate")) : undefined;

    const analytics = store.getAdvancedAnalytics(businessId, startDate, endDate);

    return NextResponse.json(analytics);
}
