import type { EventConfig, Locale } from "@/types/event";

const intlLocale = (locale: Locale) => (locale === "ro" ? "ro-RO" : "en-GB");

/**
 * A calendar date ("YYYY-MM-DD") is the same everywhere, so we anchor it at
 * noon UTC and format in UTC. This avoids the classic off-by-one-day bug when
 * the visitor's (or server's) time zone differs from the event's.
 */
function dateAnchor(date: string) {
  return new Date(`${date}T12:00:00Z`);
}

export function isValidDate(date: string | undefined): date is string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  return !Number.isNaN(dateAnchor(date).getTime());
}

export function isValidTime(time: string | undefined): time is string {
  return !!time && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

export function formatEventDate(event: EventConfig, style: "long" | "short" | "numeric" = "long") {
  if (!isValidDate(event.date)) return "";
  const d = dateAnchor(event.date);
  const loc = intlLocale(event.locale);
  if (style === "numeric") {
    return new Intl.DateTimeFormat(loc, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" })
      .format(d)
      .replace(/\//g, ".");
  }
  return new Intl.DateTimeFormat(loc, {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(d)
    .replace(/\./g, "");
}

export function formatWeekday(event: EventConfig) {
  if (!isValidDate(event.date)) return "";
  return new Intl.DateTimeFormat(intlLocale(event.locale), { weekday: "long", timeZone: "UTC" }).format(
    dateAnchor(event.date),
  );
}

/**
 * Returns the UTC offset ("+02:00") of `timeZone` at the given local date/time.
 * Used for ISO timestamps in structured data and for the countdown.
 */
export function getTimeZoneOffset(date: string, time: string, timeZone: string): string {
  const guess = new Date(`${date}T${time}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" }).formatToParts(guess);
  const name = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const match = name.match(/GMT([+-]\d{2}):?(\d{2})?/);
  if (!match) return "+00:00";
  return `${match[1]}:${match[2] ?? "00"}`;
}

/** ISO 8601 timestamp of a local event time, e.g. 2026-12-14T20:30:00+02:00 */
export function toEventISO(event: EventConfig, time: string | undefined): string | null {
  if (!isValidDate(event.date)) return null;
  if (!isValidTime(time)) return event.date;
  return `${event.date}T${time}:00${getTimeZoneOffset(event.date, time, event.timezone)}`;
}

export function eventStartTimestamp(event: EventConfig): number | null {
  const iso = toEventISO(event, event.startTime ?? event.doorsTime ?? "00:00");
  if (!iso) return null;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? null : t;
}

export function formatPrice(event: EventConfig, amount: number | undefined = event.priceFrom) {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) return null;
  const currency = event.currency || "RON";
  const value = new Intl.NumberFormat(intlLocale(event.locale), { maximumFractionDigits: 2 }).format(amount);
  return `${value} ${currency}`;
}

/**
 * Splits a display name into balanced lines so long names wrap gracefully
 * instead of shrinking to nothing or being cropped.
 */
export function splitDisplayLines(name: string, maxCharsPerLine = 11, maxLines = 3): string[] {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1 || name.length <= maxCharsPerLine) return [name.trim()];
  const lineCount = Math.min(maxLines, words.length, Math.ceil(name.length / maxCharsPerLine));
  const target = name.length / lineCount;
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && candidate.length > target * 1.15 && lines.length < lineCount - 1) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function longestLine(lines: string[]) {
  return Math.max(1, ...lines.map((l) => l.length));
}

export function directionsUrl(event: EventConfig) {
  const v = event.venue;
  if (v.mapUrl) return v.mapUrl;
  const query = [v.name, v.address, v.city, v.country].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Which optional sections have enough content to render. */
export function getSectionVisibility(event: EventConfig) {
  return {
    statement: (event.statement?.filter(Boolean).length ?? 0) > 0,
    story: !!event.story && (event.story.body.filter(Boolean).length > 0 || !!event.story.image),
    gallery: event.gallery.length > 0 || (!!event.spotifyEmbedUrl && event.features.mediaEmbeds),
    lineup: event.lineup.filter((a) => a.name.trim()).length > 0,
    venue: !!event.venue.name,
    tour: event.features.multipleEvents && (event.tourDates?.length ?? 0) > 1,
    faq: event.faq.filter((f) => f.question.trim() && f.answer.trim()).length > 0,
  };
}

export function hasText(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
