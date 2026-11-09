import type { EventConfig, EventStatus } from "@/types/event";
import { getDictionary } from "./i18n";
import { formatPrice, hasText, isValidDate, isValidTime } from "./event-utils";

/** Hosts accepted as legitimate ticket destinations. */
const TICKETSTORE_HOSTS = ["ticketstore.ro"];

export function isTicketstoreUrl(url: string | undefined): url is string {
  if (!hasText(url)) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return TICKETSTORE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

/** Sentinel href used by presentation mode. TicketButton never navigates to it. */
export const PRESENTATION_HREF = "#presentation-ticket";

export type TicketPlacement = "hero" | "header" | "sticky" | "details" | "final" | "mobile_menu" | "lineup";

export interface TicketState {
  status: EventStatus;
  /** Real Ticketstore URL, or null when the CTA must not link anywhere. */
  href: string | null;
  label: string;
  /** Short line shown next to the CTA (price / state message). */
  meta: string | null;
  priceLabel: string | null;
  /** True when a purchase link is expected but not usable: a configuration problem. */
  misconfigured: boolean;
}

/**
 * Single source of truth for every purchase CTA on the page.
 * Status is manually supplied in the config: we never infer availability.
 */
export function getTicketState(event: EventConfig): TicketState {
  const t = getDictionary(event.locale);
  const presentation = event.ticketMode === "presentation";
  const validUrl = presentation ? PRESENTATION_HREF : isTicketstoreUrl(event.ticketUrl) ? event.ticketUrl : null;
  const price = formatPrice(event);
  const priceLabel = price ? `${t.cta.from} ${price}` : null;

  switch (event.status) {
    case "on_sale":
      return {
        status: "on_sale",
        href: validUrl,
        label: validUrl ? t.cta.buy : t.cta.linkPending,
        meta: event.availabilityNote ?? priceLabel,
        priceLabel,
        misconfigured: !validUrl,
      };
    case "coming_soon":
      return { status: "coming_soon", href: null, label: t.cta.comingSoon, meta: event.statusNote ?? null, priceLabel, misconfigured: false };
    case "sold_out":
      return { status: "sold_out", href: null, label: t.cta.soldOut, meta: event.statusNote ?? null, priceLabel: null, misconfigured: false };
    case "cancelled":
      return { status: "cancelled", href: null, label: t.cta.cancelled, meta: event.statusNote ?? null, priceLabel: null, misconfigured: false };
    case "postponed":
      // Existing ticket holders usually still need the event page (new date, refunds).
      return {
        status: "postponed",
        href: validUrl,
        label: validUrl ? t.cta.postponedLink : t.cta.postponed,
        meta: event.statusNote ?? t.cta.postponed,
        priceLabel: null,
        misconfigured: false,
      };
    case "ended":
    default:
      return { status: "ended", href: null, label: t.cta.ended, meta: null, priceLabel: null, misconfigured: false };
  }
}

export interface ConfigIssue {
  level: "error" | "warning";
  field: string;
  message: string;
}

/** Validates an event config. Issues are surfaced in development only. */
export function validateEvent(event: EventConfig): ConfigIssue[] {
  const issues: ConfigIssue[] = [];
  const push = (level: ConfigIssue["level"], field: string, message: string) => issues.push({ level, field, message });

  if (!hasText(event.artistName)) push("error", "artistName", "Artist / event name is required.");
  if (!isValidDate(event.date)) push("error", "date", "Date must be a valid YYYY-MM-DD string.");
  if (!hasText(event.venue?.name)) push("error", "venue.name", "Venue name is required.");
  if (!hasText(event.venue?.city)) push("warning", "venue.city", "City is missing.");
  try {
    new Intl.DateTimeFormat("en", { timeZone: event.timezone });
  } catch {
    push("error", "timezone", `Unknown IANA time zone "${event.timezone}".`);
  }
  for (const key of ["doorsTime", "startTime", "endTime"] as const) {
    const v = event[key];
    if (v !== undefined && !isValidTime(v)) push("warning", key, `${key} must be "HH:mm".`);
  }

  if (event.ticketMode === "presentation") {
    if (!event.isDemo) push("warning", "ticketMode", "Presentation mode: ticket buttons go nowhere. Switch to \"live\" before publishing a real event.");
  } else if (!hasText(event.ticketUrl)) {
    if (event.status === "on_sale" || event.status === "postponed")
      push("error", "ticketUrl", "ticketUrl is empty. Purchase CTAs are disabled until Ticketstore supplies the event link.");
  } else if (!isTicketstoreUrl(event.ticketUrl)) {
    push("error", "ticketUrl", "ticketUrl must be an https:// link on ticketstore.ro. CTAs are disabled.");
  }
  event.tourDates?.forEach((d, i) => {
    if (!isTicketstoreUrl(d.ticketUrl)) push("error", `tourDates[${i}].ticketUrl`, "Tour date URL must be an https:// ticketstore.ro link; the row is hidden.");
  });
  event.tickets?.forEach((p, i) => {
    if (!isTicketstoreUrl(p.url)) push("error", `tickets[${i}].url`, "Ticket product URL must be an https:// ticketstore.ro link.");
  });

  if (event.priceFrom !== undefined && (typeof event.priceFrom !== "number" || event.priceFrom < 0))
    push("warning", "priceFrom", "priceFrom must be a positive number; it is hidden otherwise.");

  if (!event.heroImage && !event.posterImage)
    push("warning", "heroImage", "No hero or poster image. The hero renders as a typographic poster.");
  if (event.heroVideo && !event.features.videoHero)
    push("warning", "heroVideo", "heroVideo is set but features.videoHero is off (premium). The image is used.");
  if (event.customColors && !event.features.customColors)
    push("warning", "customColors", "customColors is set but features.customColors is off (premium).");
  if (event.customFont && !event.features.customFonts)
    push("warning", "customFont", "customFont is set but features.customFonts is off (premium).");
  if (event.features.newsletter && !event.newsletter?.actionUrl)
    push("warning", "newsletter", "features.newsletter is on but no newsletter.actionUrl is configured; the form is hidden.");
  if (event.features.analytics && !event.analytics?.ga4MeasurementId)
    push("warning", "analytics", "features.analytics is on but no provider id is configured; only dataLayer events are emitted.");

  const images = [
    event.heroImage,
    event.heroMobileImage,
    event.posterImage,
    event.story?.image,
    event.venue.image,
    event.finalCta?.image,
    ...event.gallery.map((g) => (g.type === "image" ? g.image : g.poster)),
    ...event.lineup.map((a) => a.image),
  ];
  images.forEach((img) => {
    if (img && typeof img.alt !== "string") push("warning", img.src, "Image needs alt text, or alt: \"\" if decorative.");
  });

  if (!event.seo?.canonicalUrl) push("warning", "seo.canonicalUrl", "No canonical URL: canonical tag, sitemap host and absolute OG URLs are omitted.");

  return issues;
}
