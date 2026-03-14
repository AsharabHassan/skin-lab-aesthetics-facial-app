"use client";

import { useEffect, useRef } from "react";
import { FaceZone } from "@/lib/types";

// Positions as % of image dimensions, calibrated for a mirrored selfie
// where the face fills roughly the central 60-80% of the frame.
const ZONE_POSITIONS: Record<string, { x: number; y: number }> = {
  forehead:  { x: 50, y: 28 },
  temples:   { x: 42, y: 36 },
  undereyes: { x: 60, y: 44 },
  cheeks:    { x: 42, y: 56 },
  lips:      { x: 50, y: 65 },
  jawline:   { x: 50, y: 78 },
};

interface Props {
  imageDataUrl: string;
  zones: FaceZone[];
  activeZoneId?: number | null;
  onZoneClick?: (id: number) => void;
}

export default function FaceOverlay({ imageDataUrl, zones, activeZoneId, onZoneClick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      zones.forEach((zone) => {
        const pos = ZONE_POSITIONS[zone.overlayRegion];
        if (!pos) return;

        const x = (pos.x / 100) * canvas.width;
        const y = (pos.y / 100) * canvas.height;
        const r = canvas.width * 0.04;
        const isActive = activeZoneId === zone.id;
        const hasConcern = zone.severity !== "none";

        // Outer ring
        ctx.beginPath();
        ctx.arc(x, y, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = isActive ? "#ddbe59" : hasConcern ? "rgba(221,190,89,0.6)" : "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Filled circle
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "#ddbe59" : hasConcern ? "rgba(221,190,89,0.85)" : "rgba(255,255,255,0.2)";
        ctx.fill();

        // Number label
        ctx.font = `bold ${r * 1.1}px Inter, sans-serif`;
        ctx.fillStyle = isActive || hasConcern ? "#000000" : "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(zone.id), x, y + 1);
      });
    };
    img.src = imageDataUrl;
  }, [imageDataUrl, zones, activeZoneId]);

  function hitTest(clientX: number, clientY: number) {
    if (!onZoneClick) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (clientX - rect.left) * scaleX;
    const py = (clientY - rect.top) * scaleY;

    for (const zone of zones) {
      const pos = ZONE_POSITIONS[zone.overlayRegion];
      if (!pos) continue;
      const x = (pos.x / 100) * canvas.width;
      const y = (pos.y / 100) * canvas.height;
      const r = canvas.width * 0.08;
      const dist = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
      if (dist <= r) {
        onZoneClick(zone.id);
        return;
      }
    }
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    hitTest(e.clientX, e.clientY);
  }

  function handleTouch(e: React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    if (touch) hitTest(touch.clientX, touch.clientY);
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onTouchEnd={handleTouch}
      className="w-full rounded-2xl cursor-pointer"
    />
  );
}
