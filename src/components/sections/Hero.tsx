import Image, { getImageProps } from "next/image";
import type { PageModel } from "@/lib/page-model";
import { longestLine, splitDisplayLines } from "@/lib/event-utils";
import { TicketButton } from "../ui/TicketButton";
import { HeroVideo } from "./HeroVideo";

/**
 * The digital poster. Image (or video) fills the frame; the artist name is
 * set to the exact width of the frame from its character count, so short and
 * long names both read as a deliberate typographic block and are never cropped.
 */
export function Hero({ model }: { model: PageModel }) {
  const { event, t, ticket, cta, dates } = model;
  const lines = splitDisplayLines(event.artistName, 10, 3);
  // +0.7 accounts for the accent full stop
  const chars = longestLine(lines) + 0.7;
  const hero = event.heroImage;
  const mobile = event.heroMobileImage ?? hero;
  const poster = !hero ? event.posterImage : undefined;
  const statusChip = ticket.status !== "on_sale" ? t.status[ticket.status] : null;

  let pictureSources: { desktop?: string; mobile?: string; img?: ReturnType<typeof getImageProps>["props"] } = {};
  if (hero && mobile) {
    const common = { alt: hero.alt, sizes: "100vw", priority: true as const, quality: 78 };
    const desk = getImageProps({ ...common, src: hero.src, width: hero.width, height: hero.height });
    const mob = getImageProps({ ...common, src: mobile.src, width: mobile.width, height: mobile.height });
    pictureSources = { desktop: desk.props.srcSet || desk.props.src, mobile: mob.props.srcSet || mob.props.src, img: mob.props };
  }

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[max(640px,100svh)] flex-col overflow-hidden bg-bg"
    >
      {/* ── media ─────────────────────────────────────────── */}
      {hero && pictureSources.img ? (
        <div aria-hidden={hero.alt === "" || undefined} className="hero-media absolute inset-0 -z-10">
          <picture className="block size-full">
            <source media="(min-width: 768px)" srcSet={pictureSources.desktop} sizes="100vw" />
            <source srcSet={pictureSources.mobile} sizes="100vw" />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from config via getImageProps */}
            <img
              {...pictureSources.img}
              className="size-full object-cover"
              style={{ objectPosition: hero.focus ?? "50% 50%" }}
            />
          </picture>
          {event.features.videoHero && event.heroVideo?.src ? (
            <HeroVideo src={event.heroVideo.src} type={event.heroVideo.type} poster={hero.src} />
          ) : null}
        </div>
      ) : null}

      {/* legibility veils: top for the nav, bottom for the title block */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10"
        style={{
          // Veils are tinted with the theme ground so text stays legible on dark and light themes alike.
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-background) 60%, transparent), transparent 22%, transparent 45%, color-mix(in srgb, var(--color-background) 88%, transparent) 88%)",
        }} />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />

      {/* ── top line ──────────────────────────────────────── */}
      <div className="frame relative pt-[calc(var(--header-h)+clamp(20px,4vh,48px))]">
        <div className="enter flex items-start justify-between gap-6" style={{ ["--i" as string]: 0 }}>
          {event.kicker ? (
            <p className="hero-kicker t-label flex items-center gap-3">
              <span aria-hidden className="size-2 bg-accent" />
              {event.kicker}
            </p>
          ) : (
            <span />
          )}
          <p className="t-label text-right text-fg/80">
            {event.isDemo ? (
              <span className="mr-3 inline-block border border-fg/40 px-2 py-1">{t.demoBadge}</span>
            ) : null}
            {statusChip ? (
              <span className="mr-3 inline-block border border-accent px-2 py-1 text-accent">{statusChip}</span>
            ) : null}
            <span className="tabular hidden md:inline">{dates.numeric}</span>
          </p>
        </div>
      </div>

      {/* ── poster artwork (minimal configs without photography) ── */}
      {poster ? (
        <div className="frame relative mt-8 flex justify-end">
          <Image
            src={poster.src}
            alt={poster.alt}
            width={poster.width}
            height={poster.height}
            priority
            sizes="(min-width: 1024px) 34vw, 70vw"
            className="enter h-auto max-h-[52svh] w-auto max-w-[70vw] object-contain shadow-2xl md:max-w-[34vw]"
            style={{ ["--i" as string]: 1 }}
          />
        </div>
      ) : null}

      {/* ── title + metadata ──────────────────────────────── */}
      <div className="frame relative mt-auto pb-[clamp(20px,4vh,44px)]">
        {event.tagline ? (
          <p
            className="enter mb-[clamp(16px,4vh,48px)] ml-auto max-w-[11ch] text-right text-balance font-display text-[clamp(1.6rem,3.2vw,3.25rem)] uppercase leading-[0.95] md:mr-[8%]"
            style={{ ["--i" as string]: 1 }}
          >
            {event.tagline}
          </p>
        ) : null}

        <h1
          id="hero-title"
          className="t-display-base t-hero -ml-[0.03em] text-fg"
          style={{ ["--chars" as string]: chars, ["--font-size-hero-max" as string]: "min(17rem, 30svh)" }}
        >
          {lines.map((line, i) => (
            <span key={i} className="mask-line hero-anim" style={{ ["--i" as string]: i }}>
              <span>
                {line}
                {i === lines.length - 1 ? <span aria-hidden className="text-accent">.</span> : null}
              </span>
            </span>
          ))}
          <span className="sr-only">
            {event.eventName && event.eventName !== event.artistName ? ` — ${event.eventName}` : ""}
          </span>
        </h1>

        <hr className="hero-rule rule enter-rule mt-[clamp(14px,2.4vh,28px)] border-fg/35" />

        <div className="hero-meta mt-4 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 lg:mt-5 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <dl className="contents">
          <div className="enter lg:col-span-3" style={{ ["--i" as string]: 2 }}>
            <dt className="t-label text-fg/60">{t.details.date}</dt>
            <dd className="t-meta mt-1.5 tabular">{dates.long}</dd>
          </div>
          <div className="enter lg:col-span-3" style={{ ["--i" as string]: 3 }}>
            <dt className="t-label text-fg/60">{t.details.venue}</dt>
            <dd className="t-meta mt-1.5">
              {event.venue.name}
              {event.venue.city ? <span className="block text-fg/60 lg:inline lg:text-fg/60"><span className="hidden lg:inline">, </span>{event.venue.city}</span> : null}
            </dd>
          </div>
          {event.doorsTime || event.startTime ? (
            <div className="enter hidden md:block lg:col-span-2" style={{ ["--i" as string]: 4 }}>
              <dt className="t-label text-fg/60">{event.doorsTime ? t.details.doors : t.details.start}</dt>
              <dd className="t-meta mt-1.5 tabular">{event.doorsTime ?? event.startTime}</dd>
            </div>
          ) : null}
          </dl>
          <div
            className="enter col-span-2 md:col-span-3 flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between lg:col-span-4 lg:col-start-9 lg:flex-row lg:items-center lg:justify-end lg:gap-5 lg:pt-0"
            style={{ ["--i" as string]: 6 }}
          >
            {ticket.meta ? (
              <p className="t-label tabular text-fg/80 lg:text-right">{ticket.meta}</p>
            ) : null}
            <TicketButton {...cta} placement="hero" size="lg" className="w-full md:w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
