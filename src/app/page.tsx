import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import type { NavLink } from "@/components/layout/MobileNavigation";
import { EventCalendar } from "@/components/organizer/EventCalendar";
import { OrgHero } from "@/components/organizer/OrgHero";
import { Catalogue, NewsletterBand, OrgFooter, Repertoire, Seasons, Subscription, Venues } from "@/components/organizer/OrgSections";
import type { NextDate } from "@/components/organizer/SeasonSlider";
import { PresentationNotice } from "@/components/ui/PresentationNotice";
import { organizer } from "@/config/organizer";
import { featuredEvent, formatDateParts, sortEvents, ticketHref, todayIn } from "@/lib/organizer-utils";
import { CompanyPage } from "@/components/company/CompanyPage";
import { company } from "@/config/organizers/concordia";

/**
 * Which minisite this build renders. Set at build time:
 *   SITE=concordia npm run build:static  → Compania de Teatru Concordia (structure of minisites/dist/301)
 *   (unset)                              → Stagiunea Dalles · Luceafărul (structure of minisites/dist/56)
 */
const SITE = process.env.SITE === "concordia" ? "concordia" : "dalles";

/**
 * Organizer minisite (one client, many events). The single-event template is
 * still available as <EventPage /> in src/components/EventPage.tsx.
 */
// Ticketstore favicon (ticketstore.ro/media/img/icons).
const icons: Metadata["icons"] = {
  icon: [
    { url: "/icons/ts-16.png", sizes: "16x16", type: "image/png" },
    { url: "/icons/ts-32.png", sizes: "32x32", type: "image/png" },
    { url: "/icons/ts-48.png", sizes: "48x48", type: "image/png" },
  ],
  apple: "/icons/ts-48.png",
};

export const metadata: Metadata =
  SITE === "concordia"
    ? {
        title: company.name,
        description: company.description,
        openGraph: { title: company.name, description: company.tagline, images: [company.hero.image.src] },
        icons,
      }
    : {
  title: organizer.name,
  description: organizer.description,
  openGraph: { title: organizer.name, description: organizer.description, images: [organizer.featured.image.src] },
        icons,
      };

export default function Page() {
  if (SITE === "concordia") return <CompanyPage org={company} />;
  const org = organizer;
  // Static export: "now" is the build time; the calendar re-checks in the browser.
  const buildNow = Date.now();
  const featured = featuredEvent(org, buildNow);
  const today = todayIn(org.timezone, buildNow);
  const future = sortEvents(org.events).filter((e) => e.date >= today);
  const withDates = new Set(future.map((e) => e.show));
  const upcoming: Record<string, NextDate> = {};
  for (const e of future) upcoming[e.show] ??= { date: e.date, time: e.time, venue: `${e.city}, ${e.venue}` };

  const links: NavLink[] = [
    { href: "#calendar", label: "Calendar" },
    { href: "#spectacole", label: "Spectacole" },
    { href: "#sali", label: "Săli" },
    { href: "#stagiuni", label: "Stagiuni" },
    { href: "#abonament", label: "Abonament" },
  ];
  const meta = featured ? `${featured.title} · ${formatDateParts(featured.date).day} ${formatDateParts(featured.date).month} · ${featured.city}` : org.name;

  return (
    <>
      <a href="#content" className="t-label sr-only z-[80] bg-accent px-4 py-3 text-on-accent focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Sari la conținut
      </a>
      <Header
        brand={org.name}
        layout="edges"
        links={links}
        menuLabel="Meniu"
        closeLabel="Închide"
        meta={meta}
        ticket={{
          href: featured ? ticketHref(org, featured.ticketUrl) : null,
          label: "Cumpără bilete",
          eventId: featured?.id ?? "organizer",
          target: "_blank",
          srContext: featured ? `${featured.title}, ${featured.city}` : undefined,
        }}
      />
      <main id="top">
        <OrgHero org={org} event={featured} />
        <div id="content" tabIndex={-1} className="outline-none">
          <EventCalendar org={org} buildNow={buildNow} />
          <Venues org={org} />
          <Repertoire org={org} withDates={withDates} />
          <Catalogue org={org} withDates={withDates} />
          <Seasons org={org} upcoming={upcoming} />
          <Subscription org={org} />
          <NewsletterBand org={org} />
        </div>
      </main>
      <OrgFooter org={org} links={links} />
      {org.ticketMode === "presentation" ? <PresentationNotice message="Site de prezentare: butoanele de bilete nu duc nicăieri." /> : null}
    </>
  );
}
