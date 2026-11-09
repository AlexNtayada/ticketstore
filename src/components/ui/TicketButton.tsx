"use client";

import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { trackTicketClick } from "@/lib/analytics";
import { PRESENTATION_HREF, type TicketPlacement } from "@/lib/ticketstore";

export interface TicketButtonProps {
  href: string | null;
  label: string;
  placement: TicketPlacement;
  eventId: string;
  target?: "_self" | "_blank";
  variant?: "accent" | "outline" | "inverse" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  /** Extra visually hidden context for screen readers, e.g. the event name. */
  srContext?: string;
  misconfigured?: boolean;
  className?: string;
  children?: ReactNode;
}

const sizes = {
  sm: "h-10 px-4 text-[0.72rem] gap-2",
  md: "h-12 px-5 text-[0.8rem] gap-2.5",
  lg: "h-14 px-7 text-[0.85rem] gap-3",
  xl: "h-16 md:h-20 px-8 md:px-10 text-[0.9rem] md:text-base gap-4",
};

const variants = {
  accent: "bg-accent text-on-accent",
  outline: "border border-current text-fg",
  inverse: "bg-fg text-bg",
  dark: "bg-on-accent text-accent",
};

/**
 * The only purchase control in the template. Always a real <a> to the
 * configured Ticketstore URL; no intermediate steps, no fake checkout.
 * Without a usable URL it renders as inert text, never as a dead link.
 */
export function TicketButton({
  href,
  label,
  placement,
  eventId,
  target = "_self",
  variant = "accent",
  size = "md",
  srContext,
  misconfigured,
  className = "",
}: TicketButtonProps) {
  const base =
    "cta group/cta relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold uppercase tracking-[0.12em] whitespace-nowrap select-none";

  if (!href) {
    return (
      <span
        aria-disabled="true"
        title={misconfigured ? "Configuration: ticketUrl is missing or invalid" : undefined}
        data-misconfigured={misconfigured || undefined}
        className={`${base} ${sizes[size]} cursor-not-allowed border border-dashed border-line text-muted ${className}`}
      >
        {label}
      </span>
    );
  }

  const presentation = href === PRESENTATION_HREF;
  const external = target === "_blank" && !presentation;
  return (
    <a
      href={href}
      target={target}
      rel={external ? "noopener" : undefined}
      onClick={(e) => {
        if (presentation) {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("dep:presentation-click", { detail: { placement } }));
          return;
        }
        trackTicketClick(placement, eventId);
      }}
      className={`${base} ${sizes[size]} ${variants[variant]} transition-[transform,box-shadow] duration-[var(--motion-fast)] ease-expo hover:-translate-y-px active:translate-y-0 ${className}`}
    >
      {/* wipe highlight */}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-[101%] bg-current opacity-[0.12] transition-transform duration-[var(--motion-normal)] ease-expo group-hover/cta:translate-x-0"
      />
      <span className="relative">{label}</span>
      {srContext ? <span className="sr-only"> — {srContext}</span> : null}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      <ArrowUpRight
        aria-hidden
        className="relative size-[1.25em] transition-transform duration-[var(--motion-normal)] ease-expo group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
        strokeWidth={2.25}
      />
    </a>
  );
}
