import { EncryptedText } from "./ui/encrypted-text";
import React, { useState, useEffect } from "react";

export default function EncryptedTextDemoSecond() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fading out after 2.8 seconds when decrypt finishes
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2800);

    // Completely remove intro screen after 3.4 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
      const introScreen = document.getElementById("intro-screen");
      if (introScreen) {
        introScreen.style.display = "none";
        introScreen.style.pointerEvents = "none";
      }
    }, 3400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full min-h-screen bg-[#07060b] px-6 text-center select-none transition-opacity duration-700 ease-in-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6 max-w-3xl">
        {/* Matrix Cyber Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(0,255,136,0.25)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>NEURAL MATRIX BOOT — ONLINE</span>
        </div>

        {/* Matrix Main Heading with Heavy Bold Cyber Font Styling */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-widest text-emerald-400 font-sans leading-tight">
          <EncryptedText
            text="Welcome to the Matrix"
            encryptedClassName="text-emerald-950 opacity-40"
            revealedClassName="text-emerald-400 drop-shadow-[0_0_20px_rgba(0,255,136,0.95)]"
            revealDelayMs={35}
            flipDelayMs={20}
          />
        </h1>

        {/* Subtitle Decrypt */}
        <p className="text-lg sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wider text-neutral-100 font-mono">
          <EncryptedText
            text="Anuj's Portfolio Loading Soon..."
            encryptedClassName="text-neutral-700 opacity-40"
            revealedClassName="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            revealDelayMs={35}
            flipDelayMs={20}
          />
        </p>

        {/* Cyber Neon Green Loading Bar */}
        <div className="w-72 sm:w-96 h-2 bg-neutral-900 rounded-full overflow-hidden mt-6 border border-emerald-500/40 shadow-[0_0_20px_rgba(0,255,136,0.4)] relative">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-300 animate-[matrixProgress_2.6s_cubic-bezier(0.4,0,0.2,1)_forwards] shadow-[0_0_15px_#00ff88]"></div>
        </div>

        {/* Terminal Indicator */}
        <span className="font-mono text-xs text-emerald-400/90 tracking-widest uppercase mt-1 animate-pulse">
          [ DECRYPTING SYSTEM CORE — 100% COMPLETE ]
        </span>
      </div>
    </div>
  );
}
