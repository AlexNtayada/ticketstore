import type { EventConfig } from "@/types/event";
import { FREE_FEATURES } from "../features";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DEMO CONTENT — FICTIONAL EVENT
 *  "NIGHTWAVE" is a made-up artist used to preview the template. The copy,
 *  lineup, prices and FAQ answers below are placeholders, and the images in
 *  /public/images/demo are procedurally generated stand-ins, not photographs.
 *
 *  ticketUrl is intentionally empty: real Ticketstore.ro event links must be
 *  supplied by Ticketstore or the organizer. With it empty, every purchase
 *  CTA renders disabled and a configuration warning appears in development.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const event: EventConfig = {
  id: "nightwave-2026",
  isDemo: true,
  locale: "en",
  category: "concert",

  artistName: "NIGHTWAVE",
  eventName: "NIGHTWAVE LIVE",
  kicker: "Live in Bucharest",
  tagline: "One night. No repeat.",

  date: "2026-12-14",
  doorsTime: "19:00",
  startTime: "20:30",
  timezone: "Europe/Bucharest",

  venue: {
    name: "Arenele Romane",
    address: "Parcul Carol I",
    city: "Bucharest",
    country: "Romania",
    transport: [
      "[Demo] Transport notes supplied by the organizer appear here.",
      "[Demo] Add parking, public transport and accessibility details.",
    ],
    image: {
      src: "/images/demo/venue.jpg",
      alt: "Demo placeholder: illuminated arches of a venue facade at night",
      width: 2000,
      height: 1250,
    },
  },
  ageRestriction: "16+",

  priceFrom: 149,
  currency: "RON",
  // Supplied by Ticketstore / the organizer. Can also be injected per deployment
  // with NEXT_PUBLIC_TICKET_URL (must be an https://…ticketstore.ro link).
  ticketUrl: process.env.NEXT_PUBLIC_TICKET_URL ?? "",
  ticketLinkTarget: "_self",
  // Demo/pitch: buttons are active but go nowhere. Set "live" with a real ticketUrl for an event.
  ticketMode: process.env.NEXT_PUBLIC_TICKET_URL ? "live" : "presentation",
  status: "on_sale",

  statement: ["One night.", "One stage.", "No repeat."],

  story: {
    headline: ["The sound.", "The energy.", "The moment."],
    body: [
      "[Demo copy] This is where the organizer introduces the artist or the event in their own words: where the project comes from, what the live show feels like, and why this night matters.",
      "[Demo copy] Keep it to two short paragraphs. The photography carries the rest.",
    ],
    image: {
      src: "/images/demo/story.jpg",
      alt: "Demo placeholder: crowd silhouettes under warm stage light",
      width: 1200,
      height: 1600,
    },
  },

  heroImage: {
    src: "/images/demo/hero.jpg",
    alt: "Demo placeholder: stage lights cutting through haze above a crowd",
    width: 2400,
    height: 1500,
    focus: "50% 40%",
  },
  heroMobileImage: {
    src: "/images/demo/hero-mobile.jpg",
    alt: "Demo placeholder: stage lights cutting through haze above a crowd",
    width: 1080,
    height: 1620,
    focus: "50% 40%",
  },
  heroVideo: null,

  gallery: [
    {
      type: "image",
      image: {
        src: "/images/demo/gallery-01.jpg",
        alt: "Demo placeholder: blue stage beams over the audience",
        width: 2400,
        height: 1200,
        caption: "Demo image 01",
      },
    },
    {
      type: "image",
      image: {
        src: "/images/demo/gallery-02.jpg",
        alt: "Demo placeholder: red light beams crossing above the stage",
        width: 1200,
        height: 1600,
        caption: "Demo image 02",
      },
    },
    {
      type: "image",
      image: {
        src: "/images/demo/gallery-03.jpg",
        alt: "Demo placeholder: lime green beams over raised hands",
        width: 1600,
        height: 1067,
        caption: "Demo image 03",
      },
    },
    {
      type: "image",
      image: {
        src: "/images/demo/gallery-04.jpg",
        alt: "Demo placeholder: black and white concert lighting",
        width: 1200,
        height: 1500,
        caption: "Demo image 04",
      },
    },
    {
      type: "image",
      image: {
        src: "/images/demo/gallery-05.jpg",
        alt: "Demo placeholder: pink haze above the crowd",
        width: 1600,
        height: 1067,
        caption: "Demo image 05",
      },
    },
  ],

  lineup: [
    { name: "Nightwave", tier: "headliner", setTime: "21:30" },
    { name: "Klang", tier: "support", setTime: "20:30" },
    { name: "Mira", tier: "support", setTime: "19:45" },
    { name: "Noir", tier: "guest" },
  ],

  faq: [
    {
      question: "What time do doors open?",
      answer: "[Demo answer] Doors open at 19:00. The first act starts at 19:45.",
    },
    {
      question: "Are there age restrictions?",
      answer: "[Demo answer] This is a 16+ event. Under-18s must be accompanied by an adult.",
    },
    {
      question: "Can I transfer my ticket?",
      answer: "[Demo answer] Replace this with the organizer's verified transfer policy.",
    },
  ],

  finalCta: {
    headline: ["See you", "in the crowd."],
    image: {
      src: "/images/demo/final.jpg",
      alt: "",
      width: 2400,
      height: 1400,
    },
  },

  socialLinks: {
    instagram: "",
    facebook: "",
    youtube: "",
    spotify: "",
    tiktok: "",
  },

  organizer: {
    name: "Demo Organizer SRL (fictional)",
    email: "",
  },
  legal: {
    privacyUrl: "",
    termsUrl: "",
  },

  seo: {
    title: "NIGHTWAVE — Live in Bucharest · 14 December 2026",
    description:
      "Demo microsite for a fictional concert. NIGHTWAVE live at Arenele Romane, Bucharest. Tickets via Ticketstore.ro.",
    ogImage: {
      src: "/images/demo/og.jpg",
      alt: "NIGHTWAVE live in Bucharest — demo",
      width: 1200,
      height: 630,
    },
  },

  theme: "midnight",
  displayFont: "anton",

  features: {
    ...FREE_FEATURES,
    // The demo previews a few premium layers. Switch any of them off and the
    // page falls back to the free experience without breaking.
    advancedMotion: true,
    advancedGallery: true,
    advancedLineup: true,
    countdown: true,
  },
};
