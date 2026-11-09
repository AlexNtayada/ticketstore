import type { MediaImage } from "./event";

/**
 * Touring company minisite (one company, many shows, many cities).
 * Everything on the page comes from this config.
 */
export type CompanyCategory = "teatru" | "concerte";

export interface CompanyEvent {
  /** Ticketstore event id (or a local id when there is no Ticketstore page). */
  id: string;
  /** Slug of the show in `shows`. */
  show: string;
  title: string;
  /** "YYYY-MM-DD", local to the company's time zone. */
  date: string;
  /** "HH:mm" */
  time: string;
  city: string;
  venue: string;
  /** Lowest ticket price; omit when unknown (never invent one). */
  priceFrom?: number;
  /** https *.ticketstore.ro URL. Omit when tickets are sold elsewhere or sold out. */
  ticketUrl?: string;
  /** "other": tickets through another channel; "soldout": no tickets left. */
  status?: "other" | "soldout";
}

export interface CompanyShow {
  slug: string;
  title: string;
  category: CompanyCategory;
  /** Author / director line, e.g. "de I.L. Caragiale · regia Alexandru Nagy". */
  credit?: string;
  /** Portrait poster from the company's own site. */
  poster?: string;
  /** Landscape photo from the company's own site. */
  photo?: MediaImage;
}

export interface CompanyPerson {
  name: string;
  role: string;
  photo: string;
}

export interface PressQuote {
  quote: string;
  source: string;
  note?: string;
  href: string;
}

export interface PastShow {
  date: string;
  title: string;
  city: string;
}

export interface CompanyConfig {
  name: string;
  /** Shorter name for the header. */
  shortName?: string;
  tagline: string;
  /** Brand colour replacing the theme accent, and a lighter tint for use on dark backgrounds. */
  accent?: { color: string; light: string };
  description: string;
  timezone: string;
  currencyLabel: string;
  ticketMode: "live" | "presentation";
  hero: { image: MediaImage; mobileImage?: MediaImage };
  /** Upcoming dates. */
  events: CompanyEvent[];
  /** Earlier performances, newest first (from the company's calendar). */
  past: PastShow[];
  shows: CompanyShow[];
  about: { intro: string; people: CompanyPerson[]; ensemble: string[] };
  /** "Pe scenă acum": show slug + one-line pitch. */
  spotlight: { show: string; pitch: string; image: MediaImage }[];
  press: PressQuote[];
  gallery: { images: MediaImage[]; credit: string };
  alert: { title: string; body: string; demoNote: string };
  socials: { label: string; href: string }[];
  footerNote: string;
}
