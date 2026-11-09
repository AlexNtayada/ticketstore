# Digital Event Poster: template Ticketstore.ro

Microsite de o pagină pentru artiști și organizatori care vând bilete prin Ticketstore.ro și nu au site propriu. Un singur template, configurat dintr-un singur fișier de date, cu funcții premium activate din flag-uri (freemium).

> **Conținutul inclus este DEMO și fictiv.** „NIGHTWAVE”, line-up-ul, prețul, textele și răspunsurile FAQ sunt inventate pentru previzualizare. Imaginile din `public/images/demo/` sunt generate procedural (`scripts/generate-demo-media.py`), nu sunt fotografii reale. `ticketUrl` este gol intenționat.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS 4 + CSS custom properties (tokenuri de temă injectate per eveniment)
- Motion for React (reveal-uri la scroll, sticky bar, meniu mobil)
- Lucide icons
- `next/font` (Anton / Bebas Neue / Archivo Black / Barlow Condensed / Space Grotesk pentru display, DM Sans pentru interfață)

GSAP **nu** a fost adăugat: nicio secvență nu avea nevoie de timeline-uri complexe, iar animația de intrare din hero rulează în CSS, ca să nu întârzie LCP-ul așteptând hidratarea.

## Pornire

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run build        # build de producție
npm run check        # toate trei
```

În development apare un panou roșu „Config: N errors” (stânga sus) care listează problemele de configurare, de exemplu `ticketUrl` lipsă. Panoul nu apare în build-ul de producție.

### Previzualizare cu link de bilete

Link-ul se poate injecta la build fără să modifici codul:

```bash
NEXT_PUBLIC_TICKET_URL="https://www.ticketstore.ro/<link-real-eveniment>" npm run build
```

Sunt acceptate doar link-uri `https://` pe `ticketstore.ro` (sau subdomenii). Orice alt URL dezactivează CTA-urile.

## Structură

```
src/
  app/            layout.tsx (fonturi, temă, metadata), page.tsx (compunere), sitemap.ts, robots.ts, globals.css
  components/
    layout/       Header, MobileNavigation, Footer
    sections/     Hero, HeroVideo, EventStatement, EventDetails, ArtistStory, MediaGallery, Lineup, Venue, FAQ, FinalCTA
    ui/           TicketButton, StickyTicketBar, RevealText, RevealMedia, MediaFrame, SectionLabel, Marquee,
                  Countdown, VideoPlayer, SpotifyEmbed, MapEmbed, Newsletter, AnalyticsLoader, ConfigWarnings
  config/         event.ts (DATELE evenimentului), themes.ts (preseturi de culoare), features.ts (FREE / PREMIUM)
  lib/            ticketstore.ts (stare CTA + validare), event-utils.ts (date, fus orar, prețuri), seo.ts,
                  analytics.ts, i18n.ts (en / ro), theme.ts, fonts.ts, page-model.ts
  hooks/          useReducedMotion.ts
  types/          event.ts (modelul de date)
```

Componentele nu conțin informații despre un anumit artist. Schimbi `src/config/event.ts` și obții alt eveniment.

## Configurarea evenimentului (`src/config/event.ts`)

Tipul complet este `EventConfig` din `src/types/event.ts`. Câmpurile importante:

| Câmp | Rol |
|---|---|
| `artistName`, `eventName`, `kicker`, `tagline` | Identitate. Numele se dimensionează automat după numărul de caractere și se împarte pe 2–3 rânduri dacă e lung, fără să fie tăiat. |
| `date` (`YYYY-MM-DD`), `doorsTime`, `startTime` (`HH:mm`), `timezone` (IANA) | Data se afișează independent de fusul orar al vizitatorului; ora ISO pentru structured data și countdown folosește `timezone`. |
| `venue` | `name`, `address`, `city`, `country`, `transport[]`, `mapUrl` (altfel se generează o căutare Google Maps din adresă), `mapEmbedUrl` (hartă încărcată doar la cerere), `image`. |
| `priceFrom`, `currency` | Afișate doar dacă există. Nu se inventează niciodată un preț. |
| `ticketMode` | `"presentation"`: butoanele arată active, dar nu duc nicăieri; la click apare o notă scurtă. Pentru pitch. `"live"` pentru evenimente reale. |
| `ticketUrl` | Link-ul canonic Ticketstore. Toate CTA-urile îl folosesc. Gol sau invalid înseamnă CTA dezactivat și avertizare de configurare. |
| `tickets[]` | Opțional: mai multe produse (label, preț, URL Ticketstore). |
| `status` | `on_sale`, `coming_soon`, `sold_out`, `cancelled`, `postponed`, `ended`. Se setează manual, nu se deduce. `statusNote` explică amânarea sau anularea. |
| `statement[]`, `story`, `gallery[]`, `lineup[]`, `faq[]`, `finalCta` | Secțiunile goale nu se randează. FAQ fără răspuns nu se afișează. |
| `heroImage`, `heroMobileImage`, `posterImage`, `heroVideo` | Imagine desktop și crop separat pentru mobil. Doar cu `posterImage` (afișul), hero-ul arată afișul ca artwork. Fără nicio imagine, hero-ul e pur tipografic. |
| `theme`, `displayFont` | `midnight` (Acid Lime), `ember` (Electric Orange), `paper` (Cobalt), `burgundy` (Cream), `neon` (Hot Pink). |
| `locale` | `en` sau `ro`, pentru textele de interfață. |
| `seo` | `title`, `description`, `canonicalUrl`, `ogImage`. |
| `isDemo` | Afișează eticheta „Demo” și pune `noindex`, fără JSON-LD. **Setează `false` pentru un eveniment real.** |

Toate imaginile au `alt` obligatoriu. Pentru o imagine decorativă folosește `alt: ""`.

## Freemium (`src/config/features.ts`)

Un singur cod; tier-ul înseamnă doar flag-uri. `FREE_FEATURES` și `PREMIUM_FEATURES` sunt preseturi.

| Flag | Ce activează | Ce mai trebuie în afara template-ului |
|---|---|---|
| `videoHero` | Video de fundal (muted, inline, loop), doar pe ecrane ≥768px, fără reduced motion și fără data-saver. Pe mobil rămâne imaginea. | Fișierul video, găzduit |
| `advancedMotion` | Drift orizontal la scroll pe manifest, parallax pe imagini | — |
| `advancedGallery` | Compoziție editorială asimetrică și bandă orizontală pentru restul imaginilor (free: flux editorial pe 2 coloane) | — |
| `mediaEmbeds` | YouTube (nocookie), Vimeo (dnt), Spotify, toate încărcate doar la click | Consimțământ pentru embed-uri terțe, după politica voastră |
| `advancedLineup` | Ore de set, imagini artiști | — |
| `countdown` | Countdown până la start (randat doar pe client, fără hydration mismatch) | — |
| `customColors` / `customFonts` | Suprascriere tokenuri și font self-hosted (`customFont.src` în `/public/fonts`) | Licență web pentru font |
| `newsletter` | Formular HTML către endpoint-ul real al furnizorului (`newsletter.actionUrl`) | Cont la un furnizor (Mailchimp, Brevo etc.). Fără endpoint formularul nu apare. |
| `analytics` | Evenimente `ticket_cta_click`, `hero_ticket_click`, `sticky_ticket_click`, `details_ticket_click`, `final_ticket_click` către GA4 / dataLayer | GA4 Measurement ID **și** un banner de consimțământ care apelează `setAnalyticsConsent(true)` din `src/lib/analytics.ts`. Fără consimțământ nu se încarcă nimic. |
| `customDomain` | Doar flag | DNS + hosting per eveniment, serviciu Ticketstore |
| `removeTicketstoreBranding` | Ascunde „Bilete prin Ticketstore.ro” din footer | Politica de produs Ticketstore |

Un click pe CTA nu înseamnă o achiziție. Achiziția se face pe Ticketstore.ro, deci evenimentele de click nu trebuie raportate drept conversii.

## Integrare Ticketstore

- Fiecare CTA este un `<a>` real către `ticketUrl`. Nu există pași intermediari și nici checkout fals. Implicit se deschide în același tab (`ticketLinkTarget: "_blank"` pentru tab nou).
- `getTicketState()` din `src/lib/ticketstore.ts` e singura sursă pentru textul și starea CTA-urilor (hero, header, sticky bar, detalii, meniu mobil, final).
- Disponibilitatea vine doar din `status`. Dacă Ticketstore oferă un API, sincronizarea se poate face la build, prin ISR, din același loc.
- Pentru integratori se emite `window` event `dep:ticket_click` la fiecare click.

## SEO

Metadata dinamică (title, description, Open Graph, Twitter, canonical), `sitemap.xml` și `robots.txt` din `seo.canonicalUrl`, JSON-LD `MusicEvent` / `Event` doar când datele sunt valide și `isDemo` e false. Oferta din JSON-LD apare doar cu un `ticketUrl` valid. Setează `NEXT_PUBLIC_SITE_URL` la deploy dacă nu ai `canonicalUrl`.

## Banner de cookies

Sticky bar-ul folosește `bottom: var(--consent-offset)`. Când bannerul de consimțământ e vizibil, setează `--consent-offset` pe `:root` la înălțimea lui, ca bara să stea deasupra bannerului.

## Înlocuirea conținutului demo

1. Pune fotografiile organizatorului în `public/images/<eveniment>/` (hero ~2400px lățime, crop portret separat pentru mobil).
2. Actualizează `src/config/event.ts`: texte reale, `ticketUrl` primit de la Ticketstore, `isDemo: false`, `seo.canonicalUrl`.
3. Șterge `public/images/demo/` dacă nu mai e folosit.
4. `npm run check`.
