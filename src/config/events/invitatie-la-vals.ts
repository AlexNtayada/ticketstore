import type { EventConfig } from "@/types/event";
import { FREE_FEATURES } from "../features";

/**
 * Real event content taken from the organizer's Ticketstore minisite
 * (minisites/dist/56, "Stagiunea Dalles · Luceafărul"), 6 Nov 2026.
 *
 * IMAGES ARE TEMPORARY: /public/images/invitatie-la-vals/* are free stock
 * photos from Pexels (pexels.com, free licence), not photos of this show.
 * Replace them with the organizer's poster and production photos.
 */
const TICKET_URL =
  "https://ticketstore.ro/ro/bilete/11828/invitaie-la-vals-feerie-de-bal-n-pai-de-dans?utm_source=minisite&utm_medium=organizer&utm_campaign=56&e=11828";

const img = (file: string, alt: string, width: number, height: number, caption?: string) => ({
  src: `/images/invitatie-la-vals/${file}`,
  alt,
  width,
  height,
  ...(caption ? { caption } : {}),
});

export const event: EventConfig = {
  id: "invitatie-la-vals-bucuresti-2026-11-06",
  isDemo: false,
  locale: "ro",
  category: "concert",

  artistName: "Invitație la vals",
  eventName: "Invitație la vals — Feerie de bal în pași de dans",
  kicker: "Stagiunea Musical Extravaganza",
  tagline: "Feerie de bal în pași de dans",

  date: "2026-11-06",
  startTime: "19:00",
  timezone: "Europe/Bucharest",

  venue: {
    name: "Teatrul Constantin Tănase · Sala Savoy",
    address: "Calea Victoriei Nr. 33",
    city: "București",
    country: "România",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Teatrul%20Constantin%20T%C4%83nase%20-%20Sala%20Savoy%2C%20Calea%20Victoriei%20Nr.33%2C%20Bucure%C8%99ti",
  },
  ageRestriction: "3+",

  priceFrom: 99,
  currency: "lei",
  ticketUrl: TICKET_URL,
  ticketLinkTarget: "_self",
  ticketMode: "live",
  tickets: [
    { label: "VIP", price: 299, url: TICKET_URL },
    { label: "Categoria 1", price: 179, url: TICKET_URL },
    { label: "Categoria 2", price: 149, url: TICKET_URL },
    { label: "Categoria 3", price: 129, url: TICKET_URL },
    { label: "Reducere", price: 99, url: TICKET_URL, note: "Elevi, studenți, pensionari, profesori însoțitori" },
  ],
  status: "on_sale",

  statement: ["O seară", "de eleganță,", "la vals."],

  story: {
    headline: ["Kálmán.", "Lehár.", "Strauss."],
    body: [
      "Gazda serii, tenorul Ştefan von Korch, solist și coordonator artistic al stagiunii Musical Extravaganza, și soprana Elina Velica vă invită la vals.",
      "Pe program: arii și duete din Kálmán, Lehár, Strauss și Șostakovici.",
    ],
    image: img("story.jpg", "Pereche dansând vals în costume de bal", 1400, 2097),
  },

  heroImage: { ...img("hero.jpg", "Pereche în costume de bal dansând vals pe o scenă întunecată", 3200, 1800), focus: "75% 50%" },
  heroMobileImage: { ...img("hero-mobile.jpg", "Pereche în costume de bal dansând vals", 1400, 2097), focus: "50% 30%" },
  heroVideo: null,

  gallery: [
    { type: "image", image: img("gallery-01.jpg", "Pereche dansând vals într-o sală de bal", 2400, 1600, "Foto: Pexels") },
    { type: "image", image: img("gallery-02.jpg", "Pereche de dansatori de bal pe ringul de dans", 1600, 900, "Foto: Pexels") },
    { type: "image", image: img("gallery-03.jpg", "Orchestră și cor pe scenă", 1800, 1200, "Foto: Pexels") },
  ],

  lineup: [
    { name: "Ştefan von Korch", tier: "headliner", role: "Tenor · gazda serii" },
    { name: "Elina Velica", tier: "headliner", role: "Soprană" },
  ],

  tourDates: [
    { date: "2026-11-06", time: "19:00", city: "București", venue: "Teatrul Constantin Tănase · Sala Savoy", priceFrom: 99, ticketUrl: TICKET_URL },
    {
      date: "2026-11-08",
      time: "19:00",
      city: "Sibiu",
      venue: "Filarmonica de Stat · Sala Thalia",
      priceFrom: 79,
      ticketUrl:
        "https://ticketstore.ro/ro/bilete/12089/invitaie-la-vals-feerie-de-bal-n-pai-de-dans-sibiu?utm_source=minisite&utm_medium=organizer&utm_campaign=56&e=12089",
    },
    {
      date: "2026-11-22",
      time: "19:00",
      city: "Ploiești",
      venue: "Filarmonica Paul Constantinescu",
      priceFrom: 79,
      ticketUrl:
        "https://ticketstore.ro/ro/bilete/12114/invitaie-la-vals-feerie-de-bal-n-pai-de-dans-ploiesti?utm_source=minisite&utm_medium=organizer&utm_campaign=56&e=12114",
    },
  ],

  faq: [
    { question: "Care este vârsta minimă?", answer: "Spectacolul este recomandat pentru vârsta 3+." },
    { question: "Cum îmi aleg locul?", answer: "Alegi locurile și plătești direct pe Ticketstore.ro, după ce apeși „Cumpără bilete”." },
  ],

  finalCta: {
    headline: ["Vă invităm", "la vals."],
    image: img("final.jpg", "", 1800, 1200),
  },

  socialLinks: {},

  seo: {
    title: "Invitație la vals · 6 noiembrie 2026 · Sala Savoy, București",
    description:
      "Feerie de bal în pași de dans cu tenorul Ştefan von Korch și soprana Elina Velica. Teatrul Constantin Tănase, Sala Savoy. Bilete de la 99 lei pe Ticketstore.ro.",
    ogImage: img("og.jpg", "Invitație la vals", 1200, 630),
  },

  theme: "sky",
  displayFont: "poppins",

  features: {
    ...FREE_FEATURES,
    advancedMotion: true,
    advancedGallery: true,
    advancedLineup: true,
    countdown: true,
    multipleEvents: true,
  },
};
