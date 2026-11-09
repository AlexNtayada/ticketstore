"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface RevealMediaProps {
  children: ReactNode;
  className?: string;
  /** Premium: subtle vertical parallax of the image inside its frame. */
  parallax?: boolean;
  from?: "bottom" | "left" | "right";
}

const clipFrom = {
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** Image transition: a clip-path wipe as the frame enters, then optional parallax. */
export function RevealMedia({ children, className = "", parallax = false, from = "bottom" }: RevealMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const { hidden } = useScrollReveal(ref, "0px 0px -10% 0px");
  const scale = parallax && !reduced ? 1.12 : 1;

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      initial={false}
      animate={{ clipPath: hidden ? clipFrom[from] : "inset(0% 0% 0% 0%)" }}
      transition={hidden || reduced ? { duration: 0 } : { duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div style={parallax && !reduced ? { y, scale } : undefined} className="h-full">
        {children}
      </motion.div>
    </motion.div>
  );
}
