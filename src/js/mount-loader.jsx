import React from "react";
import { createRoot } from "react-dom/client";
import IntroSequence from "../components/intro-sequence/IntroSequence";

export function mountMatrixLoader() {
  const container = document.getElementById("intro-screen");
  if (!container) return;

  const root = createRoot(container);
  root.render(<IntroSequence />);
}
