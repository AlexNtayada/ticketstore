import { getImageProps } from "next/image";
import { formatDateParts, priceLabel, ticketHref } from "@/lib/organizer-utils";
import type { OrganizerConfig, OrgEvent } from "@/types/organizer";
import { TicketButton } from "../ui/TicketButton";

/** Full-screen hero for the featured event: darkened photo, white title, floating details card. */
export function OrgHero({
  org,
  event,
}: {
  org: OrganizerConfig;
  event: OrgEvent | null;
}) {
  const { featured } = org;
  const mobile = featured.mobileImage ?? featured.image;
  const common = {
    alt: featured.image.alt,
    sizes: "100vw",
    priority: true as const,
    quality: 78,
  };
  const desk = getImageProps({
    ...common,
    src: featured.image.src,
    width: featured.image.width,
    height: featured.image.height,
  });
  const mob = getImageProps({
    ...common,
    alt: mobile.alt,
    src: mobile.src,
    width: mobile.width,
    height: mobile.height,
  });
  const title = event?.title ?? org.name;
  const parts = event ? formatDateParts(event.date) : null;
  const price = event ? priceLabel(org, event.priceFrom) : null;
  const href = event ? ticketHref(org, event.ticketUrl) : null;

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[max(620px,100svh)] flex-col overflow-hidden bg-bg"
    >
      <div className="hero-media absolute inset-0 -z-10">
        <picture className="block size-full">
          <source
            media="(min-width: 768px)"
            srcSet={desk.props.srcSet || desk.props.src}
            sizes="100vw"
          />
          <source srcSet={mob.props.srcSet || mob.props.src} sizes="100vw" />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from config via getImageProps */}
          <img
            {...mob.props}
            className="size-full object-cover [object-position:var(--focus-m)] md:[object-position:var(--focus-d)]"
            style={{
              ["--focus-m" as string]: mobile.focus ?? "50% 50%",
              ["--focus-d" as string]: featured.image.focus ?? "50% 50%",
            }}
          />
        </picture>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-background) 55%, transparent), transparent 25%, transparent 50%, color-mix(in srgb, var(--color-background) 80%, transparent))",
        }}
      />

      <div className="frame relative flex flex-1 flex-col pb-[clamp(20px,4vh,44px)] pt-[calc(var(--header-h)+40px)]">
        <div className="mt-auto py-8 md:mb-auto">
          <h1
            id="hero-title"
            className="t-display-base t-hero max-w-[16ch] text-fg"
          >
            <span className="mask-line hero-anim">
              <span>
                {title}
                <span aria-hidden className="text-accent">
                  .
                </span>
              </span>
            </span>
          </h1>
          <p
            className="enter mt-3 font-display text-[clamp(1.1rem,1.8vw,1.6rem)] text-fg/85"
            style={{ ["--i" as string]: 1 }}
          >
            {featured.subtitle}
          </p>
        </div>

        {event && parts ? (
          <div
            className="hero-meta org-hero-meta enter mt-0 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4 lg:grid-cols-12 lg:items-center lg:gap-x-6"
            style={{ ["--i" as string]: 2 }}
          >
            <dl className="contents">
              <div className="lg:col-span-3">
                <dt className="t-label text-fg/55">Data</dt>
                <dd className="t-meta mt-1.5 tabular">
                  {parts.weekday}, {parts.day} {parts.month}
                </dd>
              </div>
              <div className="lg:col-span-4">
                <dt className="t-label text-fg/55">Locație</dt>
                <dd className="t-meta mt-1.5">
                  {event.venue}
                  <span className="block text-fg/60">{event.city}</span>
                </dd>
              </div>
              <div className="lg:col-span-1">
                <dt className="t-label text-fg/55">Ora</dt>
                <dd className="t-meta mt-1.5 tabular">{event.time}</dd>
              </div>
            </dl>
            <div className="col-span-2 flex flex-col gap-3 md:col-span-1 md:items-end lg:col-span-4 lg:flex-row lg:items-center lg:justify-end lg:gap-5">
              {price ? (
                <p className="t-label tabular text-fg/80">{price}</p>
              ) : null}
              <TicketButton
                href={href}
                label="Cumpără bilete"
                placement="hero"
                eventId={event.id}
                target="_blank"
                srContext={`${event.title}, ${event.city}`}
                size="lg"
                className="w-full md:w-auto"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
