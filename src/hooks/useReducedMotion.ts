"use client";

import { useReducedMotion as useMotionReducedMotion } from "motion/react";

/**
 * True when the visitor asked for reduced motion. Components use it to skip
 * non-essential movement (parallax, drift, marquee) while keeping content and
 * simple opacity changes.
 */
export function useReducedMotion(): boolean {
  return useMotionReducedMotion() ?? false;
}
