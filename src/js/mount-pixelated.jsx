import React from "react";
import { createRoot } from "react-dom/client";
import { PixelatedCanvasDemo } from "../components/pixelated-canvas-demo";

export function mountPixelatedCanvas() {
  const container = document.getElementById("pixelated-canvas-root");
  if (!container) return;

  const root = createRoot(container);
  root.render(<PixelatedCanvasDemo />);
}
