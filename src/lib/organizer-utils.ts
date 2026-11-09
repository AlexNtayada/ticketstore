import type { OrganizerConfig, OrgEvent, ShowCategory } from "@/types/organizer";
import { isTicketstoreUrl, PRESENTATION_HREF } from "./ticketstore";

export const CATEGORY_LABELS: Record<ShowCategory | "toate", string> = {
  toate: "Toate",
  teatru: "Teatru",
  concerte: "Concerte",
  copii: "Pentru copii",
};

/** Calendar dates are anchored at noon UTC so they never shift a day across time zones. */
const anchor = (date: string) => new Date(`${date}T12:00:00Z`);

const cap = (s: string) => s.charAt(0).toLocaleUpperCase("ro-RO") + s.slice(1);

/** "Vineri, 6 noiembrie" */
export function formatDayHeading(date: string) {
  return cap(new Intl.DateTimeFormat("ro-RO", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(anchor(date)));
}

/** { day: "22", month: "nov", weekday: "Duminică" } */
export function formatDateParts(date: string) {
  const d = anchor(date);
  return {
    day: new Intl.DateTimeFormat("ro-RO", { day: "numeric", timeZone: "UTC" }).format(d),
    month: new Intl.DateTimeFormat("ro-RO", { month: "short", timeZone: "UTC" }).format(d).replace(".", ""),
    weekday: cap(new Intl.DateTimeFormat("ro-RO", { weekday: "long", timeZone: "UTC" }).format(d)),
  };
}

/** Today's calendar date ("YYYY-MM-DD") in the organizer's time zone. */
export function todayIn(timeZone: string, now: number) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(now));
}

export function addDays(date: string, days: number) {
  const d = anchor(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function sortEvents(events: OrgEvent[]) {
  return [...events].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

/** Events from today (inclusive) up to `windowDays` ahead. */
export function upcomingEvents(org: OrganizerConfig, now: number, windowDays = org.calendar.windowDays) {
  const today = todayIn(org.timezone, now);
  const end = addDays(today, windowDays);
  return sortEvents(org.events).filter((e) => e.date >= today && e.date <= end);
}

/** The featured show's next date; falls back to its last date when all are past. */
export function featuredEvent(org: OrganizerConfig, now: number) {
  const today = todayIn(org.timezone, now);
  const dates = sortEvents(org.events.filter((e) => e.show === org.featured.show));
  return dates.find((e) => e.date >= today) ?? dates.at(-1) ?? null;
}

export function ticketHref(org: OrganizerConfig, url: string) {
  if (!isTicketstoreUrl(url)) return null;
  return org.ticketMode === "presentation" ? PRESENTATION_HREF : url;
}

export function priceLabel(org: OrganizerConfig, amount: number | undefined) {
  return typeof amount === "number" && amount >= 0 ? `de la ${amount} ${org.currencyLabel}` : null;
}

export function mapsUrl(name: string, address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}`)}`;
}

/** Fired by "Vezi datele" buttons; the calendar listens and filters by show. */
export const SHOW_FILTER_EVENT = "org:show-filter";
