import { NextRequest, NextResponse } from "next/server";

const GHL_API_BASE = "https://services.leadconnectorhq.com";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone } = await req.json();

    const response = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_KEY}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        locationId: process.env.GHL_LOCATION_ID,
        tags: ["filler-analysis-lead"],
        source: "Harley Street Aesthetics Filler Analysis App",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("GHL API error:", errorData);
      // Still return success to user — don't block results on CRM failure
      return NextResponse.json({ success: true, warning: "CRM sync failed" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    // Don't block user from seeing results if CRM is down
    return NextResponse.json({ success: true, warning: "CRM sync failed" });
  }
}
