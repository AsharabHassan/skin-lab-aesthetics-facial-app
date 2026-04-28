"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import ZoneCard from "@/components/ZoneCard";

/* ── Score colour helpers ─────────────────────────── */
function getScoreColor(score: number) {
  if (score >= 80) return { main: "#ddbe59", glow: "rgba(221,190,89,0.4)", label: "text-gold" };
  if (score >= 60) return { main: "#c9a94d", glow: "rgba(201,169,77,0.3)", label: "text-gold/80" };
  if (score >= 40) return { main: "#b8913a", glow: "rgba(184,145,58,0.25)", label: "text-gold/60" };
  return { main: "rgba(255,255,255,0.35)", glow: "rgba(255,255,255,0.08)", label: "text-white/40" };
}

/* ── Animated circular gauge ─────────────────────── */
function SuitabilityGauge({ score, category, summary }: { score: number; category: string; summary: string }) {
  const [displayScore, setDisplayScore] = useState(0);
  const colors = getScoreColor(score);

  // Animate counter
  useEffect(() => {
    let start = 0;
    const duration = 1800;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = score / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [score]);

  const radius = 72;
  const stroke = 5;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-5"
    >
      {/* Label */}
      <p className="label-xs">Thread Lift Suitability Score</p>

      {/* SVG gauge */}
      <div className="relative" style={{ width: 180, height: 180 }}>
        <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          <motion.circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke={colors.main}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 0.05 }}
            style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-[3.2rem] italic leading-none" style={{ color: colors.main }}>
            {displayScore}
          </span>
          <span className="font-mono text-[8px] text-white/25 tracking-widest mt-1">/ 100</span>
        </div>
      </div>

      {/* Category badge */}
      <div className="flex flex-col items-center gap-2">
        <span
          className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold px-4 py-1.5"
          style={{
            color: colors.main,
            border: `1px solid ${colors.glow}`,
            background: `linear-gradient(180deg, rgba(221,190,89,0.05) 0%, transparent 100%)`,
          }}
        >
          {category}
        </span>
        <p className="font-serif text-[0.95rem] italic text-white/90 leading-relaxed text-center max-w-[280px]">
          {summary}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Results Screen ──────────────────────────────── */
export default function ResultsScreen() {
  const { state, dispatch } = useApp();
  const { analysisResult, leadData } = state;

  if (!analysisResult) {
    dispatch({ type: "SET_SCREEN", screen: "landing" });
    return null;
  }

  return (
    <div className="screen pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full space-y-6"
      >
        {/* Report header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="label-xs">Thread Lift Assessment Report</span>
            <span className="font-mono text-[8px] text-gold/30 tracking-wider">
              {analysisResult.faceShape?.toUpperCase()} FACE
            </span>
          </div>
          <div className="w-full h-px bg-gold/15" />
          <h2 className="font-serif text-[2.8rem] font-normal italic text-white leading-[1.0]">
            {leadData?.firstName ? `${leadData.firstName}'s` : "Your"}<br />
            Assessment.
          </h2>
        </div>

        {/* ★ Thread Lift Suitability Score */}
        <div className="py-4">
          <SuitabilityGauge
            score={analysisResult.threadLiftScore}
            category={analysisResult.scoreCategory}
            summary={analysisResult.candidateSummary}
          />
        </div>

        <div className="w-full h-px bg-gold/10" />

        {/* AI summary */}
        <div className="border-l-2 border-gold/30 pl-4 py-1 space-y-1.5">
          <p className="label-xs">Specialist Assessment</p>
          <p className="font-serif text-[1.05rem] italic text-white leading-relaxed">
            {analysisResult.overallSummary}
          </p>
        </div>

        {/* Zone cards */}
        <div className="space-y-1">
          <p className="label-xs mb-3">Zone Breakdown</p>
          {analysisResult.zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              isActive={false}
              onClick={() => {}}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="font-mono text-[8px] text-white/70 text-center leading-relaxed tracking-wide">
          AI-GENERATED · FOR INFORMATIONAL PURPOSES ONLY<br />
          THREAD LIFT SUITABILITY CONFIRMED AT CONSULTATION
        </p>

        {/* CTA */}
        <button
          className="btn-gold w-full"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "booking" })}
        >
          Book Free Thread Lift Consultation →
        </button>
      </motion.div>
    </div>
  );
}
