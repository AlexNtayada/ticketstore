import { ArrowUpRight, MapPin } from "lucide-react";
import { directionsUrl, hasText } from "@/lib/event-utils";
import type { PageModel } from "@/lib/page-model";
import { MapEmbed } from "../ui/MapEmbed";
import { MediaFrame } from "../ui/MediaFrame";
import { RevealMedia } from "../ui/RevealMedia";
import { SectionLabel } from "../ui/SectionLabel";

export function Venue({ model, index }: { model: PageModel; index: string }) {
  const { event, t } = model;
  const v = event.venue;
  const transport = (v.transport ?? []).filter(hasText);
  const addressLines = [v.address, [v.city, v.country].filter(Boolean).join(", ")].filter(hasText);

  return (
    <section id="venue" aria-labelledby="venue-title" className="relative overflow-hidden">
      {v.image ? (
        <div className="relative [--radius-media:0px]">
          <RevealMedia parallax={event.features.advancedMotion}>
            <MediaFrame image={v.image} ratio="16 / 7" sizes="100vw" zoom={false} showCaption={false} className="hidden md:block" />
            <MediaFrame image={v.image} ratio="4 / 5" sizes="100vw" zoom={false} showCaption={false} className="md:hidden" />
          </RevealMedia>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />
        </div>
      ) : null}

      <div className={`frame relative pb-[var(--section-space)] ${v.image ? "-mt-[clamp(60px,12vw,200px)]" : "pt-[var(--section-space)]"}`}>
        <SectionLabel index={index} label={t.sections.venue} className="mb-6" />
        <h2 id="venue-title" className={`t-display-base max-w-[14ch] break-words ${v.name.length > 18 ? "t-heading" : "t-display"}`}>
          {v.name}
        </h2>

        <div className="grid-poster mt-12 gap-y-10 border-t border-line pt-8 md:mt-16">
          <address className="col-span-4 not-italic md:col-span-3 lg:col-span-4">
            <p className="t-label mb-3 text-muted">
              <MapPin aria-hidden className="mr-2 inline size-3.5 align-[-2px] text-accent" />
              {t.details.location}
            </p>
            {addressLines.map((line) => (
              <p key={line} className="t-meta">{line}</p>
            ))}
          </address>

          {transport.length ? (
            <div className="col-span-4 md:col-span-3 lg:col-span-4">
              <p className="t-label mb-3 text-muted">{t.venue.getThere}</p>
              <ul className="space-y-2">
                {transport.map((line) => (
                  <li key={line} className="t-body">{line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="col-span-4 flex flex-col items-start gap-4 md:col-span-6 lg:col-span-4 lg:items-end">
            <a
              href={directionsUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="group t-label inline-flex h-12 items-center gap-3 rounded-full border border-current px-6 transition-colors hover:bg-fg hover:text-bg"
            >
              {t.venue.directions}
              <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>

        {v.mapEmbedUrl ? (
          <div className="mt-12">
            <MapEmbed url={v.mapEmbedUrl} title={`${v.name} map`} label={t.venue.showMap} notice={t.venue.mapNotice} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
