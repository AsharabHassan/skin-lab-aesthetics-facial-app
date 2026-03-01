"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useApp } from "@/lib/store";

export default function BookingScreen() {
  const { state, dispatch } = useApp();
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "#";
  const firstName = state.leadData?.firstName;

  return (
    <div className="screen items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center gap-8"
      >
        <Image src="/logo.svg" alt="Harley Street Aesthetics" width={100} height={50} />

        <div className="w-16 h-px bg-gold" />

        <div className="space-y-3">
          <h2 className="font-serif text-3xl text-white leading-tight">
            {firstName ? `${firstName}, your` : "Your"} complimentary
            consultation is one step away
          </h2>
          <p className="text-white/50 text-sm">
            Discuss your personalized treatment plan with one of our expert practitioners.
          </p>
        </div>

        {/* What to expect */}
        <div className="w-full bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-left space-y-3">
          <p className="text-gold text-xs tracking-widest">WHAT TO EXPECT</p>
          {[
            "30-minute in-person or virtual consultation",
            "Review your AI analysis with a qualified practitioner",
            "Personalized treatment plan and pricing",
            "No obligation — completely free",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
              <span className="text-white/70 text-sm">{item}</span>
            </div>
          ))}
        </div>

        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold w-full text-center"
        >
          Book My Free Consultation
        </a>

        <button
          className="btn-outline-gold w-full"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "results" })}
        >
          ← Review My Results
        </button>

        <button
          className="text-white/25 text-xs"
          onClick={() => dispatch({ type: "RESET" })}
        >
          Start a new analysis
        </button>
      </motion.div>
    </div>
  );
}
