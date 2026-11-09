import Image from "next/image";
import { Fragment } from "react";
import type { LineupArtist } from "@/types/event";
import type { PageModel } from "@/lib/page-model";
import { RevealText } from "../ui/RevealText";
import { SectionLabel } from "../ui/SectionLabel";

/** A festival poster bill: headliners at full width, support acts run in, guests smallest. */
export function Lineup({ model, index }: { model: PageModel; index: string }) {
  const { event, t } = model;
  const artists = event.lineup.filter((a) => a.name.trim());
  if (!artists.length) return null;
  const advanced = event.features.advancedLineup;
  const by = (tier: LineupArtist["tier"]) => artists.filter((a) => a.tier === tier);
  const headliners = by("headliner");
  const support = by("support");
  const guests = by("guest");

  const Time = ({ a }: { a: LineupArtist }) =>
    advanced && a.setTime ? <sup className="t-label ml-2 align-super font-sans text-accent tabular">{a.setTime}</sup> : null;

  return (
    <section id="lineup" aria-labelledby="lineup-title" className="section-space relative border-t border-line">
      <div className="frame">
        <div className="mb-[clamp(40px,6vw,88px)] flex items-center justify-between">
          <SectionLabel index={index} label={t.sections.lineup} className="text-muted" />
          <h2 id="lineup-title" className="sr-only">{t.sections.lineup}</h2>
        </div>

        <ul className="text-center">
          {headliners.map((a) => (
            <li key={a.name} className="relative">
              <p className="t-label mb-2 text-muted">
                {a.role ?? t.lineup.headliner}
                {advanced && a.setTime ? <span className="tabular text-accent"> · {a.setTime}</span> : null}
              </p>
              <RevealText
                as="p"
                lines={[a.name]}
                className="t-display-base text-[clamp(4rem,16vw,15rem)] leading-[calc(var(--display-line-height)*0.98)]"
              />
              {advanced && a.image ? (
                <Image
                  src={a.image.src}
                  alt={a.image.alt}
                  width={a.image.width}
                  height={a.image.height}
                  sizes="160px"
                  className="mx-auto mt-6 aspect-[4/5] w-32 rounded-[var(--radius-media)] object-cover md:w-40"
                />
              ) : null}
            </li>
          ))}
        </ul>

        {support.length ? (
          <ul className="t-display-base mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-center gap-x-[0.35em] gap-y-2 text-[clamp(2.4rem,7vw,6.5rem)] leading-[0.95] md:mt-14">
            {support.map((a, i) => (
              <Fragment key={a.name}>
                <li>
                  {a.name}
                  <Time a={a} />
                </li>
                {i < support.length - 1 ? (
                  <li aria-hidden className="inline-block size-[0.18em] rotate-45 bg-accent" />
                ) : null}
              </Fragment>
            ))}
          </ul>
        ) : null}

        {guests.length ? (
          <ul className="t-display-base mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[clamp(1.4rem,3vw,2.6rem)] text-muted md:mt-12">
            {guests.map((a) => (
              <li key={a.name}>
                {a.name}
                <Time a={a} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
