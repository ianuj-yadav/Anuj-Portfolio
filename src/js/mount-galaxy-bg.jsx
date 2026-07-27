import React from "react";
import { createRoot } from "react-dom/client";
import Galaxy from "../components/ui/galaxy";

export function mountGalaxyBackground() {
  const container = document.getElementById("beams-background-root");
  if (!container) return;

  const root = createRoot(container);
  root.render(
    <Galaxy
      starSpeed={0.5}
      density={1}
      hueShift={140}
      speed={1}
      glowIntensity={0.3}
      saturation={0}
      mouseRepulsion={true}
      repulsionStrength={2}
      twinkleIntensity={0.3}
      rotationSpeed={0.1}
      transparent={true}
    />
  );
}
