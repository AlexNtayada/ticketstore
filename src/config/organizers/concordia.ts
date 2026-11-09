import type { CompanyConfig, CompanyShow, PastShow } from "@/types/company";

/**
 * Real content from the company's Ticketstore minisite
 * (minisites/dist/301, "Compania de Teatru Concordia"), read 9 Nov 2026.
 * All photos and posters come from that site (public/img/301).
 */
const utm = (id: string) => `utm_source=minisite&utm_medium=organizer&utm_campaign=301&e=${id}`;
const ts = (id: string, slug: string) => `https://ticketstore.ro/ro/bilete/${id}/${slug}?${utm(id)}`;
const img = (path: string) => `/img/301/${path}.webp`;
const poster = (slug: string) => img(`${slug}/poster-640`);

const photo = (slug: string, alt: string, file = "card-1200", height = 628) => ({ src: img(`${slug}/${file}`), alt, width: 1200, height });

const shows: CompanyShow[] = [
  { slug: "n-am-pierdut-rasaritul", title: "N-am pierdut răsăritul", category: "concerte", credit: "Aurelian Temișan live", poster: poster("n-am-pierdut-rasaritul"), photo: photo("n-am-pierdut-rasaritul", "Aurelian Temișan pe scenă", "card-1200", 675) },
  { slug: "romeo-si-julieta", title: "Romeo și Julieta", category: "teatru", credit: "regia Toma Enache · premieră septembrie 2026", poster: poster("romeo-si-julieta"), photo: photo("romeo-si-julieta", "Scenă din Romeo și Julieta", "hero-1200") },
  { slug: "divortul-anului", title: "Divorțul anului", category: "teatru", credit: "regia Ovidiu Cuncea", poster: poster("divortul-anului"), photo: photo("divortul-anului", "Scenă din Divorțul anului", "hero-1200", 630) },
  { slug: "o-noapte-furtunoasa", title: "O noapte furtunoasă", category: "teatru", credit: "de I.L. Caragiale · regia Alexandru Nagy", poster: poster("o-noapte-furtunoasa"), photo: photo("o-noapte-furtunoasa", "Scenă din O noapte furtunoasă", "hero-1200") },
  { slug: "visul-unei-nopti-de-vara", title: "Visul unei nopți de vară", category: "teatru", credit: "de William Shakespeare", poster: poster("visul-unei-nopti-de-vara"), photo: photo("visul-unei-nopti-de-vara", "Scenă din Visul unei nopți de vară", "hero-1200") },
  { slug: "sistemul-perfect", title: "Sistemul perfect", category: "teatru", credit: "regia Toma Enache", poster: poster("sistemul-perfect"), photo: photo("sistemul-perfect", "Afișul spectacolului Sistemul perfect") },
  { slug: "o-scrisoare-pierduta", title: "O scrisoare pierdută", category: "teatru", credit: "de I.L. Caragiale · regia Toma Enache", poster: poster("o-scrisoare-pierduta"), photo: photo("o-scrisoare-pierduta", "Afișul spectacolului O scrisoare pierdută") },
  { slug: "eu-te-cred-da-tu-ma-minti", title: "Eu te cred, da'… tu mă minți!", category: "teatru", credit: "regia Liviu Lucaci", poster: poster("eu-te-cred-da-tu-ma-minti"), photo: photo("eu-te-cred-da-tu-ma-minti", "Scenă din Eu te cred, da'… tu mă minți!", "hero-1200", 630) },
  { slug: "anii-mei", title: "Anii mei", category: "concerte", credit: "Toamnă moculesciană", poster: img("anii-mei/poster-320") },
  { slug: "unplugged-eu-fara-filtre", title: "Unplugged. Eu, fără filtre", category: "concerte", credit: "Concert Aurelian Temișan", poster: poster("unplugged-eu-fara-filtre") },
  { slug: "ce-as-fi-fost-daca", title: "Ce-aș fi fost dacă…", category: "concerte", credit: "Concert omagiu pentru și despre Angela Similea" },
  { slug: "eu-nu-mai-sunt-cel-de-ieri", title: "Eu nu mai sunt cel de ieri", category: "concerte", credit: "Concert Aurelian Temișan" },
  { slug: "zaraza", title: "Zaraza", category: "concerte", credit: "Concert Aurelian Temișan" },
];

const P = (date: string, title: string, city: string): PastShow => ({ date, title, city });

export const company: CompanyConfig = {
  name: "Compania de Teatru Concordia",
  shortName: "Concordia",
  tagline: "Teatrul nu așteaptă publicul într-un singur loc. Merge el după public.",
  description: "Teatru independent fondat de Monica Davidescu și Aurelian Temișan. Spectacole și concerte în toată țara.",
  timezone: "Europe/Bucharest",
  currencyLabel: "lei",
  ticketMode: "live",

  hero: {
    image: { src: img("_site/hero-1200"), alt: "Distribuția Companiei de Teatru Concordia, cu sala plină în spate", width: 1200, height: 628, focus: "50% 40%" },
  },

  events: [
    { id: "13054", show: "o-noapte-furtunoasa", title: "O noapte furtunoasă", date: "2026-11-09", time: "19:30", city: "București", venue: "TNB, Sala Ion Caramitru", priceFrom: 100, ticketUrl: ts("13054", "o-noapte-furtunoasa-bucuresti") },
    { id: "local-divort-1411", show: "divortul-anului", title: "Divorțul anului", date: "2026-11-14", time: "16:00", city: "București", venue: "Sala Gloria", status: "other" },
    { id: "local-eu-te-cred-1411", show: "eu-te-cred-da-tu-ma-minti", title: "Eu te cred, da'… tu mă minți!", date: "2026-11-14", time: "17:30", city: "București", venue: "Sala Gloria", status: "other" },
    { id: "13025", show: "visul-unei-nopti-de-vara", title: "Visul unei nopți de vară", date: "2026-11-16", time: "19:30", city: "București", venue: "TNB, Sala Studio", priceFrom: 110, ticketUrl: ts("13025", "visul-unei-nopti-de-vara-bucuresti") },
    { id: "local-ce-as-fi-2111", show: "ce-as-fi-fost-daca", title: "Ce-aș fi fost dacă…", date: "2026-11-21", time: "19:30", city: "București", venue: "TNB, Sala Ion Caramitru", status: "soldout" },
    { id: "13356", show: "divortul-anului", title: "Divorțul anului", date: "2026-11-24", time: "19:00", city: "Slatina", venue: "Centrul Cultural „Eugen Ionescu”", priceFrom: 90, ticketUrl: ts("13356", "divortul-anului-slatina") },
    { id: "12447", show: "sistemul-perfect", title: "Sistemul perfect", date: "2026-11-30", time: "19:00", city: "Râmnicu Vâlcea", venue: "Casa de Cultură a Sindicatelor", priceFrom: 70, ticketUrl: ts("12447", "sistemul-perfect-ramnicu-valcea") },
    { id: "11665", show: "romeo-si-julieta", title: "Romeo și Julieta", date: "2026-12-07", time: "19:00", city: "Bacău", venue: "Teatrul de Vară „Radu Beligan”", priceFrom: 120, ticketUrl: ts("11665", "romeo-si-julieta-bacau") },
    { id: "13137", show: "romeo-si-julieta", title: "Romeo și Julieta", date: "2026-12-08", time: "19:00", city: "Brașov", venue: "Teatrul „Sica Alexandrescu”", priceFrom: 200, ticketUrl: ts("13137", "romeo-si-julieta-brasov") },
    { id: "12978", show: "o-scrisoare-pierduta", title: "O scrisoare pierdută", date: "2027-02-22", time: "19:00", city: "București", venue: "Opera Națională Română", priceFrom: 150, ticketUrl: ts("12978", "o-scrisoare-pierduta-bucuresti") },
    { id: "12151", show: "n-am-pierdut-rasaritul", title: "N-am pierdut răsăritul", date: "2027-04-01", time: "19:00", city: "Brașov", venue: "Cercul Militar", priceFrom: 140, ticketUrl: ts("12151", "n-am-pierdut-rsritul-aurelian-temisan-live-tour-brasov") },
    { id: "12149", show: "n-am-pierdut-rasaritul", title: "N-am pierdut răsăritul", date: "2027-04-02", time: "19:00", city: "Ploiești", venue: "Casa de Cultură a Sindicatelor", priceFrom: 130, ticketUrl: ts("12149", "n-am-pierdut-rsritul-aurelian-temisan-live-tour-ploiesti") },
    { id: "12150", show: "n-am-pierdut-rasaritul", title: "N-am pierdut răsăritul", date: "2027-04-03", time: "19:00", city: "Constanța", venue: "Casa de Cultură a Sindicatelor – Sala Mare", priceFrom: 130, ticketUrl: ts("12150", "n-am-pierdut-rsritul-aurelian-temisan-live-tour-constanta") },
    { id: "12069", show: "n-am-pierdut-rasaritul", title: "N-am pierdut răsăritul", date: "2027-04-13", time: "19:00", city: "Craiova", venue: "Teatrul Național", priceFrom: 140, ticketUrl: ts("12069", "n-am-pierdut-rsritul-aurelian-temisan-live-tour-craiova") },
    { id: "12070", show: "n-am-pierdut-rasaritul", title: "N-am pierdut răsăritul", date: "2027-04-14", time: "19:00", city: "Pitești", venue: "Casa de Cultură a Sindicatelor", priceFrom: 120, ticketUrl: ts("12070", "n-am-pierdut-rsritul-aurelian-temisan-live-tour-pitesti") },
    { id: "13047", show: "romeo-si-julieta", title: "Romeo și Julieta", date: "2027-04-19", time: "19:00", city: "București", venue: "Opera Națională Română", priceFrom: 170, ticketUrl: ts("13047", "romeo-si-julieta-bucuresti") },
  ],

  past: [
    P("2026-11-03", "Romeo și Julieta", "Sibiu"),
    P("2026-11-02", "Romeo și Julieta", "Timișoara"),
    P("2026-10-24", "Eu te cred, da'… tu mă minți!", "Buzău"),
    P("2026-09-26", "Divorțul anului", "Medgidia"),
    P("2026-09-24", "O noapte furtunoasă", "Drăgășani"),
    P("2026-07-09", "O noapte furtunoasă", "București"),
    P("2026-06-08", "Eu te cred, da'… tu mă minți!", "București"),
    P("2026-05-26", "Visul unei nopți de vară", "Oltenița"),
    P("2026-05-25", "O noapte furtunoasă", "București"),
    P("2026-04-26", "Eu te cred, da'… tu mă minți!", "Medgidia"),
    P("2026-04-22", "O noapte furtunoasă", "Călărași"),
    P("2026-03-25", "Divorțul anului", "Drăgășani"),
    P("2026-03-23", "Unplugged. Eu, fără filtre", "București"),
    P("2026-03-03", "Divorțul anului", "Curtea de Argeș"),
    P("2026-02-28", "O noapte furtunoasă", "Oltenița"),
    P("2026-02-25", "Divorțul anului", "Suceava"),
    P("2026-02-23", "Divorțul anului", "Iași"),
    P("2026-02-20", "Divorțul anului", "Brad"),
    P("2026-02-19", "Divorțul anului", "Deva"),
    P("2026-02-14", "Divorțul anului", "Râmnicu Vâlcea"),
    P("2025-11-19", "Anii mei", "București"),
    P("2025-11-09", "Divorțul anului", "Întorsura Buzăului"),
    P("2025-10-28", "Divorțul anului", "Brașov"),
    P("2025-10-16", "Divorțul anului", "București"),
    P("2025-10-13", "O noapte furtunoasă", "București"),
    P("2025-09-20", "Eu te cred, da'… tu mă minți!", "Videle"),
    P("2025-07-11", "Visul unei nopți de vară", "București"),
    P("2025-07-10", "O noapte furtunoasă", "București"),
    P("2025-06-13", "Divorțul anului", "București"),
    P("2025-06-09", "Visul unei nopți de vară", "Bacău"),
    P("2025-06-03", "O noapte furtunoasă", "Constanța"),
    P("2025-05-28", "O noapte furtunoasă", "Râmnicu Vâlcea"),
    P("2025-05-26", "Divorțul anului", "Giurgiu"),
    P("2025-05-21", "Eu te cred, da'… tu mă minți!", "București"),
    P("2025-05-14", "Divorțul anului", "Buhuși"),
    P("2025-05-13", "O noapte furtunoasă", "Pitești"),
    P("2025-05-06", "Visul unei nopți de vară", "Slatina"),
    P("2025-05-05", "Visul unei nopți de vară", "Drobeta-Turnu Severin"),
    P("2025-04-29", "Divorțul anului", "București"),
    P("2025-04-14", "Visul unei nopți de vară", "Călărași"),
    P("2025-04-07", "Visul unei nopți de vară", "Câmpina"),
    P("2025-03-26", "Visul unei nopți de vară", "București"),
    P("2025-03-09", "Divorțul anului", "Videle"),
    P("2025-03-03", "Visul unei nopți de vară", "Brașov"),
    P("2025-02-20", "Divorțul anului", "București"),
    P("2025-02-18", "O noapte furtunoasă", "București"),
    P("2025-02-17", "O noapte furtunoasă", "Brașov"),
    P("2025-02-10", "Visul unei nopți de vară", "București"),
    P("2025-02-03", "Visul unei nopți de vară", "Constanța"),
    P("2025-01-20", "O noapte furtunoasă", "București"),
    P("2025-01-20", "O noapte furtunoasă", "Brașov"),
    P("2024-12-16", "O noapte furtunoasă", "Ploiești"),
    P("2024-12-10", "Visul unei nopți de vară", "Buzău"),
    P("2024-12-09", "Visul unei nopți de vară", "București"),
    P("2024-11-26", "Visul unei nopți de vară", "București"),
    P("2024-11-25", "O noapte furtunoasă", "Ploiești"),
    P("2024-11-22", "Divorțul anului", "Constanța"),
    P("2024-11-21", "O noapte furtunoasă", "București"),
    P("2024-11-12", "Divorțul anului", "Brăila"),
    P("2024-11-06", "Eu te cred, da'… tu mă minți!", "București"),
  ],

  shows,

  about: {
    intro: "Teatru independent fondat de Monica Davidescu și Aurelian Temișan.",
    people: [
      { name: "Aurelian Temișan", role: "fondator", photo: img("_site/aurelian-temisan-360") },
      { name: "Monica Davidescu", role: "fondatoare", photo: img("_site/monica-davidescu-360") },
      { name: "Ovidiu Cuncea", role: "actor, regizor", photo: img("_site/ovidiu-cuncea-360") },
    ],
    ensemble: ["Adrian Nartea", "Monica Odagiu", "Radu Ștefan Bănică", "Cosmin Vijeu", "Marius Rizea", "Kira Hagi", "Nicolae Urs", "Dan Istrate", "Emanuel Varga"],
  },

  spotlight: [
    { show: "n-am-pierdut-rasaritul", pitch: "Aurelian Temișan & Cardinal Show Orchestra, într-un spectacol live plin de energie.", image: photo("n-am-pierdut-rasaritul", "Aurelian Temișan pe scenă", "card-1200", 675) },
    { show: "romeo-si-julieta", pitch: "Peste 40 de costume, măști și spade aduse din Italia.", image: photo("romeo-si-julieta", "Scenă din Romeo și Julieta", "hero-1200") },
    { show: "divortul-anului", pitch: "O căsnicie, un amant și un inel: Monica Davidescu, Aurelian Temișan și Ovidiu Cuncea.", image: photo("divortul-anului", "Scenă din Divorțul anului", "hero-1200", 630) },
  ],

  press: [
    { quote: "Dacă există un sistem perfect în teatrul românesc, acesta se numește Concordia.", source: "Agerpres OTS, mai 2026", note: "comunicat de presă al companiei", href: "https://agerpres.ro/ots/comunicat-de-presa---compania-de-teatru-concordia-mai-2026--660258" },
    { quote: "Teatrul nu așteaptă publicul într-un singur loc. Merge el după public.", source: "Zile și Nopți, octombrie 2026", href: "https://zilesinopti.ro/2026/10/09/aurelian-temisan-monica-davidescu-scene/" },
    { quote: "De șapte ani avem acest copil al nostru, Compania de Teatru Concordia.", source: "Monica Davidescu, Forbes România, 2026", href: "https://www.forbes.ro/?p=503953" },
  ],

  gallery: {
    images: [
      photo("divortul-anului", "Divorțul anului", "hero-1600", 840),
      photo("o-noapte-furtunoasa", "O noapte furtunoasă", "hero-1200"),
      photo("visul-unei-nopti-de-vara", "Visul unei nopți de vară", "hero-1200"),
      photo("eu-te-cred-da-tu-ma-minti", "Eu te cred, da'… tu mă minți!", "hero-1600", 840),
    ].map((i) => ({ ...i, width: i.src.includes("1600") ? 1600 : 1200 })),
    credit: "Foto: Horia Stan, Marius Ștefănescu",
  },

  alert: {
    title: "Anunță-mă când veniți la…",
    body: "Lasă orașul și adresa. Primești un singur mesaj, când apare o dată la tine.",
    demoNote: "Demo: formularul nu trimite nimic încă. Tot aici va fi și newsletter-ul.",
  },

  socials: [
    { label: "Facebook", href: "https://www.facebook.com/CompaniaDeTeatruConcordia" },
    { label: "Instagram", href: "https://www.instagram.com/companiadeteatruconcordia/" },
    { label: "TikTok", href: "https://www.tiktok.com/@companiadeteatruconcordia" },
  ],
  footerNote: "Bilete prin Ticketstore",
};
