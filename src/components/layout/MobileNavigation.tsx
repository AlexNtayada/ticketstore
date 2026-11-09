"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TicketButton, type TicketButtonProps } from "../ui/TicketButton";

export interface NavLink {
  href: string;
  label: string;
}

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  closeLabel: string;
  meta: string;
  ticket: Omit<TicketButtonProps, "placement">;
}

/** Full-screen menu dialog: focus trapped, Escape closes, focus returns to the trigger. */
export function MobileNavigation({ open, onClose, links, closeLabel, meta, ticket }: MobileNavigationProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") {
        const items = focusables();
        if (!items.length) return;
        const first = items[0]!;
        const last = items[items.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-accent text-on-accent"
          initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
          exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="flex h-[var(--header-h)] items-center justify-between px-[var(--gutter)]">
            <span className="t-label">{meta}</span>
            <button
              type="button"
              onClick={onClose}
              className="t-label -mr-2 inline-flex h-11 items-center gap-2 px-2"
            >
              {closeLabel}
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-[var(--gutter)]">
            <ul>
              {links.map((l, i) => (
                <li key={l.href} className="border-t border-current/20 last:border-b">
                  <a
                    href={l.href}
                    onClick={onClose}
                    className="t-display-base flex items-baseline justify-between py-3 text-[clamp(3rem,16vw,5.5rem)] focus-visible:outline-on-accent"
                  >
                    {l.label}
                    <span className="t-label tabular opacity-60">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="px-[var(--gutter)]" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
            <TicketButton {...ticket} placement="mobile_menu" variant="dark" size="lg" className="w-full" />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
