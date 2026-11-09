"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

/** Short toast shown when a ticket button is pressed in presentation mode. */
export function PresentationNotice({ message }: { message: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let t: number | undefined;
    const show = () => {
      setOpen(true);
      window.clearTimeout(t);
      t = window.setTimeout(() => setOpen(false), 3200);
    };
    window.addEventListener("dep:presentation-click", show);
    return () => {
      window.removeEventListener("dep:presentation-click", show);
      window.clearTimeout(t);
    };
  }, []);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[calc(var(--header-h)+12px)] z-[75] flex justify-center px-[var(--gutter)]">
      <AnimatePresence>
        {open ? (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="t-label max-w-md rounded-full bg-fg px-5 py-3 text-center text-bg shadow-2xl"
          >
            {message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
