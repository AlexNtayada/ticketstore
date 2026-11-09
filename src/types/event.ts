/**
 * Event data model for the Digital Event Poster template.
 *
 * Everything a page renders comes from an `EventConfig`. Components never
 * hardcode artist-specific content: swap the config, get a different event.
 */

export type EventStatus =
  | "on_sale"
  | "coming_soon"
  | "sold_out"
  | "cancelled"
  | "postponed"
  | "ended";

export type EventCategory =
  | "concert"
  | "dj"
  | "festival"
  | "comedy"
  | "theatre"
  | "cultural"
  | "performance";

export type Locale = "en" | "ro";

export type ThemeName =
  | "midnight"
  | "ember"
  | "paper"
  | "burgundy"
  | "neon"
  | "organizer"
  | "sky";

export type DisplayFontName =
  | "anton"
  | "bebas"
  | "archivo-black"
  | "barlow-condensed"
  | "space-grotesk"
  | "bodoni"
  | "poppins";

/**
 * An image. `alt` is required on purpose: pass a description, or the empty
 * string "" to mark the image as decorative.
 */
export interface MediaImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional focal point used for object-position, e.g. "50% 30%". */
  focus?: string;
  caption?: string;
  credit?: string;
}

export interface GalleryImageItem {
  type: "image";
  image: MediaImage;
}

export interface GalleryVideoItem {
  type: "video";
  /** Self-hosted MP4/WebM. Never autoplays; loads on demand. */
  src: string;
  poster: MediaImage;
  title: string;
}

export interface GalleryEmbedItem {
  type: "embed";
  provider: "youtube" | "vimeo";
  /** The provider's video id, as supplied by the organizer. */
  videoId: string;
  title: string;
  poster?: MediaImage;
}

export type GalleryItem = GalleryImageItem | GalleryVideoItem | GalleryEmbedItem;

export interface LineupArtist {
  name: string;
  tier: "headliner" | "support" | "guest";
  /** Optional role shown instead of the tier label, e.g. "Tenor". */
  role?: string;
  /** Optional stage time, "HH:mm" local to the event time zone. */
  setTime?: string;
  image?: MediaImage;
}

export interface FAQItem {
  question: string;
  /** Only questions with a verified answer are rendered. */
  answer: string;
}

export interface Venue {
  name: string;
  address?: string;
  city: string;
  country?: string;
  /** Free text supplied by the organizer: metro, parking, accessibility. */
  transport?: string[];
  /** External navigation link. Falls back to a Google Maps search of the address. */
  mapUrl?: string;
  /** Optional iframe map URL; loaded only on user request. */
  mapEmbedUrl?: string;
  image?: MediaImage;
}

export interface TicketProduct {
  label: string;
  price?: number;
  url: string;
  note?: string;
}

/** Another date of the same show (tour). Each needs its own real Ticketstore URL. */
export interface TourDate {
  date: string;
  time?: string;
  city: string;
  venue: string;
  priceFrom?: number;
  ticketUrl: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  spotify?: string;
  tiktok?: string;
  website?: string;
}

export interface Organizer {
  name: string;
  /** Legal entity name / registration details, where required. */
  legalName?: string;
  registration?: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface FeatureFlags {
  videoHero: boolean;
  advancedMotion: boolean;
  customFonts: boolean;
  customColors: boolean;
  customDomain: boolean;
  advancedGallery: boolean;
  mediaEmbeds: boolean;
  advancedLineup: boolean;
  newsletter: boolean;
  analytics: boolean;
  countdown: boolean;
  multipleEvents: boolean;
  removeTicketstoreBranding: boolean;
}

export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentForeground: string;
  border: string;
  /** Used by contrast sections (e.g. the statement). */
  inverseBackground: string;
  inverseText: string;
}

export interface EventConfig {
  id: string;
  /** When true the page shows a "fictional demo" notice and skips structured data. */
  isDemo?: boolean;
  locale: Locale;
  category: EventCategory;

  artistName: string;
  eventName: string;
  /** Optional wordmark replacing the text logo in the header/footer. */
  logo?: MediaImage;
  /** Short hero kicker, e.g. "LIVE IN BUCHAREST". */
  kicker?: string;
  tagline?: string;

  /** Local calendar date, "YYYY-MM-DD", in `timezone`. */
  date: string;
  doorsTime?: string;
  startTime?: string;
  endTime?: string;
  timezone: string;

  venue: Venue;
  ageRestriction?: string;

  priceFrom?: number;
  currency?: string;
  /** Canonical Ticketstore.ro event URL. Supplied by Ticketstore or the organizer. */
  ticketUrl: string;
  /** Optional multiple ticket products; otherwise every CTA uses `ticketUrl`. */
  tickets?: TicketProduct[];
  ticketLinkTarget?: "_self" | "_blank";
  /**
   * "presentation": CTAs look and behave as active but go nowhere (a short note
   * explains it). For pitching the template before a real link exists.
   * Never use it on a live event page.
   */
  ticketMode?: "live" | "presentation";
  /** Manually supplied; never inferred. */
  status: EventStatus;
  /** Shown with postponed/cancelled states, e.g. refund guidance. */
  statusNote?: string;
  /** Optional manually supplied availability hint, e.g. "Last tickets". */
  availabilityNote?: string;

  /** Statement lines, rendered as one oversized typographic composition. */
  statement?: string[];

  story?: {
    headline: string[];
    body: string[];
    image?: MediaImage;
  };

  heroImage?: MediaImage;
  heroMobileImage?: MediaImage;
  /** Requires features.videoHero. Desktop only; mobile keeps the poster image. */
  heroVideo?: { src: string; type?: string } | null;
  /** Fallback poster (e.g. the original event artwork) for minimal configs. */
  posterImage?: MediaImage;

  gallery: GalleryItem[];
  /** Spotify embed URL, e.g. https://open.spotify.com/embed/artist/... Requires features.mediaEmbeds. */
  spotifyEmbedUrl?: string;

  lineup: LineupArtist[];
  /** Requires features.multipleEvents. */
  tourDates?: TourDate[];
  faq: FAQItem[];

  finalCta?: {
    headline: string[];
    image?: MediaImage;
  };

  socialLinks: SocialLinks;
  organizer?: Organizer;
  legal?: {
    privacyUrl?: string;
    termsUrl?: string;
  };

  newsletter?: {
    /** Endpoint of a real newsletter provider form. Without it the block does not render. */
    actionUrl: string;
    method?: "post" | "get";
    emailFieldName?: string;
    consentText: string;
  };

  analytics?: {
    /** GA4 measurement id. Loaded only when features.analytics and consent are both true. */
    ga4MeasurementId?: string;
  };

  seo?: {
    title?: string;
    description?: string;
    /** Absolute canonical URL of this microsite, e.g. https://nightwave.ticketstore.site */
    canonicalUrl?: string;
    ogImage?: MediaImage;
  };

  theme: ThemeName;
  displayFont: DisplayFontName;
  /** Requires features.customColors. Partial token overrides on top of `theme`. */
  customColors?: Partial<ThemeTokens>;
  /** Requires features.customFonts. Self-hosted file in /public/fonts, licensed for web use. */
  customFont?: { family: string; src: string; format: "woff2" | "woff"; charWidth?: number };

  features: FeatureFlags;
}
