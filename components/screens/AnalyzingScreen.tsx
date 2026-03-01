"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";

const ZONES = ["Forehead", "Temples", "Under-eyes", "Cheeks", "Lips", "Jawline"];

export default function AnalyzingScreen() {
  const { state, dispatch } = useApp();
  const [activeZone, setActiveZone] = useState(0);

  useEffect(() => {
    if (!state.imageDataUrl) {
      dispatch({ type: "SET_SCREEN", screen: "capture" });
      return;
    }

    async function analyze() {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageDataUrl: state.imageDataUrl }),
        });
        const data = await res.json();
        if (data.result) {
          dispatch({ type: "SET_ANALYSIS", result: data.result });
          dispatch({ type: "SET_SCREEN", screen: "gate" });
        } else {
          dispatch({ type: "SET_SCREEN", screen: "capture" });
        }
      } catch {
        dispatch({ type: "SET_SCREEN", screen: "capture" });
      }
    }

    analyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cycle through zones visually
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveZone((prev) => (prev + 1) % ZONES.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="screen items-center justify-center text-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-10 relative z-10"
      >
        {/* Orbital animation */}
        <div className="relative w-36 h-36">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-gold/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          {/* Middle ring */}
          <motion.div
            className="absolute inset-3 rounded-full border border-gold/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold" />
          </motion.div>
          {/* Inner ring */}
          <motion.div
            className="absolute inset-6 rounded-full border border-gold/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold/80" />
          </motion.div>
          {/* Center monogram */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-xl text-gold/80 italic">HSA</span>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h2 className="font-serif text-3xl font-light italic text-cream">
            Analysing
          </h2>
          <p className="label-xs">Your Facial Structure</p>
        </div>

        {/* Zone names cycling */}
        <div className="space-y-2 w-full max-w-[200px]">
          {ZONES.map((zone, i) => (
            <motion.div
              key={zone}
              className="flex items-center gap-3"
              animate={{ opacity: activeZone === i ? 1 : 0.2 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`w-1 h-1 rounded-full transition-colors duration-300 ${activeZone === i ? "bg-gold" : "bg-white/20"}`} />
              <span className={`font-sans text-[10px] tracking-[0.2em] transition-colors duration-300 ${activeZone === i ? "text-gold" : "text-white/30"}`}>
                {zone.toUpperCase()}
              </span>
              {activeZone > i && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-auto font-sans text-[9px] text-gold/50"
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
