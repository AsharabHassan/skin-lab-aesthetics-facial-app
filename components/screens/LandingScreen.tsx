"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function LandingScreen() {
  const { dispatch } = useApp();

  return (
    <div className="screen justify-between relative overflow-hidden">

      {/* Top — logo */}
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6 w-full pt-2">
        <motion.div variants={item} className="flex items-center justify-between w-full">
          <Image src="/logo.webp" alt="Skin Lab Aesthetics" width={120} height={43} priority style={{ objectFit: "contain" }} />
          <span className="label-xs">Skin Lab Aesthetics</span>
        </motion.div>

        {/* Thin rule */}
        <motion.div variants={item} className="w-full h-px bg-gold/20" />

        {/* Hero headline */}
        <motion.div variants={item} className="space-y-0">
          <p className="label-xs mb-3">AI Thread Lift Assessment</p>
          <h1 className="font-serif text-[3.8rem] font-normal leading-[0.95] text-cream italic tracking-tight">
            Discover<br />Your Thread<br />Lift<br />Potential.
          </h1>
        </motion.div>

        {/* Feature rows — Space Mono data table */}
        <motion.div variants={item} className="w-full mt-2">
          {[
            { code: "001", label: "Thread Lift Zone Analysis" },
            { code: "002", label: "6-Zone Laxity Assessment" },
            { code: "003", label: "Suitability Score & Report" },
          ].map(({ code, label }) => (
            <div key={code} className="flex items-center gap-4 py-3 border-b border-gold/10 first:border-t">
              <span className="font-mono text-[9px] text-gold/40 w-7 flex-shrink-0">{code}</span>
              <div className="w-px h-3 bg-gold/15 flex-shrink-0" />
              <span className="font-mono text-[10px] text-white/90 tracking-wide">{label}</span>
              <span className="ml-auto font-mono text-[8px] text-gold/25">●</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom — CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full space-y-3 pb-4"
      >
        <button
          className="btn-gold w-full"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "capture" })}
        >
          Begin Assessment →
        </button>
        <p className="font-mono text-[8px] text-center text-white/70 tracking-widest">
          PRIVATE · SECURE · IMAGE NOT STORED
        </p>
      </motion.div>
    </div>
  );
}
