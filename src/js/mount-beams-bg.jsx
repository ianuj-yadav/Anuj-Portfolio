import React from "react";
import { createRoot } from "react-dom/client";
import BeamsBackground from "../components/ui/beams-background";

export function mountBeamsBackground() {
  const container = document.getElementById("beams-background-root");
  if (!container) return;

  const root = createRoot(container);
  root.render(<BeamsBackground intensity="strong" />);
}
