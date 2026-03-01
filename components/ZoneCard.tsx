"use client";

import { useState } from "react";
import { FaceZone } from "@/lib/types";

const SEVERITY_COLORS = {
  none: "border-white/10 bg-white/5",
  mild: "border-gold/30 bg-gold/5",
  moderate: "border-gold/60 bg-gold/10",
};

interface Props {
  zone: FaceZone;
  isActive: boolean;
  onClick: () => void;
}

export default function ZoneCard({ zone, isActive, onClick }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`border rounded-2xl p-4 transition-all duration-200 cursor-pointer ${
        isActive
          ? "border-gold bg-gold/10"
          : SEVERITY_COLORS[zone.severity]
      }`}
      onClick={() => { onClick(); setExpanded(!expanded); }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-gold text-black text-xs font-bold flex items-center justify-center flex-shrink-0">
            {zone.id}
          </span>
          <div>
            <p className="text-white font-medium text-sm">{zone.name}</p>
            <p className="text-white/50 text-xs">{zone.recommendation}</p>
          </div>
        </div>
        <span className="text-white/30 text-xs">{expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && (
        <p className="text-white/60 text-xs mt-3 pl-10 leading-relaxed">
          {zone.concern}
        </p>
      )}
    </div>
  );
}
