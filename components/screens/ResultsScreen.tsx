"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import FaceOverlay from "@/components/FaceOverlay";
import ZoneCard from "@/components/ZoneCard";

export default function ResultsScreen() {
  const { state, dispatch } = useApp();
  const [activeZoneId, setActiveZoneId] = useState<number | null>(null);
  const { analysisResult, imageDataUrl, leadData } = state;

  if (!analysisResult || !imageDataUrl) {
    dispatch({ type: "SET_SCREEN", screen: "landing" });
    return null;
  }

  return (
    <div className="screen pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full space-y-7"
      >
        {/* Header */}
        <div className="space-y-1">
          <p className="label-xs">Your Personalised Report</p>
          <h2 className="font-serif text-3xl font-light italic text-cream leading-tight">
            {leadData?.firstName ? `${leadData.firstName}'s ` : ""}Facial<br />Assessment
          </h2>
          {analysisResult.faceShape && (
            <div className="flex items-center gap-2 mt-2">
              <div className="h-px flex-1 bg-white/5" />
              <p className="font-sans text-[9px] text-white/30 tracking-widest uppercase">
                {analysisResult.faceShape} face
              </p>
              <div className="h-px flex-1 bg-white/5" />
            </div>
          )}
        </div>

        {/* Photo with overlay */}
        <div className="relative">
          <div className="absolute inset-0 -m-1 border border-gold/10 pointer-events-none z-10" />
          <FaceOverlay
            imageDataUrl={imageDataUrl}
            zones={analysisResult.zones}
            activeZoneId={activeZoneId}
            onZoneClick={setActiveZoneId}
          />
          <p className="text-center font-sans text-[9px] text-white/20 mt-2 tracking-widest">
            TAP MARKERS TO EXPLORE ZONES
          </p>
        </div>

        {/* AI Summary */}
        <div className="relative border-l-2 border-gold/40 pl-4 py-1">
          <p className="label-xs mb-2">AI Assessment</p>
          <p className="font-sans text-xs text-white/50 leading-relaxed font-extralight">
            {analysisResult.overallSummary}
          </p>
        </div>

        {/* Zone cards */}
        <div className="space-y-1.5">
          {analysisResult.zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              isActive={activeZoneId === zone.id}
              onClick={() => setActiveZoneId(activeZoneId === zone.id ? null : zone.id)}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="font-sans text-[9px] text-white/15 text-center leading-relaxed tracking-wide font-extralight">
          AI-generated suggestions for informational purposes only.<br />
          Treatment plans confirmed at in-person consultation.
        </p>

        {/* CTA */}
        <button
          className="btn-gold w-full"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "booking" })}
        >
          Book Consultation
        </button>
      </motion.div>
    </div>
  );
}
