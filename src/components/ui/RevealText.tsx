"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type ElementType } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface RevealTextProps {
  lines: string[];
  as?: ElementType;
  className?: string;
  /** Per-line classes, cycled (e.g. stepped indents). */
  lineClasses?: string[];
  /** Premium: lines drift horizontally with scroll, alternating direction. */
  drift?: boolean;
  id?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

function DriftLine({ progress, index, children }: { progress: MotionValue<number>; index: number; children: React.ReactNode }) {
  const dir = index % 2 === 0 ? -1 : 1;
  const x = useTransform(progress, [0, 1], [`${dir * -3}%`, `${dir * 3}%`]);
  return <motion.span className="block will-change-transform" style={{ x }}>{children}</motion.span>;
}

/**
 * Editorial headline revealed line by line through a mask as it enters the
 * viewport. Text is real, selectable, and present in the server HTML.
 */
export function RevealText({ lines, as: Tag = "h2", className = "", lineClasses, drift = false, id }: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Observe the (unclipped) heading itself: masked lines are clipped while
  // hidden, so observing them directly would never report an intersection.
  const { hidden } = useScrollReveal(ref);
  // Drift only where there is horizontal room (tablet and up).
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const useDrift = drift && !reduced && wide;

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => {
        const inner = (
          <motion.span
            className="block"
            // Visible in the server HTML; hidden instantly only once armed below the fold.
            initial={false}
            animate={{ y: hidden ? "105%" : "0%" }}
            transition={hidden || reduced ? { duration: 0 } : { duration: 1.05, ease, delay: i * 0.09 }}
          >
            {line}
          </motion.span>
        );
        return (
          <span key={`${line}-${i}`} className={`mask-line ${lineClasses?.length ? lineClasses[i % lineClasses.length] : ""}`}>
            {useDrift ? <DriftLine progress={scrollYProgress} index={i}>{inner}</DriftLine> : inner}
          </span>
        );
      })}
    </Tag>
  );
}
