import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, bookingDate, bookingTime, slotType, analysisResult, analysisSummary } = await req.json();

    const webhookUrl = process.env.WEBHOOK_URL || "https://services.leadconnectorhq.com/hooks/8uElW7d5ZvUZkgLgQDN8/webhook-trigger/0mtWSQpsC0DEeLhb1gEK";

    // Flatten each zone into individual named fields
    const zones: Record<string, string> = {};
    if (Array.isArray(analysisResult?.zones)) {
      for (const zone of analysisResult.zones) {
        const k = zone.overlayRegion; // midface | jowls | jawline | neck | nasolabial | marionette
        zones[`zone_${k}_name`]           = zone.name;
        zones[`zone_${k}_concern`]        = zone.concern;
        zones[`zone_${k}_recommendation`] = zone.recommendation;
        zones[`zone_${k}_severity`]       = zone.severity;
      }
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({

        // ── CONTACT ──────────────────────────────────────────
        firstName,
        lastName,
        email,
        phone,

        // ── BOOKING ───────────────────────────────────────────
        bookingDate,
        bookingTime,
        bookingSlotType: slotType,
        bookingStatus:   "Preference Received — Team to confirm within 24 hours",
        bookingNotes:    `Preferred consultation slot: ${bookingDate} at ${bookingTime}. Team to call and confirm appointment. Free consultation — discuss facial analysis results and treatment plan. Clinic: 85 CC-A Commercial, Sector DD DHA Phase 4, Lahore, 54890, Pakistan.`,

        // ── OVERALL ANALYSIS ─────────────────────────────────
        faceShape:        analysisResult?.faceShape        ?? null,
        overallSummary:   analysisResult?.overallSummary   ?? null,
        threadLiftScore:  analysisResult?.threadLiftScore  ?? null,
        scoreCategory:    analysisResult?.scoreCategory    ?? null,
        candidateSummary: analysisResult?.candidateSummary ?? null,
        analysisSummary:  analysisSummary                  ?? null,

        // ── ZONE: MID-FACE ────────────────────────────────────
        zone_midface_name:           zones.zone_midface_name           ?? null,
        zone_midface_concern:        zones.zone_midface_concern        ?? null,
        zone_midface_recommendation: zones.zone_midface_recommendation ?? null,
        zone_midface_severity:       zones.zone_midface_severity       ?? null,

        // ── ZONE: JOWLS ───────────────────────────────────────
        zone_jowls_name:           zones.zone_jowls_name           ?? null,
        zone_jowls_concern:        zones.zone_jowls_concern        ?? null,
        zone_jowls_recommendation: zones.zone_jowls_recommendation ?? null,
        zone_jowls_severity:       zones.zone_jowls_severity       ?? null,

        // ── ZONE: JAWLINE ─────────────────────────────────────
        zone_jawline_name:           zones.zone_jawline_name           ?? null,
        zone_jawline_concern:        zones.zone_jawline_concern        ?? null,
        zone_jawline_recommendation: zones.zone_jawline_recommendation ?? null,
        zone_jawline_severity:       zones.zone_jawline_severity       ?? null,

        // ── ZONE: NECK ────────────────────────────────────────
        zone_neck_name:           zones.zone_neck_name           ?? null,
        zone_neck_concern:        zones.zone_neck_concern        ?? null,
        zone_neck_recommendation: zones.zone_neck_recommendation ?? null,
        zone_neck_severity:       zones.zone_neck_severity       ?? null,

        // ── ZONE: NASOLABIAL FOLDS ────────────────────────────
        zone_nasolabial_name:           zones.zone_nasolabial_name           ?? null,
        zone_nasolabial_concern:        zones.zone_nasolabial_concern        ?? null,
        zone_nasolabial_recommendation: zones.zone_nasolabial_recommendation ?? null,
        zone_nasolabial_severity:       zones.zone_nasolabial_severity       ?? null,

        // ── ZONE: MARIONETTE LINES ────────────────────────────
        zone_marionette_name:           zones.zone_marionette_name           ?? null,
        zone_marionette_concern:        zones.zone_marionette_concern        ?? null,
        zone_marionette_recommendation: zones.zone_marionette_recommendation ?? null,
        zone_marionette_severity:       zones.zone_marionette_severity       ?? null,

        // ── META ──────────────────────────────────────────────
        source:      "Skin Lab Aesthetics Thread Lift Assessment App",
        eventType:   "consultation_booking",
        submittedAt: new Date().toISOString(),

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
