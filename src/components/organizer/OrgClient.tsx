"use client";

import { useState, type ReactNode } from "react";
import { SHOW_FILTER_EVENT } from "@/lib/organizer-utils";

/** Filters the calendar to one show and scrolls to it. */
export function ShowDatesButton({ show, children, className = "" }: { show: string; children: ReactNode; className?: string }) {
  return (
    <a
      href="#calendar"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(SHOW_FILTER_EVENT, { detail: show }))}
    >
      {children}
    </a>
  );
}

/** Newsletter form. Not connected to any provider yet: it only shows the demo note. */
export function NewsletterForm({ demoNote }: { demoNote: string }) {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="mt-6 grid gap-3 md:grid-cols-[1fr_1.4fr_auto]"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label className="org-input">
        <span className="sr-only">Orașul</span>
        <input name="city" placeholder="Orașul" autoComplete="address-level2" />
      </label>
      <label className="org-input">
        <span className="sr-only">Email</span>
        <input name="email" type="email" required placeholder="Email" autoComplete="email" />
      </label>
      <button type="submit" className="cta inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 font-semibold text-on-accent">
        Anunță-mă
      </button>
      <p role="status" className="t-label text-muted md:col-span-3">
        {sent ? demoNote : ""}
      </p>
    </form>
  );
}
