import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      firstName, lastName, email, phone,
      bookingDate, bookingTime, slotType,
      threadLiftScore, scoreCategory, candidateSummary,
      analysisSummary,
    } = await req.json();

    const webhookUrl = process.env.WEBHOOK_URL || "https://services.leadconnectorhq.com/hooks/8uElW7d5ZvUZkgLgQDN8/webhook-trigger/0mtWSQpsC0DEeLhb1gEK";

    const bookingStatus = "Preference Received — Team to confirm within 24 hours";

    const bookingNotes = `Preferred consultation slot: ${bookingDate} at ${bookingTime}. Team to call and confirm appointment. Free consultation — discuss facial analysis results and treatment plan. Clinic: 85 CC-A Commercial, Sector DD DHA Phase 4, Lahore, 54890, Pakistan.`;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // ── Contact details ──────────────────────────────
        firstName,
        lastName,
        email,
        phone,

        // ── Booking details ──────────────────────────────
        bookingDate,
        bookingTime,
        bookingSlotType:  slotType,
        bookingStatus,
        bookingNotes,

        // ── Thread Lift Score ────────────────────────────
        threadLiftScore:   threadLiftScore ?? null,
        scoreCategory:     scoreCategory ?? null,
        candidateSummary:  candidateSummary ?? null,
        analysisSummary:   analysisSummary ?? null,

        // ── Meta ────────────────────────────────────────
        source:       "Skin Lab Aesthetics Thread Lift Assessment App",
        eventType:    "consultation_booking",
        submittedAt:  new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("Booking webhook error:", response.status);
      return NextResponse.json({ success: true, warning: "Webhook delivery failed" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking submission error:", error);
    return NextResponse.json({ success: true, warning: "Webhook delivery failed" });
  }
}
