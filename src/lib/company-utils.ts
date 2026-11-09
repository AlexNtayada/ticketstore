import type { CompanyConfig, CompanyEvent } from "@/types/company";
import { isTicketstoreUrl, PRESENTATION_HREF } from "./ticketstore";
import { formatDateParts, todayIn } from "./organizer-utils";

export { formatDateParts, todayIn };

const anchor = (date: string) => new Date(`${date}T12:00:00Z`);

export function sortByDate<T extends { date: string; time?: string }>(events: T[]) {
  return [...events].sort((a, b) => (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? "")));
}

/** Dates from today (inclusive), in order. */
export function upcoming(org: CompanyConfig, now: number) {
  const today = todayIn(org.timezone, now);
  return sortByDate(org.events).filter((e) => e.date >= today);
}

/** Next date that can actually be bought on Ticketstore. */
export function nextBuyable(org: CompanyConfig, now: number) {
  return upcoming(org, now).find((e) => !e.status && isTicketstoreUrl(e.ticketUrl)) ?? null;
}

export function daysBetween(from: string, to: string) {
  return Math.round((anchor(to).getTime() - anchor(from).getTime()) / 86_400_000);
}

/** "azi", "mâine", "în 3 zile", "în 20 de zile" */
export function inDays(n: number) {
  if (n <= 0) return "azi";
  if (n === 1) return "mâine";
  return n < 20 ? `în ${n} zile` : `în ${n} de zile`;
}

/** "Noiembrie" */
export function monthName(date: string) {
  const m = new Intl.DateTimeFormat("ro-RO", { month: "long", timeZone: "UTC" }).format(anchor(date));
  return m.charAt(0).toLocaleUpperCase("ro-RO") + m.slice(1);
}

/** "noiembrie 2026" */
export function monthYear(date: string) {
  return new Intl.DateTimeFormat("ro-RO", { month: "long", year: "numeric", timeZone: "UTC" }).format(anchor(date));
}

export function eventHref(org: CompanyConfig, e: CompanyEvent) {
  if (e.status || !isTicketstoreUrl(e.ticketUrl)) return null;
  return org.ticketMode === "presentation" ? PRESENTATION_HREF : e.ticketUrl;
}

export function price(org: CompanyConfig, amount: number | undefined) {
  return typeof amount === "number" && amount >= 0 ? `de la ${amount} ${org.currencyLabel}` : null;
}

/** Cities with upcoming dates, and cities only visited before (with how many shows). */
export function cities(org: CompanyConfig, now: number) {
  const next = [...new Set(upcoming(org, now).map((e) => e.city))].sort((a, b) => a.localeCompare(b, "ro"));
  const counts = new Map<string, number>();
  for (const p of org.past) counts.set(p.city, (counts.get(p.city) ?? 0) + 1);
  const visited = [...counts.entries()]
    .filter(([c]) => !next.includes(c))
    .sort((a, b) => a[0].localeCompare(b[0], "ro"))
    .map(([city, count]) => ({ city, count }));
  return { next, visited, all: new Set([...next, ...counts.keys()]).size };
}

/** Fired by the hero city picker; the tour section and alert form listen. */
export const CITY_EVENT = "co:city";
