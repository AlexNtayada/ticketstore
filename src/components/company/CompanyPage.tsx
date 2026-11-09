import { ArrowUpRight, Quote } from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import type { NavLink } from "@/components/layout/MobileNavigation";
import { ShowDatesButton } from "@/components/organizer/OrgClient";
import { PresentationNotice } from "@/components/ui/PresentationNotice";
import { cities, eventHref, nextBuyable, upcoming } from "@/lib/company-utils";
import type { CompanyConfig, CompanyShow } from "@/types/company";
import { AlertForm, CityPicker, MonthCalendar, NextShow, TourStops } from "./CompanyClient";

function SectionHead({ id, kicker, title, aside }: { id: string; kicker: string; title: string; aside?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="t-label text-accent">{kicker}</p>
        <h2 id={id} className="t-display-base t-heading mt-3">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}

function Hero({ org, buildNow }: { org: CompanyConfig; buildNow: number }) {
  const { image } = org.hero;
  const c = cities(org, buildNow);
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate flex min-h-[max(640px,100svh)] flex-col overflow-hidden bg-bg">
      <div className="hero-media absolute inset-0 -z-10">
        <Image src={image.src} alt={image.alt} fill priority sizes="100vw" quality={78} className="object-cover" style={{ objectPosition: image.focus ?? "50% 50%" }} />
      </div>
      <div className="frame relative flex flex-1 flex-col pb-[clamp(20px,4vh,44px)] pt-[calc(var(--header-h)+40px)]">
        <div className="my-auto py-8 text-center">
          <p className="t-label enter text-white/75" style={{ ["--i" as string]: 0 }}>
            Teatru independent · în turneu prin țară
          </p>
          <h1 id="hero-title" className="t-display-base mx-auto mt-4 max-w-[18ch] text-[clamp(2.4rem,5.4vw,4.6rem)] !leading-[1.04] text-white">
            <span className="mask-line hero-anim">
              <span>
                {org.name}
                <span aria-hidden className="text-accent">
                  .
                </span>
              </span>
            </span>
          </h1>
          <p className="enter mx-auto mt-4 max-w-[36ch] font-sans text-[clamp(1.1rem,1.7vw,1.45rem)] text-white/85" style={{ ["--i" as string]: 1 }}>
            {org.tagline}
          </p>
          <div className="enter mx-auto mt-8 flex max-w-md flex-col items-stretch gap-3 sm:flex-row sm:justify-center" style={{ ["--i" as string]: 2 }}>
            <a href="#calendar" className="cta inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 font-semibold text-on-accent">
              Vezi calendarul
            </a>
            <a href="#spectacole" className="co-ghost-light inline-flex h-12 items-center justify-center rounded-full px-6 font-semibold">
              Spectacole
            </a>
          </div>
        </div>

        <div className="org-hero-meta enter grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8" style={{ ["--i" as string]: 3 }}>
          <NextShow org={org} buildNow={buildNow} />
          <div className="lg:w-64 lg:border-l lg:border-white/15 lg:pl-8">
            <CityPicker next={c.next} visited={c.visited} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Company({ org }: { org: CompanyConfig }) {
  return (
    <section id="compania" aria-labelledby="compania-title" className="org-section bg-surface">
      <div className="frame grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div>
          <p className="t-label text-accent">Compania</p>
          <h2 id="compania-title" className="t-display-base t-heading mt-3">
            Oamenii din spatele cortinei
          </h2>
          <p className="mt-5 max-w-md text-[1.15rem] leading-relaxed text-fg">{org.about.intro}</p>
          <p className="t-body mt-6">
            <span className="font-semibold text-fg">Pe scenă, alături de ei: </span>
            {org.about.ensemble.join(" · ")}
          </p>
        </div>
        <ul className="grid grid-cols-3 gap-3 md:gap-6">
          {org.about.people.map((p) => (
            <li key={p.name} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-white">
                <Image src={p.photo} alt={p.name} fill sizes="(min-width: 1024px) 18vw, 32vw" className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04]" />
              </div>
              <p className="mt-3 font-display text-[clamp(0.95rem,1.4vw,1.2rem)] font-semibold leading-tight">{p.name}</p>
              <p className="t-label mt-1 text-muted">{p.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Spotlight({ org, dated }: { org: CompanyConfig; dated: Set<string> }) {
  return (
    <section id="acum" aria-labelledby="acum-title" className="org-section">
      <div className="frame">
        <SectionHead id="acum-title" kicker="În turneu" title="Pe scenă acum" />
        <ul className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:grid-rows-2">
          {org.spotlight.map((s, i) => {
            const show = org.shows.find((x) => x.slug === s.show);
            return (
              <li key={s.show} className={`co-spot group ${i === 0 ? "lg:row-span-2" : ""}`}>
                <Image
                  src={s.image.src}
                  alt={s.image.alt}
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
                  className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
                />
                <div className="co-spot-body">
                  <span className="org-tag show-card-tag">{show?.category === "concerte" ? "Concert" : "Teatru"}</span>
                  <h3 className={`mt-3 font-display font-semibold leading-tight text-white ${i === 0 ? "text-[clamp(1.6rem,3vw,2.6rem)]" : "text-[clamp(1.4rem,2vw,1.9rem)]"}`}>
                    {show?.title}
                  </h3>
                  <p className="mt-2 max-w-md text-white/80">{s.pitch}</p>
                  {dated.has(s.show) ? (
                    <ShowDatesButton show={s.show} className="co-ghost-light mt-4 inline-flex h-10 items-center rounded-full px-4 text-[0.875rem] font-semibold">
                      Vezi datele →
                    </ShowDatesButton>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function RepertoireColumn({ title, shows, dated }: { title: string; shows: CompanyShow[]; dated: Set<string> }) {
  return (
    <div>
      <h3 className="t-label mb-4 flex items-center justify-between text-muted">
        {title} <span className="tabular">{shows.length}</span>
      </h3>
      <ul className="org-card divide-y divide-line !p-0">
        {shows.map((s) => (
          <li key={s.slug} className="group flex items-center gap-4 px-4 py-3">
            <div className="relative aspect-[7/10] w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
              {s.poster ? (
                <Image src={s.poster} alt="" fill sizes="48px" className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.08]" />
              ) : (
                <div aria-hidden className="show-card-fallback size-full" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[1.05rem] font-semibold leading-tight">{s.title}</p>
              {s.credit ? <p className="mt-0.5 text-[0.88rem] text-muted">{s.credit}</p> : null}
            </div>
            {dated.has(s.slug) ? (
              <ShowDatesButton show={s.slug} className="org-link t-label shrink-0">
                Date →
              </ShowDatesButton>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Repertoire({ org, dated }: { org: CompanyConfig; dated: Set<string> }) {
  return (
    <section id="spectacole" aria-labelledby="spectacole-title" className="org-section bg-surface">
      <div className="frame">
        <SectionHead
          id="spectacole-title"
          kicker="Repertoriu"
          title="Spectacole"
          aside={<p className="t-body max-w-sm text-muted">Piese de teatru și concerte. Cele cu date anunțate au link spre calendar.</p>}
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <RepertoireColumn title="Teatru" shows={org.shows.filter((s) => s.category === "teatru")} dated={dated} />
          <RepertoireColumn title="Concerte" shows={org.shows.filter((s) => s.category === "concerte")} dated={dated} />
        </div>
      </div>
    </section>
  );
}

function Tour({ org, buildNow }: { org: CompanyConfig; buildNow: number }) {
  const c = cities(org, buildNow);
  return (
    <section id="turneu" aria-labelledby="turneu-title" className="org-section overflow-hidden">
      <div className="frame">
        <SectionHead
          id="turneu-title"
          kicker="Turneul"
          title="Venim în orașul tău"
          aside={
            <p className="co-stat">
              <span className="co-stat-num tabular">{c.all}</span>
              <span>
                orașe
                <br />
                în doi ani
              </span>
            </p>
          }
        />
        <TourStops org={org} buildNow={buildNow} cities={c.next} />
        <div className="mt-14 border-t border-line pt-8">
          <h3 className="t-label text-muted">Am mai fost aici</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {c.visited.map((v) => (
              <li key={v.city} className="co-pill">
                {v.city}
                <span className="tabular text-muted">{v.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Press({ org }: { org: CompanyConfig }) {
  return (
    <section id="presa" aria-labelledby="presa-title" className="co-press">
      <div className="frame">
        <h2 id="presa-title" className="sr-only">
          Presa despre noi
        </h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {org.press.map((p) => (
            <li key={p.href} className="co-quote">
              <Quote aria-hidden className="size-7 text-accent" />
              <blockquote className="mt-4 font-display text-[clamp(1.15rem,1.6vw,1.4rem)] font-medium leading-snug">„{p.quote}”</blockquote>
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="org-link t-label mt-6 inline-flex items-center gap-1.5">
                {p.source} <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(se deschide într-un tab nou)</span>
              </a>
              {p.note ? <p className="t-label mt-1 !normal-case !tracking-normal text-muted">{p.note}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Gallery({ org }: { org: CompanyConfig }) {
  return (
    <section id="galerie" aria-labelledby="galerie-title" className="org-section">
      <div className="frame">
        <SectionHead id="galerie-title" kicker="Galerie" title="Din spectacole" aside={<p className="t-label text-muted">{org.gallery.credit}</p>} />
        <ul className="co-gallery">
          {org.gallery.images.map((g) => (
            <li key={g.src} className="group">
              <figure className="relative size-full overflow-hidden rounded-[20px] bg-surface">
                <Image src={g.src} alt={`Scenă din ${g.alt}`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04]" />
                <figcaption className="co-caption">{g.alt}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Alert({ org, cityList }: { org: CompanyConfig; cityList: string[] }) {
  return (
    <section id="anunta" aria-labelledby="anunta-title" className="org-section !pt-0">
      <div className="frame">
        <div className="org-panel">
          <h2 id="anunta-title" className="t-display-base t-heading">
            {org.alert.title}
          </h2>
          <p className="t-body mt-3 max-w-xl text-muted">{org.alert.body}</p>
          <AlertForm demoNote={org.alert.demoNote} cities={cityList} />
        </div>
      </div>
    </section>
  );
}

function Footer({ org, links }: { org: CompanyConfig; links: NavLink[] }) {
  const year = new Date().getFullYear();
  return (
    <footer id="site-footer" className="org-footer">
      <div className="frame pb-[calc(40px+env(safe-area-inset-bottom))] pt-20 md:pt-28">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <p className="t-display-base text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">{org.name}</p>
            <p className="mt-4 max-w-sm text-white/65">{org.tagline}</p>
          </div>
          <nav aria-label="Subsol">
            <p className="t-label text-white/45">Pe site</p>
            <ul className="mt-4 grid gap-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="org-footer-link">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="t-label text-white/45">Urmărește-ne</p>
            <ul className="mt-4 grid gap-3">
              {org.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="org-footer-link inline-flex items-center gap-1.5">
                    {s.label} <ArrowUpRight aria-hidden className="size-3.5" />
                    <span className="sr-only">(se deschide într-un tab nou)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-label text-white/45">Bilete</p>
            <a href="https://ticketstore.ro/ro" target="_blank" rel="noopener noreferrer" className="org-footer-ts mt-4">
              <Image src="/icons/ts-48.png" alt="" width={28} height={28} className="rounded-md" />
              <span>
                {org.footerNote}
                <span className="block text-[0.8rem] text-white/50">ticketstore.ro</span>
              </span>
              <ArrowUpRight aria-hidden className="ml-auto size-4" />
              <span className="sr-only">(se deschide într-un tab nou)</span>
            </a>
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="t-label text-white/45">
            © {year} {org.name}
          </p>
          <a href="#top" className="org-footer-link t-label inline-flex items-center gap-2">
            Înapoi sus <ArrowUpRight aria-hidden className="size-3.5 -rotate-45" />
          </a>
        </div>
      </div>
    </footer>
  );
}

/** Touring company minisite, built from a CompanyConfig (structure of ejump minisites/dist/301). */
export function CompanyPage({ org }: { org: CompanyConfig }) {
  // Static export: "now" is the build time; client parts re-check in the browser.
  const buildNow = Date.now();
  const next = nextBuyable(org, buildNow);
  const dated = new Set(upcoming(org, buildNow).map((e) => e.show));
  const c = cities(org, buildNow);
  const links: NavLink[] = [
    { href: "#calendar", label: "Calendar" },
    { href: "#compania", label: "Compania" },
    { href: "#spectacole", label: "Spectacole" },
    { href: "#turneu", label: "Turneu" },
    { href: "#galerie", label: "Galerie" },
  ];
  return (
    <>
      <a href="#content" className="t-label sr-only z-[80] bg-accent px-4 py-3 text-on-accent focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Sari la conținut
      </a>
      <Header
        brand={org.shortName ?? org.name}
        layout="edges"
        links={links}
        menuLabel="Meniu"
        closeLabel="Închide"
        meta={next ? `${next.title} · ${next.city}` : org.name}
        ticket={{
          href: next ? eventHref(org, next) : null,
          label: "Cumpără bilete",
          eventId: next?.id ?? "company",
          target: "_blank",
          srContext: next ? `${next.title}, ${next.city}` : undefined,
        }}
      />
      <main id="top">
        <Hero org={org} buildNow={buildNow} />
        <div id="content" tabIndex={-1} className="outline-none">
          <MonthCalendar org={org} buildNow={buildNow} />
          <Company org={org} />
          <Spotlight org={org} dated={dated} />
          <Repertoire org={org} dated={dated} />
          <Tour org={org} buildNow={buildNow} />
          <Press org={org} />
          <Gallery org={org} />
          <Alert org={org} cityList={[...c.next, ...c.visited.map((v) => v.city)]} />
        </div>
      </main>
      <Footer org={org} links={links} />
      {org.ticketMode === "presentation" ? <PresentationNotice message="Site de prezentare: butoanele de bilete nu duc nicăieri." /> : null}
    </>
  );
}
