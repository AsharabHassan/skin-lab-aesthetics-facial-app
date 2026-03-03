import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, marketingConsent } = await req.json();

    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn("WEBHOOK_URL not set — skipping lead submission");
      return NextResponse.json({ success: true, warning: "Webhook not configured" });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        marketingConsent,
        source: "Harley Street Aesthetics Filler Analysis App",
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("Webhook error:", response.status);
      return NextResponse.json({ success: true, warning: "Webhook delivery failed" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ success: true, warning: "Webhook delivery failed" });
  }
}
