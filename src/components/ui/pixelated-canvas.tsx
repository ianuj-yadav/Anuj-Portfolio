"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

interface PixelatedCanvasProps {
  src: string;
  width?: number;
  height?: number;
  cellSize?: number;
  dotScale?: number;
  shape?: "square" | "circle";
  backgroundColor?: string;
  dropoutStrength?: number;
  interactive?: boolean;
  distortionStrength?: number;
  distortionRadius?: number;
  distortionMode?: "swirl" | "repel" | "attract";
  followSpeed?: number;
  jitterStrength?: number;
  jitterSpeed?: number;
  sampleAverage?: boolean;
  tintColor?: string;
  tintStrength?: number;
  className?: string;
}

export const PixelatedCanvas: React.FC<PixelatedCanvasProps> = ({
  src,
  width = 400,
  height = 500,
  cellSize = 3,
  dotScale = 0.9,
  shape = "square",
  backgroundColor = "#000000",
  dropoutStrength = 0.4,
  interactive = true,
  distortionStrength = 3,
  distortionRadius = 80,
  distortionMode = "swirl",
  followSpeed = 0.2,
  jitterStrength = 4,
  jitterSpeed = 4,
  sampleAverage = true,
  tintColor = "#FFFFFF",
  tintStrength = 0.2,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animFrameId: number;
    let imgData: ImageData | null = null;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;

    img.onload = () => {
      // Create offscreen canvas to scale image to canvas dimensions
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      // Draw image contained/centered
      const scale = Math.min(width / img.width, height / img.height);
      const x = (width - img.width * scale) / 2;
      const y = (height - img.height * scale) / 2;
      offCtx.drawImage(img, x, y, img.width * scale, img.height * scale);

      imgData = offCtx.getImageData(0, 0, width, height);
      render();
    };

    let time = 0;

    const render = () => {
      time += 0.05 * jitterSpeed;

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * followSpeed;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * followSpeed;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      if (!imgData) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      const cols = Math.floor(width / cellSize);
      const rows = Math.floor(height / cellSize);
      const data = imgData.data;

      // Hash helper for deterministic dropout
      const pseudoRandom = (x: number, y: number) => {
        return Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1;
      };

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const origX = c * cellSize + cellSize / 2;
          const origY = r * cellSize + cellSize / 2;

          // Dropout check
          if (dropoutStrength > 0 && Math.abs(pseudoRandom(c, r)) < dropoutStrength) {
            continue;
          }

          let px = origX;
          let py = origY;

          // Interactive distortion
          if (interactive) {
            const dx = origX - mouseRef.current.x;
            const dy = origY - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < distortionRadius && dist > 0) {
              const factor = (1 - dist / distortionRadius) * distortionStrength;
              if (distortionMode === "swirl") {
                const angle = factor * Math.PI * 0.5;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                px = mouseRef.current.x + dx * cos - dy * sin;
                py = mouseRef.current.y + dx * sin + dy * cos;
              } else if (distortionMode === "repel") {
                px += (dx / dist) * factor * 20;
                py += (dy / dist) * factor * 20;
              } else if (distortionMode === "attract") {
                px -= (dx / dist) * factor * 20;
                py -= (dy / dist) * factor * 20;
              }
            }
          }

          // Jitter effect
          if (jitterStrength > 0) {
            const jitterX = Math.sin(time + c * 0.5) * jitterStrength;
            const jitterY = Math.cos(time + r * 0.5) * jitterStrength;
            px += jitterX;
            py += jitterY;
          }

          // Sample pixel color from imgData
          const sampleX = Math.min(width - 1, Math.max(0, Math.floor(px)));
          const sampleY = Math.min(height - 1, Math.max(0, Math.floor(py)));
          const index = (sampleY * width + sampleX) * 4;

          let red = data[index];
          let green = data[index + 1];
          let blue = data[index + 2];
          const alpha = data[index + 3] / 255;

          if (alpha < 0.05) continue;

          // Apply tint
          if (tintStrength > 0 && tintColor) {
            const tintR = parseInt(tintColor.slice(1, 3), 16) || 255;
            const tintG = parseInt(tintColor.slice(3, 5), 16) || 255;
            const tintB = parseInt(tintColor.slice(5, 7), 16) || 255;

            red = Math.round(red * (1 - tintStrength) + tintR * tintStrength);
            green = Math.round(green * (1 - tintStrength) + tintG * tintStrength);
            blue = Math.round(blue * (1 - tintStrength) + tintB * tintStrength);
          }

          ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

          const drawSize = cellSize * dotScale;
          const drawX = origX - drawSize / 2;
          const drawY = origY - drawSize / 2;

          if (shape === "circle") {
            ctx.beginPath();
            ctx.arc(origX, origY, drawSize / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(drawX, drawY, drawSize, drawSize);
          }
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [
    src,
    width,
    height,
    cellSize,
    dotScale,
    shape,
    backgroundColor,
    dropoutStrength,
    interactive,
    distortionStrength,
    distortionRadius,
    distortionMode,
    followSpeed,
    jitterStrength,
    jitterSpeed,
    sampleAverage,
    tintColor,
    tintStrength,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={cn("block max-w-full h-auto cursor-crosshair", className)}
    />
  );
};
