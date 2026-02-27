import { NextResponse } from "next/server";

type ForgotPasswordPayload = {
  email?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json()) as ForgotPasswordPayload;
  const email = body.email?.trim().toLowerCase() || "";

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Mock endpoint for now. Hook this to your real email provider when auth backend is ready.
  return NextResponse.json({
    ok: true,
    message: `If an account exists for ${email}, reset instructions are on the way.`,
  });
}
