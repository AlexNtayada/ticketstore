import type { MediaImage } from "./event";

/** Organizer minisite: one client, many events. Everything on the page comes from this config. */
export type ShowCategory = "teatru" | "concerte" | "copii";

export interface OrgEvent {
  /** Ticketstore event id, used as React key and analytics id. */
  id: string;
  /** Slug of the show in `catalogue`, links dates to repertoire/catalogue entries. */
  show: string;
  title: string;
  category: ShowCategory;
  /** "YYYY-MM-DD", local to the organizer's time zone. */
  date: string;
  /** "HH:mm" */
  time: string;
  city: string;
  venue: string;
  /** Lowest ticket price; omit when unknown (never invent one). */
  priceFrom?: number;
  /** Must be an https *.ticketstore.ro URL; anything else renders as inert text. */
  ticketUrl: string;
}

export interface OrgShow {
  slug: string;
  title: string;
  subtitle?: string;
  category: ShowCategory;
  /** Portrait poster from the organizer's own site; omit when there is none. */
  poster?: string;
}

export interface RepertoireItem {
  show: string;
  title: string;
  description: string;
  image?: MediaImage;
}

export interface OrgVenue {
  name: string;
  address: string;
  image?: MediaImage;
  /** Shown under the photo, e.g. "Foto ilustrativă · Pexels". */
  imageCredit?: string;
}

/** A show played in a season. `date`/`time`/`venue` only when published by the organizer. */
export interface SeasonShow {
  show: string;
  title: string;
  poster?: string;
  date?: string;
  time?: string;
  venue?: string;
  note?: string;
}

export interface OrgSeason {
  id: string;
  label: string;
  /** Short label for the year toggle, e.g. "2026–27". */
  short: string;
  shows: SeasonShow[];
}

export interface OrganizerConfig {
  name: string;
  description: string;
  locale: "ro";
  timezone: string;
  /** Shown after prices, e.g. "lei". */
  currencyLabel: string;
  /** "live" links to Ticketstore; "presentation" keeps every ticket button inert. */
  ticketMode: "live" | "presentation";
  featured: {
    /** Show slug; the hero shows its next upcoming date. */
    show: string;
    subtitle: string;
    image: MediaImage;
    mobileImage?: MediaImage;
  };
  calendar: { title: string; windowDays: number };
  events: OrgEvent[];
  venues: OrgVenue[];
  repertoire: RepertoireItem[];
  catalogue: OrgShow[];
  seasons: OrgSeason[];
  subscription?: { title: string; body: string; note: string };
  newsletter?: { title: string; body: string; demoNote: string };
  footerNote: string;
}
