"use client";

import { useInView } from "motion/react";
import { useEffect, useState, type RefObject } from "react";

/**
 * Progressive scroll reveal. Content is fully visible in the server HTML (and
 * stays visible without JavaScript). After mount, only elements that are still
 * below the fold get "armed" (hidden instantly), then revealed as they enter.
 * Returns `hidden`: true while an armed element waits off-screen.
 */
export function useScrollReveal(ref: RefObject<Element | null>, margin = "0px 0px -12% 0px") {
  const inView = useInView(ref, { once: true, margin: margin as never });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top > window.innerHeight * 0.9) setArmed(true);
  }, [ref]);

  return { hidden: armed && !inView, inView };
}
