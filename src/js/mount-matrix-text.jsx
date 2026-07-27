import React from "react";
import { createRoot } from "react-dom/client";
import FuzzyText from "../components/ui/FuzzyText";

export function mountHeroMatrixText() {
  const container = document.getElementById("hero-title");
  if (!container) return;

  const root = createRoot(container);
  root.render(
    <FuzzyText
      baseIntensity={0.18}
      hoverIntensity={0.55}
      enableHover={true}
      fontWeight={800}
      fontSize="clamp(3.8rem, 8.5vw, 8rem)"
      color="#ffffff"
      fps={120}
      glitchMode={true}
      glitchInterval={2500}
      glitchDuration={200}
      clickEffect={true}
    >
      ANUJ YADAV
    </FuzzyText>
  );
}
