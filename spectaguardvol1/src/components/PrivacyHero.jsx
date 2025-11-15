"use client";

import { Shield, Eye, Lock, Zap } from "lucide-react";

export default function PrivacyHero({ onStartTest }) {
  return (
    <section className="min-h-screen bg-white relative flex items-center justify-center px-6 py-20">
      {/* Background geometric patterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="max-w-[800px] mx-auto text-center relative z-10">
        {/* Icon with warning badge */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-black rounded-full flex items-center justify-center relative">
            <Shield size={36} className="text-white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-black rounded-full flex items-center justify-center">
              <Eye size={12} className="text-black" />
            </div>
          </div>
        </div>

        {/* Hero headline */}
        <div className="mb-8">
          <h1
            className="text-[44px] md:text-[72px] leading-[0.9] font-extrabold text-black tracking-[-0.5px] mb-6"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            <span className="block">How much</span>
            <span className="block relative">
              are you being tracked?
              {/* Underline accent */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2">
                <div
                  className="h-1 bg-black rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </span>
          </h1>

          <h2
            className="text-[20px] md:text-[24px] font-medium text-black/80 leading-relaxed"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Quick Privacy Test
          </h2>
        </div>

        {/* Description */}
        <div className="mb-12 max-w-[600px] mx-auto">
          <p
            className="text-[16px] md:text-[18px] font-normal text-black/70 leading-relaxed"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            We test for browser fingerprinting, WebRTC leaks, canvas fingerprinting, and other modern tracking methods.
            <br />
            <span className="font-semibold text-black">
              Everything works in the browser; no personal data is collected.
            </span>
          </p>
        </div>

        {/* Features grid */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[650px] mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 border-2 border-black rounded-lg flex items-center justify-center">
              <Zap size={24} className="text-black" />
            </div>
            <h3
              className="font-semibold text-black mb-1"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Quick Test
            </h3>
            <p
              className="text-sm text-black/60"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Results in 30 seconds
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 border-2 border-black rounded-lg flex items-center justify-center">
              <Lock size={24} className="text-black" />
            </div>
            <h3
              className="font-semibold text-black mb-1"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              100% Secure
            </h3>
            <p
              className="text-sm text-black/60"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              No data collected
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 border-2 border-black rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-black" />
            </div>
            <h3
              className="font-semibold text-black mb-1"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Detailed Analysis
            </h3>
            <p
              className="text-sm text-black/60"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              A-F scoring
            </p>
          </div>
        </div>

        {/* Primary CTA button */}
        <div className="mb-8">
          <button
            onClick={onStartTest}
            className="bg-black hover:bg-black/90 text-white font-semibold text-lg px-12 py-4 rounded-full transition-all duration-200 hover:shadow-lg min-h-[56px] focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Try Now
          </button>
        </div>

        {/* Privacy notice */}
        <div className="text-center">
          <p
            className="text-[12px] md:text-[14px] text-black/50 leading-relaxed max-w-[500px] mx-auto"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            This test analyzes your browser's privacy features. No personal data is sent or stored on our servers. All tests are run locally.
          </p>
        </div>
      </div>
    </section>
  );
}
