"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaceZone } from "@/lib/types";

const SEVERITY_CONFIG = {
  none:     { dot: "bg-white/20",    border: "border-white/5",  bg: "bg-white/[0.02]" },
  mild:     { dot: "bg-gold/50",     border: "border-gold/15",  bg: "bg-gold/[0.04]"  },
  moderate: { dot: "bg-gold",        border: "border-gold/30",  bg: "bg-gold/[0.07]"  },
};

interface Props {
  zone: FaceZone;
  isActive: boolean;
  onClick: () => void;
}

export default function ZoneCard({ zone, isActive, onClick }: Props) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY_CONFIG[zone.severity];

  useEffect(() => {
    if (isActive) setExpanded(true);
  }, [isActive]);

  return (
    <motion.div
      layout
      className={`border transition-all duration-300 cursor-pointer ${
        isActive ? "border-gold/40 bg-gold/[0.06]" : `${cfg.border} ${cfg.bg}`
      }`}
      onClick={() => { onClick(); setExpanded((v) => !v); }}
    >
      <div className="flex items-center gap-3 p-3.5">
        {/* Number badge */}
        <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 border ${
          isActive ? "border-gold bg-gold/20" : "border-white/10"
        }`}>
          <span className={`font-sans text-[9px] tracking-wider ${isActive ? "text-gold" : "text-white/40"}`}>
            {String(zone.id).padStart(2, "0")}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-serif text-sm italic transition-colors ${isActive ? "text-cream" : "text-white/70"}`}>
            {zone.name}
          </p>
          <p className="font-sans text-[9px] text-white/30 tracking-wide truncate font-extralight">
            {zone.recommendation}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          <span className="text-white/20 text-xs">{expanded ? "−" : "+"}</span>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-3.5 pb-3.5 pl-[3.25rem]"
        >
          <div className="h-px bg-white/5 mb-3" />
          <p className="font-sans text-[10px] text-white/40 leading-relaxed font-extralight">
            {zone.concern}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
