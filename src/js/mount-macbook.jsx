import React from "react";
import { createRoot } from "react-dom/client";
import { MacbookScrollDemo } from "../components/macbook-scroll-demo";

export function mountMacbookDemo() {
  const container = document.getElementById("macbook-demo-root");
  if (!container) return;

  const root = createRoot(container);
  root.render(<MacbookScrollDemo />);
}
