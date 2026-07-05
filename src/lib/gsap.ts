"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// ponytail: no SplitText — headings here are already 1-2 spans, and
// background-clip gradient text breaks when split; manual line masks instead.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Debug handle (harmless in prod, handy in DevTools)
  (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
}

export { gsap, ScrollTrigger, useGSAP };
