"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function LandingScreen() {
  const { dispatch } = useApp();

  return (
    <div className="screen items-center justify-center text-center relative overflow-hidden">
      {/* Ambient gold glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center gap-7 relative z-10"
      >
        {/* Logo */}
        <motion.div variants={item}>
          <Image src="/logo.svg" alt="Harley Street Aesthetics" width={160} height={72} priority />
        </motion.div>

        {/* Label */}
        <motion.p variants={item} className="label-xs">
          Harley Street Aesthetics
        </motion.p>

        {/* Hairline divider */}
        <motion.div variants={item} className="flex items-center gap-4 w-full max-w-[200px]">
          <div className="flex-1 h-px bg-gold/30" />
          <div className="w-1 h-1 rounded-full bg-gold/50" />
          <div className="flex-1 h-px bg-gold/30" />
        </motion.div>

        {/* Headline */}
        <motion.div variants={item} className="space-y-2">
          <h1 className="font-serif text-[2.6rem] font-light leading-[1.08] text-cream italic">
            Reveal Your<br />Aesthetic Potential
          </h1>
          <p className="font-sans text-[10px] tracking-[0.3em] text-white/40 font-extralight uppercase mt-3">
            AI-Powered Facial Analysis
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div variants={item} className="flex flex-col gap-2.5 w-full">
          {[
            { num: "01", label: "Facial Structure Analysis" },
            { num: "02", label: "6-Zone Personalised Assessment" },
            { num: "03", label: "Complimentary Consultation" },
          ].map(({ num, label }) => (
            <div key={num} className="flex items-center gap-3 px-4 py-2.5 card-dark">
              <span className="font-sans text-[9px] text-gold/60 tracking-widest">{num}</span>
              <div className="w-px h-3 bg-gold/20" />
              <span className="font-sans text-[11px] text-white/60 tracking-wider font-light">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={item} className="w-full space-y-3">
          <button
            className="btn-gold w-full"
            onClick={() => dispatch({ type: "SET_SCREEN", screen: "capture" })}
          >
            Begin Your Analysis
          </button>
          <p className="font-sans text-[9px] text-white/20 tracking-wider">
            Private &amp; secure — your image is never stored
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
