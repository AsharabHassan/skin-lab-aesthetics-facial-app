"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useApp } from "@/lib/store";

const CLINIC_ADDRESS = "85 CC-A Commercial, Sector DD DHA Phase 4, Lahore, 54890, Pakistan";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function formatDateFull(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function ConfirmedScreen() {
  const { state, dispatch } = useApp();
  const { leadData, bookingData } = state;

  return (
    <div className="screen justify-between relative overflow-hidden">

      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6 flex-1 w-full">

        {/* Top bar */}
        <motion.div variants={item} className="flex items-center justify-between">
          <Image src="/logo.webp" alt="Skin Lab Aesthetics" width={100} height={36} style={{ objectFit: "contain" }} />
          <span className="label-xs">Request Received</span>
        </motion.div>

        <motion.div variants={item} className="w-full h-px bg-gold/15" />

        {/* Success icon */}
        <motion.div variants={item} className="flex justify-center pt-4">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-16 border-2 border-gold/60 flex items-center justify-center"
            style={{ background: "rgba(221,190,89,0.08)" }}
          >
            <span className="font-mono text-[1.5rem] text-gold">✓</span>
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.div variants={item} className="text-center space-y-2">
          <h2 className="font-serif text-[2.8rem] font-normal italic text-cream leading-[1.0]">
            Preference<br />Received.
          </h2>
          <p className="font-mono text-[9px] text-white/85 leading-relaxed max-w-[280px] mx-auto">
            Our team will call you within 24 hours to confirm your consultation appointment.
          </p>
        </motion.div>

        {/* Booking details card */}
        <motion.div variants={item}>
          <div className="border border-gold/20 px-5 py-4 space-y-3" style={{ background: "rgba(221,190,89,0.04)" }}>
            <div className="flex items-center justify-between">
              <span className="label-xs">Preferred Slot</span>
              <span className="font-mono text-[8px] text-gold/40 tracking-wider">FREE CONSULTATION</span>
            </div>
            <div className="w-full h-px bg-gold/10" />

            {bookingData && (
              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[8px] text-gold/35 w-10 flex-shrink-0 pt-0.5">DATE</span>
                  <span className="font-serif text-[1rem] italic text-white">
                    {formatDateFull(bookingData.date)}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[8px] text-gold/35 w-10 flex-shrink-0 pt-0.5">TIME</span>
                  <span className="font-serif text-[1rem] italic text-white">
                    {bookingData.time}
                    <span className="font-mono text-[8px] text-gold/40 ml-2 not-italic">
                      (to be confirmed)
                    </span>
                  </span>
                </div>
                {leadData && (
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[8px] text-gold/35 w-10 flex-shrink-0 pt-0.5">NAME</span>
                    <span className="font-serif text-[1rem] italic text-white">
                      {leadData.firstName} {leadData.lastName}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="w-full h-px bg-gold/10" />

            <p className="font-mono text-[8px] text-white/80 leading-relaxed">
              We will contact you on the phone number provided to finalise your appointment time.
            </p>
          </div>
        </motion.div>

        {/* Clinic address */}
        <motion.div variants={item} className="border border-white/5 px-5 py-3 space-y-1.5">
          <span className="label-xs">Clinic Location</span>
          <div className="flex items-start gap-2.5 mt-1">
            <span className="text-[12px] flex-shrink-0">📍</span>
            <span className="font-mono text-[9px] text-white/85 leading-relaxed">{CLINIC_ADDRESS}</span>
          </div>
        </motion.div>

        {/* What to expect */}
        <motion.div variants={item} className="space-y-2">
          <p className="label-xs">What to Expect</p>
          {[
            { code: "01", text: "Review your AI facial analysis with our specialist" },
            { code: "02", text: "Discuss how we can help you achieve the best results" },
            { code: "03", text: "Personalised treatment plan & pricing" },
            { code: "04", text: "Consultation free of cost if you book treatment" },
          ].map(({ code, text }) => (
            <div key={code} className="flex items-center gap-3 py-2 border-b border-white/5">
              <span className="font-mono text-[8px] text-gold/30 flex-shrink-0">{code}</span>
              <span className="font-mono text-[9px] text-white/85 leading-relaxed">{text}</span>
            </div>
          ))}
        </motion.div>

      </motion.div>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="w-full space-y-2.5 pt-6"
      >
        <button
          className="btn-outline w-full"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "results" })}
        >
          ← View My Assessment
        </button>
        <button
          className="w-full font-mono text-[8px] text-white/15 tracking-widest uppercase hover:text-white/30 transition-colors py-2"
          onClick={() => dispatch({ type: "RESET" })}
        >
          Start New Assessment
        </button>
      </motion.div>
    </div>
  );
}
