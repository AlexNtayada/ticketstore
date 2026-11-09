"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TicketButton, type TicketButtonProps } from "./TicketButton";

interface StickyTicketBarProps {
  title: string;
  meta: string;
  priceLabel: string | null;
  ticket: Omit<TicketButtonProps, "placement" | "size" | "variant">;
  /** Element ids that, while visible, hide the bar (the hero and the final CTA already sell). */
  hideWhenVisible: string[];
}

/**
 * Persistent conversion bar. Appears once the hero has scrolled away and
 * steps aside whenever another primary CTA (final section, footer) is on screen.
 * Bottom-docked on every size; respects safe areas and `--consent-offset`.
 */
export function StickyTicketBar({ title, meta, priceLabel, ticket, hideWhenVisible }: StickyTicketBarProps) {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const targets = hideWhenVisible.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    const onScreen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) onScreen.set(e.target, e.isIntersecting);
        setVisible(![...onScreen.values()].some(Boolean));
      },
      { threshold: 0, rootMargin: "0px 0px -80px 0px" },
    );
    targets.forEach((t) => {
      onScreen.set(t, true);
      io.observe(t);
    });
    return () => io.disconnect();
  }, [hideWhenVisible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          aria-label="Tickets"
          key="sticky"
          initial={reduced ? { opacity: 0 } : { y: "110%" }}
          animate={reduced ? { opacity: 1 } : { y: 0 }}
          exit={reduced ? { opacity: 0 } : { y: "110%" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 z-40 md:inset-x-[var(--gutter)] md:mx-auto md:max-w-[1100px]"
          style={{ bottom: "var(--consent-offset)" }}
        >
          <div
            className="flex items-center justify-between gap-4 border-t border-line bg-bg/95 px-[var(--gutter)] pt-3 backdrop-blur-md md:mb-4 md:rounded-full md:border md:py-2.5 md:pl-6 md:pr-2.5"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <div className="hidden min-w-0 items-baseline gap-5 md:flex">
              <span className="t-display-base truncate text-2xl leading-none">{title}</span>
              <span className="t-label truncate text-muted">{meta}</span>
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-4 md:flex-none md:justify-end">
              {priceLabel ? <span className="t-label tabular whitespace-nowrap">{priceLabel}</span> : <span className="t-label truncate md:hidden">{title}</span>}
              <TicketButton {...ticket} placement="sticky" size="md" variant="accent" />
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
