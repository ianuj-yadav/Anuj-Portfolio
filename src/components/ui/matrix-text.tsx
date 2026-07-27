"use client";

/**
 * @author: @dorianbaffier
 * @description: Matrix Text Component for ANUJ YADAV
 * @version: 1.0.0
 * @website: https://kokonutui.com
 */

import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface LetterState {
  char: string;
  isMatrix: boolean;
  isSpace: boolean;
}

interface MatrixTextProps {
  text?: string;
  className?: string;
  letterAnimationDuration?: number;
  letterInterval?: number;
}

const MatrixText = ({
  text = "ANUJ YADAV",
  className,
  letterAnimationDuration = 500,
  letterInterval = 80,
}: MatrixTextProps) => {
  const [letters, setLetters] = useState<LetterState[]>(() =>
    text.split("").map((char) => ({
      char,
      isMatrix: false,
      isSpace: char === " ",
    }))
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomChar = useCallback(
    () => (Math.random() > 0.5 ? "1" : "0"),
    []
  );

  const animateLetter = useCallback(
    (index: number) => {
      if (index >= text.length) return;

      requestAnimationFrame(() => {
        setLetters((prev) => {
          const newLetters = [...prev];
          if (!newLetters[index].isSpace) {
            newLetters[index] = {
              ...newLetters[index],
              char: getRandomChar(),
              isMatrix: true,
            };
          }
          return newLetters;
        });

        setTimeout(() => {
          setLetters((prev) => {
            const newLetters = [...prev];
            newLetters[index] = {
              ...newLetters[index],
              char: text[index],
              isMatrix: false,
            };
            return newLetters;
          });
        }, letterAnimationDuration);
      });
    },
    [getRandomChar, text, letterAnimationDuration]
  );

  const startAnimation = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    let currentIndex = 0;

    const animate = () => {
      if (currentIndex >= text.length) {
        setIsAnimating(false);
        return;
      }

      animateLetter(currentIndex);
      currentIndex++;
      setTimeout(animate, letterInterval);
    };

    animate();
  }, [animateLetter, text, isAnimating, letterInterval]);

  useEffect(() => {
    // Trigger when loading screen finishes
    const handleIntroFinished = () => {
      setTimeout(startAnimation, 300);
    };
    document.addEventListener("intro:finished", handleIntroFinished);

    // Fallback trigger if intro screen was skipped or already played
    const timer = setTimeout(() => {
      startAnimation();
    }, 3800);

    return () => {
      document.removeEventListener("intro:finished", handleIntroFinished);
      clearTimeout(timer);
    };
  }, [startAnimation]);

  const motionVariants = useMemo(
    () => ({
      matrix: {
        color: "#00ff88",
        textShadow: "0 0 25px rgba(0, 255, 136, 0.95), 0 0 50px rgba(0, 255, 136, 0.7)",
      },
      normal: {
        color: "#ffffff",
        textShadow: "0 4px 30px rgba(0, 0, 0, 0.9)",
      },
    }),
    []
  );

  return (
    <div
      aria-label="Matrix text animation"
      className={cn("inline-flex items-center justify-center cursor-pointer select-none", className)}
      onMouseEnter={startAnimation}
      onClick={startAnimation}
    >
      <div className="flex items-center justify-center flex-wrap">
        {letters.map((letter, index) => (
          <motion.span
            key={`${index}-${letter.char}`}
            initial="normal"
            animate={letter.isMatrix ? "matrix" : "normal"}
            variants={motionVariants}
            transition={{
              duration: 0.1,
              ease: "easeInOut",
            }}
            className="inline-block overflow-hidden text-center"
            style={{
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              letterSpacing: "inherit",
              lineHeight: "inherit",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {letter.isSpace ? "\u00A0" : letter.char}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default MatrixText;
