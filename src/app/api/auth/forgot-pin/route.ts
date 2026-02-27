import { NextResponse } from "next/server";

type ForgotPinPayload = {
  identifier?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ForgotPinPayload;
  const identifier = body.identifier?.trim() || "";

  if (!identifier) {
    return NextResponse.json(
      { error: "Business email or phone is required." },
      { status: 400 }
    );
  }

  // Mock endpoint for now. Replace with your real verification + reset delivery flow.
  return NextResponse.json({
    ok: true,
    message:
      "If we found a matching merchant account, a PIN reset link has been sent.",
  });
}
