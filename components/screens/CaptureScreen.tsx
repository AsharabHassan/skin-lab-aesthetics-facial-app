"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import { useCamera } from "@/hooks/useCamera";

export default function CaptureScreen() {
  const { dispatch } = useApp();
  const { videoRef, canvasRef, isActive, error, startCamera, stopCamera, capturePhoto } = useCamera();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startCamera();
    return () => { stopCamera(); };
  }, [startCamera, stopCamera]);

  function handleCapture() {
    const dataUrl = capturePhoto();
    if (dataUrl) {
      dispatch({ type: "SET_IMAGE", imageDataUrl: dataUrl });
      dispatch({ type: "SET_SCREEN", screen: "analyzing" });
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      dispatch({ type: "SET_IMAGE", imageDataUrl: dataUrl });
      dispatch({ type: "SET_SCREEN", screen: "analyzing" });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="screen items-center justify-between py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col items-center gap-5"
      >
        {/* Header */}
        <div className="text-center space-y-1.5 w-full">
          <p className="label-xs">Step 01</p>
          <h2 className="font-serif text-3xl font-light italic text-cream">Position Your Face</h2>
          <p className="font-sans text-[9px] tracking-[0.3em] text-white/30 font-extralight">
            FACE FORWARD · GOOD LIGHTING · REMOVE GLASSES
          </p>
        </div>

        {/* Viewfinder — ornate oval mirror */}
        <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
          {/* Outer decorative ring */}
          <div className="absolute inset-0 rounded-[40px] border border-gold/20" />
          {/* Inner ring */}
          <div className="absolute inset-1 rounded-[38px] border border-gold/10" />

          {/* Camera feed */}
          <div className="absolute inset-2 rounded-[36px] overflow-hidden bg-zinc-950">
            {/* Always render video, just hide it when not active */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}
            />

            {/* Scanning line — only show when active */}
            {isActive && (
              <div
                className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent pointer-events-none animate-scan"
                style={{ top: "20%" }}
              />
            )}

            {/* Oval face guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="border border-gold/40 rounded-full"
                style={{ width: "62%", height: "78%" }}
              />
              {/* Corner marks */}
              <div className="absolute top-[11%] left-[19%] w-3 h-3 border-t border-l border-gold/60" />
              <div className="absolute top-[11%] right-[19%] w-3 h-3 border-t border-r border-gold/60" />
              <div className="absolute bottom-[11%] left-[19%] w-3 h-3 border-b border-l border-gold/60" />
              <div className="absolute bottom-[11%] right-[19%] w-3 h-3 border-b border-r border-gold/60" />
            </div>

            {/* Error message */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-obsidian/80">
                <p className="font-sans text-xs text-white/50 text-center tracking-wide">{error}</p>
              </div>
            )}

            {/* Loading state */}
            {!isActive && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="font-serif text-gold/40 text-lg italic"
                >
                  Initialising...
                </motion.div>
              </div>
            )}
          </div>

          {/* Gold corner ornaments */}
          <div className="absolute top-0 left-4 w-8 h-8 border-t-2 border-l-2 border-gold/50 rounded-tl-sm" />
          <div className="absolute top-0 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/50 rounded-tr-sm" />
          <div className="absolute bottom-0 left-4 w-8 h-8 border-b-2 border-l-2 border-gold/50 rounded-bl-sm" />
          <div className="absolute bottom-0 right-4 w-8 h-8 border-b-2 border-r-2 border-gold/50 rounded-br-sm" />
        </div>

        {/* Hidden canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Actions */}
        <div className="w-full space-y-2.5">
          {isActive && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="btn-gold w-full"
              onClick={handleCapture}
            >
              Capture Photo
            </motion.button>
          )}
          <button
            className="btn-outline w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload from Gallery
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        <button
          className="font-sans text-[9px] text-white/20 tracking-widest uppercase hover:text-white/40 transition-colors"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "landing" })}
        >
          ← Return
        </button>
      </motion.div>
    </div>
  );
}
