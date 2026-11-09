import type { Metadata } from "next";
import type { EventConfig } from "@/types/event";
import { formatEventDate, hasText, isValidDate, toEventISO } from "./event-utils";
import { isTicketstoreUrl } from "./ticketstore";

export function buildMetadata(event: EventConfig): Metadata {
  const date = formatEventDate(event, "long");
  const place = [event.venue.name, event.venue.city].filter(Boolean).join(", ");
  const title = event.seo?.title ?? [event.eventName || event.artistName, date, place].filter(Boolean).join(" · ");
  const description =
    event.seo?.description ??
    `${event.eventName || event.artistName}${date ? ` — ${date}` : ""}${place ? `, ${place}` : ""}. Tickets via Ticketstore.ro.`;
  const canonical = event.seo?.canonicalUrl;
  // Absolute base for OG images: the canonical URL, else NEXT_PUBLIC_SITE_URL (set per deployment).
  const base = canonical ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const og = event.seo?.ogImage ?? event.heroImage ?? event.posterImage;

  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: event.isDemo ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      title,
      description,
      locale: event.locale === "ro" ? "ro_RO" : "en_GB",
      ...(canonical ? { url: canonical } : {}),
      ...(og ? { images: [{ url: og.src, width: og.width, height: og.height, alt: og.alt }] } : {}),
    },
    twitter: {
      card: og ? "summary_large_image" : "summary",
      title,
      description,
      ...(og ? { images: [og.src] } : {}),
    },
  };
}

const statusMap = {
  on_sale: "https://schema.org/EventScheduled",
  coming_soon: "https://schema.org/EventScheduled",
  sold_out: "https://schema.org/EventScheduled",
  ended: "https://schema.org/EventScheduled",
  cancelled: "https://schema.org/EventCancelled",
  postponed: "https://schema.org/EventPostponed",
} as const;

/**
 * schema.org Event structured data. Returned only when the essentials are
 * real and valid: never for demo content, never with invented offers.
 */
export function buildEventJsonLd(event: EventConfig): Record<string, unknown> | null {
  if (event.isDemo) return null;
  if (!hasText(event.artistName) || !isValidDate(event.date) || !hasText(event.venue.name)) return null;

  const startDate = toEventISO(event, event.startTime ?? event.doorsTime);
  const canonical = event.seo?.canonicalUrl;
  // schema.org wants absolute image URLs; without a canonical base, leave images out.
  const image = canonical
    ? [event.heroImage, event.posterImage].filter(Boolean).map((i) => new URL(i!.src, canonical).toString())
    : [];

  const offers: Record<string, unknown>[] = [];
  if (isTicketstoreUrl(event.ticketUrl) && event.status !== "ended" && event.status !== "cancelled") {
    const availability =
      event.status === "sold_out"
        ? "https://schema.org/SoldOut"
        : event.status === "coming_soon"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/InStock";
    offers.push({
      "@type": "Offer",
      url: event.ticketUrl,
      availability,
      ...(typeof event.priceFrom === "number" ? { price: event.priceFrom, priceCurrency: /^[A-Z]{3}$/.test(event.currency ?? "") ? event.currency : "RON" } : {}),
    });
  }

  const performerType = event.category === "theatre" || event.category === "comedy" ? "PerformingGroup" : "MusicGroup";
  const isMusic = ["concert", "dj", "festival"].includes(event.category);

  return {
    "@context": "https://schema.org",
    "@type": isMusic ? (event.category === "festival" ? "Festival" : "MusicEvent") : "Event",
    name: event.eventName || event.artistName,
    startDate,
    ...(event.endTime ? { endDate: toEventISO(event, event.endTime) } : {}),
    ...(event.doorsTime ? { doorTime: toEventISO(event, event.doorsTime) } : {}),
    eventStatus: statusMap[event.status],
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue.name,
      address: {
        "@type": "PostalAddress",
        ...(event.venue.address ? { streetAddress: event.venue.address } : {}),
        addressLocality: event.venue.city,
        ...(event.venue.country ? { addressCountry: event.venue.country } : {}),
      },
    },
    ...(image.length ? { image } : {}),
    ...(event.story?.body?.[0] ? { description: event.story.body[0] } : {}),
    performer: (event.lineup.length ? event.lineup : [{ name: event.artistName }]).map((a) => ({
      "@type": performerType,
      name: a.name,
    })),
    ...(event.organizer?.name
      ? { organizer: { "@type": "Organization", name: event.organizer.name, ...(event.organizer.website ? { url: event.organizer.website } : {}) } }
      : {}),
    ...(offers.length ? { offers } : {}),
  };
}
