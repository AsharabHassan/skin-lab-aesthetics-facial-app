"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useApp } from "@/lib/store";

const CLINIC_ADDRESS = "85 CC-A Commercial, Sector DD DHA Phase 4, Lahore, 54890, Pakistan";

/* ── Helpers ─────────────────────────────────────── */
function getNextDays(count: number): Date[] {
  const days: Date[] = [];
  const now = new Date();
  let d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  while (days.length < count) {
    // Skip Sundays (0 = Sunday)
    if (d.getDay() !== 0) {
      days.push(new Date(d));
    }
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  }
  return days;
}

function formatDateShort(d: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function toISODate(d: Date): string {
  return d.toISOString().split("T")[0];
}

const TIME_SLOTS = [
  "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM",
  "7:00 PM", "7:30 PM",
  "8:00 PM",
];

/* ── Animation variants ──────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* ── Component ───────────────────────────────────── */
export default function BookingScreen() {
  const { state, dispatch } = useApp();
  const firstName = state.leadData?.firstName;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Always compute from TODAY — dynamic, never stale
  const availableDays = useMemo(() => getNextDays(14), []);

  function handleTimeSelect(time: string) {
    setSelectedTime(time);
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) return;
    setIsSubmitting(true);

    const bookingData = {
      date: selectedDate,
      time: selectedTime,
      slotType: "preference" as const,
    };

    // Build analysis summary for webhook
    const analysisSummary = state.analysisResult?.zones
      ?.map((z) => `${z.name} (${z.severity}): ${z.concern} → ${z.recommendation}`)
      .join("\n") ?? "";

    // Send single webhook with all data
    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName:      state.leadData?.firstName,
          lastName:       state.leadData?.lastName,
          email:          state.leadData?.email,
          phone:          state.leadData?.phone,
          bookingDate:    selectedDate,
          bookingTime:    selectedTime,
          slotType:       "preference",
          analysisResult: state.analysisResult,
          analysisSummary,
        }),
      });
    } catch (err) {
      console.error("Booking submission error:", err);
    }

    dispatch({ type: "SET_BOOKING", booking: bookingData });
    dispatch({ type: "SET_SCREEN", screen: "confirmed" });
    setIsSubmitting(false);
  }

  return (
    <div className="screen relative overflow-hidden pb-6">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-5 flex-1 w-full">

        {/* Top bar */}
        <motion.div variants={item} className="flex items-center justify-between">
          <Image src="/logo.webp" alt="Skin Lab Aesthetics" width={100} height={36} style={{ objectFit: "contain" }} />
          <span className="label-xs">Book Consultation</span>
        </motion.div>

        <motion.div variants={item} className="w-full h-px bg-gold/15" />

        {/* Headline */}
        <motion.div variants={item} className="space-y-2">
          <p className="label-xs">Free In-Clinic Consultation</p>
          <h2 className="font-serif text-[2.6rem] font-normal italic text-cream leading-[1.0]">
            {firstName ? `${firstName},` : ""}<br />
            Let&apos;s Discuss<br />Your Results.
          </h2>
          <p className="font-mono text-[9px] text-white/85 leading-relaxed mt-2">
            Select your preferred date and time. Our team will call you to confirm your consultation appointment.
          </p>
        </motion.div>

        {/* ── Date picker ─────────────────────────── */}
        <motion.div variants={item} className="space-y-3">
          <p className="label-xs">Preferred Date</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {availableDays.map((day) => {
              const iso = toISODate(day);
              const isSelected = selectedDate === iso;
              return (
                <button
                  key={iso}
                  onClick={() => { setSelectedDate(iso); setSelectedTime(null); }}
                  className="flex flex-col items-center gap-1 flex-shrink-0 px-3 py-2.5 transition-all duration-200"
                  style={{
                    border: `1px solid ${isSelected ? "rgba(221,190,89,0.6)" : "rgba(255,255,255,0.06)"}`,
                    background: isSelected ? "rgba(221,190,89,0.08)" : "transparent",
                  }}
                >
                  <span className="font-mono text-[8px] tracking-widest" style={{ color: isSelected ? "#ddbe59" : "rgba(255,255,255,0.25)" }}>
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][day.getDay()]}
                  </span>
                  <span className="font-serif text-[1.3rem] italic leading-none" style={{ color: isSelected ? "#EDE6D6" : "rgba(237,230,214,0.4)" }}>
                    {day.getDate()}
                  </span>
                  <span className="font-mono text-[7px] tracking-wider" style={{ color: isSelected ? "rgba(221,190,89,0.6)" : "rgba(255,255,255,0.15)" }}>
                    {["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][day.getMonth()]}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Time slots (only after date is selected) ── */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-2.5 overflow-hidden"
            >
              <div className="space-y-1">
                <p className="label-xs">Preferred Time</p>
                <p className="font-mono text-[8px] text-white/80 leading-relaxed">
                  12:00 PM – 8:00 PM · Our team will confirm your slot
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((t) => {
                  const isSelected = selectedTime === t;
                  return (
                    <button
                      key={t}
                      onClick={() => handleTimeSelect(t)}
                      className="py-2.5 text-center transition-all duration-200"
                      style={{
                        border: `1px solid ${isSelected ? "rgba(221,190,89,0.7)" : "rgba(255,255,255,0.06)"}`,
                        background: isSelected ? "rgba(221,190,89,0.12)" : "transparent",
                        color: isSelected ? "#ddbe59" : "rgba(237,230,214,0.4)",
                      }}
                    >
                      <span className="font-mono text-[10px] tracking-wide">{t}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Selected summary + CTA ──────────────── */}
        <AnimatePresence>
          {selectedDate && selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 mt-auto pt-4"
            >
              {/* Summary bar */}
              <div className="border border-gold/20 px-4 py-3 space-y-2" style={{ background: "rgba(221,190,89,0.04)" }}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] text-gold/50 tracking-widest">YOUR PREFERRED SLOT</span>
                  <span className="font-mono text-[8px] text-white/20 tracking-wider">FREE</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-[1.15rem] italic text-cream">
                    {formatDateShort(new Date(selectedDate + "T12:00:00"))}
                  </span>
                  <span className="font-mono text-[10px] text-gold/60">{selectedTime}</span>
                </div>
                <p className="font-mono text-[8px] text-gold/35 leading-relaxed">
                  ⓘ Our team will call you to confirm this appointment
                </p>
              </div>

              {/* Clinic address */}
              <div className="flex items-start gap-3 px-1">
                <span className="font-mono text-[8px] text-gold/35 flex-shrink-0 pt-0.5">📍</span>
                <span className="font-mono text-[9px] text-white/85 leading-relaxed">{CLINIC_ADDRESS}</span>
              </div>

              {/* Confirm button */}
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="btn-gold w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Preferred Slot →"}
              </button>

              <button
                className="w-full font-mono text-[8px] text-white/15 tracking-widest uppercase hover:text-white/30 transition-colors py-1"
                onClick={() => dispatch({ type: "SET_SCREEN", screen: "results" })}
              >
                ← Review My Assessment
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fallback back button when no selection */}
        {(!selectedDate || !selectedTime) && (
          <div className="mt-auto pt-4">
            <button
              className="w-full font-mono text-[8px] text-white/15 tracking-widest uppercase hover:text-white/30 transition-colors py-2"
              onClick={() => dispatch({ type: "SET_SCREEN", screen: "results" })}
            >
              ← Review My Assessment
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
}
