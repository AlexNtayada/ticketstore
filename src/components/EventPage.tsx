import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { NavLink } from "@/components/layout/MobileNavigation";
import { ArtistStory } from "@/components/sections/ArtistStory";
import { EventDetails } from "@/components/sections/EventDetails";
import { EventStatement } from "@/components/sections/EventStatement";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { Lineup } from "@/components/sections/Lineup";
import { MediaGallery } from "@/components/sections/MediaGallery";
import { TourDates } from "@/components/sections/TourDates";
import { Venue } from "@/components/sections/Venue";
import { AnalyticsLoader } from "@/components/ui/AnalyticsLoader";
import { ConfigWarnings } from "@/components/ui/ConfigWarnings";
import { PresentationNotice } from "@/components/ui/PresentationNotice";
import { StickyTicketBar } from "@/components/ui/StickyTicketBar";
import { event } from "@/config/event";
import { buildPageModel } from "@/lib/page-model";
import { buildEventJsonLd } from "@/lib/seo";
import { validateEvent } from "@/lib/ticketstore";

const HIDE_STICKY_ON = ["hero", "final-cta", "site-footer"];

/** Single-event microsite (template mode "event"). */
export function EventPage() {
  const model = buildPageModel(event);
  const { t, visible, cta, dates } = model;
  const issues = validateEvent(event);
  const jsonLd = buildEventJsonLd(event);
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev && issues.length) {
    console.warn(`[event config] ${issues.map((i) => `${i.level}: ${i.field} — ${i.message}`).join("\n")}`);
  }

  // Section numbers follow what is actually rendered, like a poster index.
  let n = 0;
  const next = () => String(++n).padStart(2, "0");
  const idx = {
    statement: visible.statement ? next() : "",
    details: next(),
    tour: visible.tour ? next() : "",
    story: visible.story ? next() : "",
    media: visible.gallery ? next() : "",
    lineup: visible.lineup ? next() : "",
    venue: visible.venue ? next() : "",
    faq: visible.faq ? next() : "",
  };

  const links: NavLink[] = [
    visible.story ? { href: "#about", label: t.nav.about } : null,
    visible.gallery ? { href: "#media", label: t.nav.media } : null,
    visible.lineup ? { href: "#lineup", label: t.nav.lineup } : null,
    { href: "#info", label: t.nav.info },
  ].filter((l): l is NavLink => !!l);

  const shortMeta = [dates.short, event.venue.name].filter(Boolean).join("  ·  ");

  return (
    <>
      <a href="#content" className="t-label sr-only z-[80] bg-accent px-4 py-3 text-on-accent focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        {t.skip}
      </a>
      <Header
        brand={event.artistName}
        logo={event.logo}
        links={links}
        menuLabel={t.nav.menu}
        closeLabel={t.nav.close}
        meta={shortMeta}
        ticket={cta}
      />

      <main id="top">
        <Hero model={model} />
        <div id="content" tabIndex={-1} className="outline-none">
          {visible.statement ? <EventStatement model={model} index={idx.statement} /> : null}
          <EventDetails model={model} index={idx.details} />
          {visible.tour ? <TourDates model={model} index={idx.tour} /> : null}
          {visible.story ? <ArtistStory model={model} index={idx.story} /> : null}
          {visible.gallery ? <MediaGallery model={model} index={idx.media} /> : null}
          {visible.lineup ? <Lineup model={model} index={idx.lineup} /> : null}
          {visible.venue ? <Venue model={model} index={idx.venue} /> : null}
          {visible.faq ? <FAQ items={event.faq} title={t.sections.faq} label="FAQ" index={idx.faq} /> : null}
          <FinalCTA model={model} />
        </div>
      </main>

      <Footer model={model} />

      <StickyTicketBar
        title={event.artistName}
        meta={shortMeta}
        priceLabel={model.ticket.priceLabel}
        ticket={cta}
        hideWhenVisible={HIDE_STICKY_ON}
      />

      {event.ticketMode === "presentation" ? <PresentationNotice message={t.cta.presentation} /> : null}
      {event.features.analytics ? <AnalyticsLoader measurementId={event.analytics?.ga4MeasurementId} /> : null}
      {isDev ? <ConfigWarnings issues={issues} /> : null}
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      ) : null}
    </>
  );
}
