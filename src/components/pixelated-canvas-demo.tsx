"use client";
import React from "react";
import { PixelatedCanvas } from "./ui/pixelated-canvas";

export function PixelatedCanvasDemo() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <PixelatedCanvas
        src="/assets/anuj-poly-cutout.png"
        width={640}
        height={800}
        cellSize={3}
        dotScale={0.9}
        shape="square"
        backgroundColor="transparent"
        dropoutStrength={0.35}
        interactive={true}
        distortionStrength={3}
        distortionRadius={90}
        distortionMode="swirl"
        followSpeed={0.2}
        jitterStrength={3}
        jitterSpeed={4}
        sampleAverage={true}
        tintColor="transparent"
        tintStrength={0.15}
        className=""
      />
    </div>
  );
}
