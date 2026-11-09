"use client";

import type { TicketPlacement } from "./ticketstore";

/**
 * Click tracking for ticket CTAs.
 *
 * - Nothing is sent unless analytics is enabled in the config AND the visitor
 *   has granted consent (see `setAnalyticsConsent`, to be called by your
 *   consent banner / CMP).
 * - A click is only a click. Purchases happen on Ticketstore.ro; do not report
 *   these events as conversions.
 */

export type TicketEventName =
  | "ticket_cta_click"
  | "hero_ticket_click"
  | "sticky_ticket_click"
  | "details_ticket_click"
  | "final_ticket_click";

const placementEvent: Partial<Record<TicketPlacement, TicketEventName>> = {
  hero: "hero_ticket_click",
  sticky: "sticky_ticket_click",
  details: "details_ticket_click",
  final: "final_ticket_click",
};

const CONSENT_KEY = "dep-analytics-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __DEP_ANALYTICS_ENABLED__?: boolean;
  }
}

export function hasAnalyticsConsent(): boolean {
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

/** Call from your consent banner. Fires `dep:consent` so the loader can react. */
export function setAnalyticsConsent(granted: boolean) {
  try {
    window.localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  } catch {
    /* storage unavailable: treat as not granted */
  }
  window.dispatchEvent(new CustomEvent("dep:consent", { detail: { granted } }));
}

export function trackTicketClick(placement: TicketPlacement, eventId: string) {
  if (typeof window === "undefined") return;
  const detail = { placement, event_id: eventId };
  // Always available for integrators, no data leaves the page.
  window.dispatchEvent(new CustomEvent("dep:ticket_click", { detail }));

  if (!window.__DEP_ANALYTICS_ENABLED__ || !hasAnalyticsConsent()) return;
  const names: TicketEventName[] = ["ticket_cta_click"];
  const specific = placementEvent[placement];
  if (specific) names.push(specific);

  for (const name of names) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, { ...detail, transport_type: "beacon" });
    } else {
      (window.dataLayer ||= []).push({ event: name, ...detail });
    }
  }
}
