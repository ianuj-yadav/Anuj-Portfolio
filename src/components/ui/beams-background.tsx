"use client";

/**
 * @author: @dorianbaffier
 * @description: Beams Background - Optimized for vibrant background glow behind hero portrait
 * @version: 1.0.1
 * @license: MIT
 * @website: https://kokonutui.com
 */

import { motion } from "motion/react";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(width: number, height: number, isDarkMode: boolean): Beam {
  const angle = -35 + Math.random() * 10;
  // Blend between rich cyan/blue (190-250) and subtle warm peach accents (340-20)
  const isAccent = Math.random() < 0.25;
  const hueBase = isAccent ? 15 : (isDarkMode ? 195 : 215);
  const hueRange = isAccent ? 25 : (isDarkMode ? 60 : 40);

  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 45 + Math.random() * 85,
    length: height * 2.8,
    angle,
    speed: 0.7 + Math.random() * 1.3,
    opacity: 0.22 + Math.random() * 0.28,
    hue: hueBase + Math.random() * hueRange,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.015 + Math.random() * 0.03,
  };
}

export default function BeamsBackground({
  className,
  intensity = "strong",
  children,
}: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const MINIMUM_BEAMS = 24;
  const isDarkModeRef = useRef<boolean>(true);

  const opacityMap = {
    subtle: 0.6,
    medium: 0.85,
    strong: 1.2,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateDarkMode = () => {
      isDarkModeRef.current =
        document.documentElement.classList.contains("dark") ||
        !document.documentElement.classList.contains("light");
    };

    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    updateDarkMode();

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const totalBeams = Math.floor(MINIMUM_BEAMS * 1.5);
      beamsRef.current = Array.from({ length: totalBeams }, () =>
        createBeam(width, height, isDarkModeRef.current)
      );
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam;

      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      const column = index % 4;
      const spacing = width / 4;

      const isAccent = Math.random() < 0.25;
      const hueBase = isAccent ? 15 : (isDarkModeRef.current ? 195 : 215);
      const hueRange = isAccent ? 25 : (isDarkModeRef.current ? 60 : 40);

      beam.y = height + 150;
      beam.x =
        column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.6;
      beam.width = 60 + Math.random() * 90;
      beam.speed = 0.6 + Math.random() * 0.8;
      beam.hue = hueBase + (index * hueRange) / totalBeams;
      beam.opacity = 0.25 + Math.random() * 0.25;
      return beam;
    }

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity =
        beam.opacity *
        (0.85 + Math.sin(beam.pulse) * 0.25) *
        opacityMap[intensity];

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

      const saturation = isDarkModeRef.current ? "90%" : "80%";
      const lightness = isDarkModeRef.current ? "62%" : "50%";

      gradient.addColorStop(
        0,
        `hsla(${beam.hue}, ${saturation}, ${lightness}, 0)`
      );
      gradient.addColorStop(
        0.15,
        `hsla(${beam.hue}, ${saturation}, ${lightness}, ${
          pulsingOpacity * 0.6
        })`
      );
      gradient.addColorStop(
        0.45,
        `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity})`
      );
      gradient.addColorStop(
        0.75,
        `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity * 0.7})`
      );
      gradient.addColorStop(
        1,
        `hsla(${beam.hue}, ${saturation}, ${lightness}, 0)`
      );

      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    }

    function animate() {
      if (!(canvas && ctx)) return;

      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      ctx.clearRect(0, 0, width, height);
      ctx.filter = "blur(18px)";

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams);
        }

        drawBeam(ctx, beam);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      observer.disconnect();
    };
  }, [intensity]);

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden bg-[#07060a]",
        className
      )}
    >
      <canvas
        className="absolute inset-0 pointer-events-none w-full h-full"
        ref={canvasRef}
      />

      <motion.div
        animate={{
          opacity: [0.1, 0.25, 0.1],
        }}
        className="absolute inset-0 bg-radial-gradient pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(208, 139, 155, 0.08) 0%, transparent 70%)",
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      {children}
    </div>
  );
}
