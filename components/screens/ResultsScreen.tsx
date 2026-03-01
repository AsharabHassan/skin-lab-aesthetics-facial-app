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
    <div className="screen pb-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full space-y-6"
      >
        {/* Header */}
        <div>
          <p className="text-gold text-xs tracking-widest">YOUR ANALYSIS</p>
          <h2 className="font-serif text-2xl text-white mt-1">
            {leadData?.firstName ? `${leadData.firstName}'s ` : ""}Facial Assessment
          </h2>
          {analysisResult.faceShape && (
            <p className="text-white/50 text-sm mt-1">
              Face shape: <span className="capitalize text-white/70">{analysisResult.faceShape}</span>
            </p>
          )}
        </div>

        {/* Photo with overlay */}
        <FaceOverlay
          imageDataUrl={imageDataUrl}
          zones={analysisResult.zones}
          activeZoneId={activeZoneId}
          onZoneClick={setActiveZoneId}
        />

        {/* AI Summary */}
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
          <p className="text-gold text-xs tracking-widest mb-2">AI ASSESSMENT</p>
          <p className="text-white/80 text-sm leading-relaxed">
            {analysisResult.overallSummary}
          </p>
        </div>

        {/* Zone cards */}
        <div className="space-y-3">
          <p className="text-white/50 text-xs tracking-widest">TAP A ZONE TO EXPAND</p>
          {analysisResult.zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              isActive={activeZoneId === zone.id}
              onClick={() =>
                setActiveZoneId(activeZoneId === zone.id ? null : zone.id)
              }
            />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-white/25 text-xs text-center leading-relaxed">
          Results are AI-generated suggestions for informational purposes only.
          Final treatment plans are determined at in-person consultation.
        </p>

        {/* CTA */}
        <button
          className="btn-gold w-full"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "booking" })}
        >
          Book My Free Consultation
        </button>
      </motion.div>
    </div>
  );
}
