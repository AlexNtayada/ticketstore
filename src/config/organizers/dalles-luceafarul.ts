import type { OrganizerConfig, OrgSeason, OrgShow, ShowCategory } from "@/types/organizer";

/**
 * Real content from the organizer's Ticketstore minisite
 * (minisites/dist/56, "Stagiunea Dalles · Luceafărul"), read 9 Nov 2026.
 * Show posters and cards come from that site (public/images/dalles/shows).
 * Hero and venue photos are free Pexels stock images, not production photos.
 */
const utm = (id: string) => `utm_source=minisite&utm_medium=organizer&utm_campaign=56&e=${id}`;
const ts = (id: string, slug: string) => `https://ticketstore.ro/ro/bilete/${id}/${slug}?${utm(id)}`;

/** Shows without a usable poster on the source site. */
const NO_POSTER = new Set(["seara-mare-la-palat"]);
const poster = (slug: string) => (NO_POSTER.has(slug) ? undefined : `/images/dalles/shows/${slug}-poster.webp`);

const shows = (category: ShowCategory, items: [string, string, string?][]): OrgShow[] =>
  items.map(([slug, title, subtitle]) => ({ slug, title, category, poster: poster(slug), ...(subtitle ? { subtitle } : {}) }));

const card = (slug: string, title: string) => ({
  src: `/images/dalles/shows/${slug}-card.webp`,
  alt: `Afișul spectacolului ${title}`,
  width: 1200,
  height: 675,
});

/** Season line-ups as listed on the source site's "Stagiuni" page. Dates only where the organizer published them. */
const season = (id: string, label: string, short: string, items: [string, string, Partial<OrgSeason["shows"][number]>?][]): OrgSeason => ({
  id,
  label,
  short,
  shows: items.map(([show, title, extra]) => ({ show, title, poster: poster(show), ...extra })),
});

export const organizer: OrganizerConfig = {
  name: "Stagiunea Dalles · Luceafărul",
  description: "Comedii și concerte în București, la Sala Dalles și Sala Luceafărul, și pe scene din toată țara.",
  locale: "ro",
  timezone: "Europe/Bucharest",
  currencyLabel: "lei",
  ticketMode: "live",

  featured: {
    show: "invitatie-la-vals",
    subtitle: "Feerie de bal în pași de dans",
    image: {
      src: "/images/invitatie-la-vals/hero.jpg",
      alt: "Pereche în costume de bal dansând vals pe o scenă întunecată",
      width: 3200,
      height: 1800,
      focus: "72% 50%",
    },
    mobileImage: {
      src: "/images/invitatie-la-vals/hero-mobile.jpg",
      alt: "Pereche în costume de bal dansând vals",
      width: 1400,
      height: 2097,
      focus: "50% 25%",
    },
  },

  calendar: { title: "În următoarele 30 zile", windowDays: 30 },

  events: [
    { id: "11828", show: "invitatie-la-vals", title: "Invitație la vals", category: "concerte", date: "2026-11-06", time: "19:00", city: "București", venue: "Teatrul Constantin Tănase - Sala Savoy", priceFrom: 99, ticketUrl: ts("11828", "invitaie-la-vals-feerie-de-bal-n-pai-de-dans") },
    { id: "12089", show: "invitatie-la-vals", title: "Invitație la vals", category: "concerte", date: "2026-11-08", time: "19:00", city: "Sibiu", venue: "Filarmonica de Stat - Sala Thalia", priceFrom: 79, ticketUrl: ts("12089", "invitaie-la-vals-feerie-de-bal-n-pai-de-dans-sibiu") },
    { id: "12421", show: "morti-dupa-bani", title: "Morți după bani", category: "teatru", date: "2026-11-19", time: "19:30", city: "București", venue: "Sala Luceafărul", priceFrom: 135, ticketUrl: ts("12421", "morti-dupa-bani-bucureti") },
    { id: "12114", show: "invitatie-la-vals", title: "Invitație la vals", category: "concerte", date: "2026-11-22", time: "19:00", city: "Ploiești", venue: "Filarmonica Paul Constantinescu", priceFrom: 79, ticketUrl: ts("12114", "invitaie-la-vals-feerie-de-bal-n-pai-de-dans-ploiesti") },
    { id: "12385", show: "morti-dupa-bani", title: "Morți după bani", category: "teatru", date: "2026-11-23", time: "19:00", city: "Călărași", venue: "Centrul Județean de Cultură și Creație Călărași - Sala", priceFrom: 80, ticketUrl: ts("12385", "morti-dupa-bani-calarasi") },
    { id: "12384", show: "nevasta-de-ocazie", title: "Nevastă de ocazie", category: "teatru", date: "2026-11-24", time: "19:00", city: "Focșani", venue: 'Teatrul Municipal "Maior Gh. Pastia"', priceFrom: 130, ticketUrl: ts("12384", "comedie-nevasta-de-ocazie-focsani") },
    { id: "12093", show: "zaraza", title: "Zaraza", category: "concerte", date: "2026-11-25", time: "19:00", city: "București", venue: "Sala Dalles", priceFrom: 39, ticketUrl: ts("12093", "zaraza-comori-ale-muzicii-romanesti-cu-tenorul-stefan-von-korch-si-invitatii-mutat-tanase") },
    { id: "11838", show: "zaraza", title: "Zaraza", category: "concerte", date: "2026-11-27", time: "19:00", city: "București", venue: "Teatrul Constantin Tănase - Sala Savoy", priceFrom: 59, ticketUrl: ts("11838", "zaraza-comori-ale-muzicii-romanesti-cu-tenorul-stefan-von-korch-si-invitatii") },
    { id: "12383", show: "aventuri-pe-contrasens", title: "Aventuri pe contrasens", category: "teatru", date: "2026-11-30", time: "19:00", city: "Giurgiu", venue: "Teatrul Tudor Vianu", priceFrom: 130, ticketUrl: ts("12383", "aventuri-pe-contrasens-giurgiu") },
    // Slug spelled "contrasesns" on Ticketstore; kept verbatim so the link works.
    { id: "12683", show: "aventuri-pe-contrasens", title: "Aventuri pe contrasens", category: "teatru", date: "2026-12-05", time: "19:00", city: "Câmpina", venue: "Casa de Cultură Geo Bogza", priceFrom: 130, ticketUrl: ts("12683", "aventuri-pe-contrasesns-campina") },
  ],

  venues: [
    {
      name: "Sala Dalles",
      address: "Bld. Nicolae Balcescu 18, București",
      image: { src: "/images/dalles/sala-dalles.jpg", alt: "Sală de spectacol cu scaune roșii, văzută de pe scenă", width: 1600, height: 1065 },
      imageCredit: "Foto ilustrativă · Pexels",
    },
    {
      name: "Sala Luceafărul",
      address: "Strada Ion Ghica Nr.3, București",
      image: { src: "/images/dalles/sala-luceafarul.jpg", alt: "Sală de teatru cu balcoane și scaune portocalii", width: 1600, height: 1068 },
      imageCredit: "Foto ilustrativă · Pexels",
    },
  ],

  repertoire: [
    {
      show: "morti-dupa-bani",
      title: "Morți după bani",
      description: "Atenție, iubitori de comedie, vi se pregătește ceva!!!",
      image: card("morti-dupa-bani", "Morți după bani"),
    },
    {
      show: "nevasta-de-ocazie",
      title: "Nevastă de ocazie",
      description: "O comedie nou-nouță, cu scopul unic de a smulge hohote de râs.",
      image: card("nevasta-de-ocazie", "Nevastă de ocazie"),
    },
    {
      show: "invitatie-la-vals",
      title: "Invitație la vals",
      description: "În seara de 22 noiembrie, în stagiunea Musical Extravaganza, luminile se vor aprinde peste eleganța…",
      image: card("invitatie-la-vals", "Invitație la vals"),
    },
  ],

  catalogue: [
    ...shows("teatru", [
      ["aventuri-pe-contrasens", "Aventuri pe contrasens"],
      ["o-noapte-furtunoasa", "O noapte furtunoasă", "de I.L. Caragiale"],
      ["o-scrisoare-pierduta", "O scrisoare pierdută", "de I.L. Caragiale"],
      ["prins-in-plasa", "Prins în… plasă", "regia Dan Tudor"],
      ["d-ale-carnavalului", "D'ale carnavalului", "de I.L. Caragiale"],
      ["ispita-pentru-sotul-meu", "Ispită pentru soțul meu"],
      ["mofturi-si-moftangii", "Mofturi și moftangii"],
      ["amanta-noastra-de-la-minister", "Amanta noastră de la minister"],
      ["punem-petale-inapoi-florilor", "Punem petale înapoi florilor"],
      ["ma-mut-la-mama", "Mă mut la mama"],
    ]),
    ...shows("concerte", [
      ["iubesc-femeia", "Iubesc femeia", "Povești de dragoste cu tenorul Ștefan von Korch și invitații"],
      ["zaraza", "Zaraza", "Comori ale muzicii românești cu tenorul Ștefan von Korch și invitații"],
      ["valsul-primaverii", "Valsul primăverii", "Cu tenorul Ștefan von Korch și invitații"],
      ["requiem-de-verdi", "Requiem de Verdi", "La Sala Palatului"],
      ["seara-mare-la-palat", "Seara mare la Palat"],
      ["requiem-de-mozart", "Requiem de Mozart", "Cu tenorul Ștefan von Korch"],
      ["duelul-tenorilor", "Duelul tenorilor", "Evenimentul liric al verii cu Ştefan von Korch şi invitaţii"],
      ["vivo-per-lei", "Vivo per lei", "Dragobete în acorduri pop-opera"],
      ["o-sole-mio", "O sole mio", "Armonii mediteraneene: canzonete, tarantele și zarzuele"],
      ["christmas-extravaganza", "Christmas Extravaganza"],
      ["ole-torero", "Olé, torero!", "Spre tărâmul toreadorilor, cu tenorul Ștefan von Korch și Oana Maria Șerban"],
      ["un-amore-cosi-grande", "Un amore così grande"],
      ["operetta-love-story", "Operetta Love Story"],
      ["duelul-refrenelor", "Duelul refrenelor"],
      ["je-t-aime", "Je t'aime", "Incursiuni muzicale spre inima Parisului cu tenorul Ștefan von Korch și soprana Oana Maria Șerban"],
      ["caruso", "Caruso", "De la arie la canzonetă și tarantellă"],
      ["armonii-sacre", "Armonii sacre"],
      ["sous-le-ciel-de-paris", "Sous le ciel de Paris"],
      ["carmina-burana", "Carmina Burana", "Grădina de vară Herăstrău"],
      ["granada", "Granada", "Cu tenorul Ștefan von Korch și soprana Oana Maria Șerban"],
    ]),
    ...shows("copii", [
      ["cum-a-furat-grinch-craciunul", "Cum a furat Grinch Crăciunul"],
      ["cutiuta-muzicala", "Cutiuța muzicală", "Strică-Tot și culorile fermecate"],
    ]),
  ],

  seasons: [
    season("s2026", "Stagiunea 2026–2027", "2026–27", [
      ["o-scrisoare-pierduta", "O scrisoare pierdută"],
      ["d-ale-carnavalului", "D'ale carnavalului"],
      ["granada", "Granada"],
      ["ma-mut-la-mama", "Mă mut la mama", { date: "2026-10-22", time: "19:00", note: "Proiecție specială" }],
      ["prins-in-plasa", "Prins în… plasă"],
      ["morti-dupa-bani", "Morți după bani"],
      ["aventuri-pe-contrasens", "Aventuri pe contrasens"],
      ["nevasta-de-ocazie", "Nevastă de ocazie"],
      ["duelul-tenorilor", "Duelul tenorilor"],
    ]),
    season("s2025", "Stagiunea 2025–2026", "2025–26", [
      ["duelul-tenorilor", "Duelul tenorilor"],
      ["o-scrisoare-pierduta", "O scrisoare pierdută"],
      ["carmina-burana", "Carmina Burana", { date: "2027-02-21", venue: "Sala Palatului", note: "Mutat de la Grădina de vară Herăstrău" }],
      ["o-noapte-furtunoasa", "O noapte furtunoasă"],
      ["sous-le-ciel-de-paris", "Sous le ciel de Paris"],
      ["morti-dupa-bani", "Morți după bani"],
      ["aventuri-pe-contrasens", "Aventuri pe contrasens"],
      ["ole-torero", "Olé, torero!"],
      ["nevasta-de-ocazie", "Nevastă de ocazie"],
      ["mofturi-si-moftangii", "Mofturi și moftangii"],
      ["punem-petale-inapoi-florilor", "Punem petale înapoi florilor"],
      ["armonii-sacre", "Armonii sacre"],
      ["caruso", "Caruso"],
      ["amanta-noastra-de-la-minister", "Amanta noastră de la minister"],
      ["prins-in-plasa", "Prins în… plasă"],
      ["vivo-per-lei", "Vivo per lei"],
      ["je-t-aime", "Je t'aime"],
      ["d-ale-carnavalului", "D'ale carnavalului"],
      ["o-sole-mio", "O sole mio"],
      ["christmas-extravaganza", "Christmas Extravaganza"],
      ["invitatie-la-vals", "Invitație la vals"],
    ]),
    season("s2024", "Stagiunea 2024–2025", "2024–25", [
      ["duelul-tenorilor", "Duelul tenorilor"],
      ["duelul-refrenelor", "Duelul refrenelor", { date: "2025-07-09", venue: "Sala Dalles", note: "Prima ediție Pop Meets Classic" }],
      ["un-amore-cosi-grande", "Un amore così grande"],
      ["ispita-pentru-sotul-meu", "Ispită pentru soțul meu"],
      ["cutiuta-muzicala", "Cutiuța muzicală"],
      ["vivo-per-lei", "Vivo per lei"],
      ["operetta-love-story", "Operetta Love Story"],
      ["christmas-extravaganza", "Christmas Extravaganza"],
      ["invitatie-la-vals", "Invitație la vals"],
      ["o-sole-mio", "O sole mio"],
    ]),
  ],

  subscription: {
    title: "Abonament",
    body: "O seară pe lună, la prețul stabilit din timp.",
    note: "Oferta nu e încă disponibilă. O anunțăm aici și în newsletter.",
  },
  newsletter: {
    title: "Programul, o dată pe lună",
    body: "Lasă adresa și primești stagiunea în inbox.",
    demoNote: "Demo: formularul nu trimite nimic încă.",
  },
  footerNote: "Bilete prin Ticketstore.",
};
