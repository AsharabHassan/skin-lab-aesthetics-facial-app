"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/lib/store";
import { leadSchema, LeadFormData } from "@/lib/validation";

export default function GateScreen() {
  const { state, dispatch } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({ resolver: zodResolver(leadSchema) });

  function onSubmit(data: LeadFormData) {
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        marketingConsent: data.marketingConsent,
      }),
    }).catch((err) => console.error("Lead submission error:", err));

    dispatch({
      type: "SET_LEAD",
      lead: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        marketingConsent: data.marketingConsent,
      },
    });
    dispatch({ type: "SET_SCREEN", screen: "results" });
  }

  return (
    <div className="screen justify-center relative overflow-hidden">
      {/* Blurred photo background */}
      {state.imageDataUrl && (
        <div className="absolute inset-0">
          <img
            src={state.imageDataUrl}
            alt=""
            className="w-full h-full object-cover blur-2xl scale-110 opacity-20"
          />
          <div className="absolute inset-0 bg-obsidian/80" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center mx-auto">
            <span className="text-gold text-lg">✓</span>
          </div>
          <div className="gold-line" />
          <h2 className="font-serif text-3xl font-light italic text-cream leading-tight">
            Your Analysis<br />Is Ready
          </h2>
          <p className="font-sans text-[10px] text-white/40 tracking-[0.2em] font-extralight">
            ENTER YOUR DETAILS TO UNLOCK YOUR PERSONALISED PLAN
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="label-xs">First Name</label>
              <input {...register("firstName")} placeholder="Sarah" className="input-field" />
              {errors.firstName && <p className="text-red-400/70 text-[10px] mt-1">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="label-xs">Last Name</label>
              <input {...register("lastName")} placeholder="Johnson" className="input-field" />
              {errors.lastName && <p className="text-red-400/70 text-[10px] mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="label-xs">Email Address</label>
            <input {...register("email")} type="email" placeholder="sarah@example.com" className="input-field" />
            {errors.email && <p className="text-red-400/70 text-[10px] mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="label-xs">Phone Number</label>
            <input {...register("phone")} type="tel" placeholder="+44 7700 000000" className="input-field" />
            {errors.phone && <p className="text-red-400/70 text-[10px] mt-1">{errors.phone.message}</p>}
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input {...register("marketingConsent")} type="checkbox" className="sr-only peer" />
              <div className="w-4 h-4 border border-white/20 peer-checked:border-gold peer-checked:bg-gold/20 transition-all duration-200" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
                <span className="text-gold text-[10px]">✓</span>
              </div>
            </div>
            <span className="font-sans text-[10px] text-white/30 leading-relaxed group-hover:text-white/50 transition-colors font-extralight">
              I consent to receive my analysis results and aesthetic communications from Harley Street Aesthetics in accordance with UK data protection law.
            </span>
          </label>
          {errors.marketingConsent && <p className="text-red-400/70 text-[10px]">{errors.marketingConsent.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Unlock My Results"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
