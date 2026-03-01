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
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  async function onSubmit(data: LeadFormData) {
    // Fire-and-forget: never block user from seeing results if CRM fails
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
    <div className="screen justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-6"
      >
        {/* Blurred result preview */}
        {state.imageDataUrl && (
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
            <img
              src={state.imageDataUrl}
              alt="Your photo"
              className="w-full h-full object-cover blur-md scale-105"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-3">
                  <span className="text-gold text-xl">✓</span>
                </div>
                <p className="font-serif text-xl text-white">
                  Your Analysis Is Ready
                </p>
                <p className="text-sm text-white/60 mt-1">
                  Enter your details to unlock your personalized plan
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                {...register("firstName")}
                placeholder="First Name *"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:border-gold focus:outline-none"
              />
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <input
                {...register("lastName")}
                placeholder="Last Name *"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:border-gold focus:outline-none"
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address *"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:border-gold focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Phone Number *"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:border-gold focus:outline-none"
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register("marketingConsent")}
              type="checkbox"
              className="mt-1 accent-gold"
            />
            <span className="text-xs text-white/50 leading-relaxed">
              I agree to receive my analysis results and marketing communications
              from Harley Street Aesthetics. Your data is handled in accordance with our privacy policy.
            </span>
          </label>
          {errors.marketingConsent && (
            <p className="text-red-400 text-xs">{errors.marketingConsent.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Unlocking..." : "Unlock My Results"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
