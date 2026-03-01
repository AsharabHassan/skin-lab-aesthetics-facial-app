"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useApp } from "@/lib/store";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function BookingScreen() {
  const { state, dispatch } = useApp();
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "#";
  const firstName = state.leadData?.firstName;

  return (
    <div className="screen items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full flex flex-col items-center gap-7 relative z-10"
      >
        <motion.div variants={item}>
          <Image src="/logo.svg" alt="Harley Street Aesthetics" width={140} height={64} />
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-4 w-full max-w-[200px]">
          <div className="flex-1 h-px bg-gold/30" />
          <div className="w-1 h-1 rounded-full bg-gold/50" />
          <div className="flex-1 h-px bg-gold/30" />
        </motion.div>

        <motion.div variants={item} className="text-center space-y-3">
          <p className="label-xs">Your Next Step</p>
          <h2 className="font-serif text-[2.2rem] font-light italic text-cream leading-[1.1]">
            {firstName ? `${firstName},` : ""}<br />
            Your Complimentary<br />
            Consultation Awaits
          </h2>
        </motion.div>

        {/* What to expect */}
        <motion.div variants={item} className="w-full card-dark p-5 space-y-4">
          <p className="label-xs">What to Expect</p>
          {[
            "30-minute consultation, in-person or virtual",
            "Review your AI analysis with a specialist",
            "Bespoke treatment plan &amp; transparent pricing",
            "No obligation — completely complimentary",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="font-sans text-[9px] text-gold/50 tracking-widest mt-0.5 flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-sans text-[11px] text-white/50 leading-relaxed font-extralight"
                dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="w-full space-y-2.5">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold w-full block text-center"
          >
            Reserve My Consultation
          </a>
          <button
            className="btn-outline w-full"
            onClick={() => dispatch({ type: "SET_SCREEN", screen: "results" })}
          >
            Review My Analysis
          </button>
        </motion.div>

        <motion.button
          variants={item}
          className="font-sans text-[9px] text-white/15 tracking-widest uppercase hover:text-white/30 transition-colors"
          onClick={() => dispatch({ type: "RESET" })}
        >
          Start New Analysis
        </motion.button>
      </motion.div>
    </div>
  );
}
