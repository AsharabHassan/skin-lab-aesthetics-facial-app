"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaceZone } from "@/lib/types";

const SEVERITY_COLORS = {
  none:     { bar: "bg-white/10",   text: "text-white/30" },
  mild:     { bar: "bg-gold/50",    text: "text-gold/60"  },
  moderate: { bar: "bg-gold",       text: "text-gold"     },
};

interface Props {
  zone: FaceZone;
  isActive: boolean;
  onClick: () => void;
}

export default function ZoneCard({ zone, isActive, onClick }: Props) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_COLORS[zone.severity];

  useEffect(() => {
    if (isActive) setExpanded(true);
  }, [isActive]);

  return (
    <motion.div
      layout
      className="cursor-pointer transition-colors duration-200 border-b border-white/5"
      style={{ borderLeft: `2px solid ${isActive ? "#ddbe59" : zone.severity === "none" ? "rgba(255,255,255,0.06)" : "rgba(221,190,89,0.35)"}` }}
      onClick={() => { onClick(); setExpanded((v) => !v); }}
    >
      <div className="flex items-center gap-3 py-3 pl-3 pr-2">
        {/* Zone number */}
        <span className="font-mono text-[11px] text-gold/40 font-bold w-5 flex-shrink-0">
          {String(zone.id).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          {/* Name in Playfair italic */}
          <p className={`font-serif text-[1.05rem] italic leading-tight ${isActive ? "text-cream" : "text-cream/60"}`}>
            {zone.name}
          </p>
          <p className="font-mono text-[9px] text-white/25 truncate mt-0.5 tracking-wide">
            {zone.recommendation}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Severity indicator */}
          <div className={`w-1 h-6 rounded-full ${sev.bar}`} />
          <span className="font-mono text-[10px] text-white/15">{expanded ? "−" : "+"}</span>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pl-11 pr-3 pb-3"
        >
          <div className="border-t border-white/5 pt-2">
            <p className="font-mono text-[9px] text-white/35 leading-relaxed">{zone.concern}</p>
            {zone.severity !== "none" && (
              <p className={`font-mono text-[8px] mt-1.5 tracking-widest uppercase ${sev.text}`}>
                {zone.severity} severity
              </p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
