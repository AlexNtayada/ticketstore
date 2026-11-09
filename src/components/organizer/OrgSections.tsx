import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { mapsUrl } from "@/lib/organizer-utils";
import type { OrganizerConfig, ShowCategory } from "@/types/organizer";
import { NewsletterForm, ShowDatesButton } from "./OrgClient";
import { type NextDate, SeasonSlider } from "./SeasonSlider";
import { ShowGrid } from "./ShowGrid";

function SectionHead({ id, title, aside }: { id: string; title: string; aside?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <h2 id={id} className="t-display-base t-heading">
        {title}
      </h2>
      {aside}
    </div>
  );
}

export function Venues({ org }: { org: OrganizerConfig }) {
  return (
    <section id="sali" aria-labelledby="sali-title" className="org-section">
      <div className="frame">
        <SectionHead id="sali-title" title="Sălile" />
        <ul className="grid gap-5 md:grid-cols-2">
          {org.venues.map((v) => (
            <li key={v.name} className="org-card group flex flex-col overflow-hidden !p-0">
              {v.image ? (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={v.image.src}
                    alt={v.image.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
                    style={{ objectPosition: v.image.focus ?? "50% 50%" }}
                  />
                </div>
              ) : null}
              <div className="flex items-start justify-between gap-6 p-6">
                <div>
                  <p className="t-display-base t-sub">{v.name}</p>
                  <p className="t-label mt-2 flex items-start gap-1.5 text-muted">
                    <MapPin aria-hidden className="mt-[1px] size-3.5 shrink-0 text-accent" />
                    {v.address}
                  </p>
                </div>
                <a href={mapsUrl(v.name, v.address)} target="_blank" rel="noopener noreferrer" className="org-link t-label shrink-0">
                  Hartă <ArrowUpRight aria-hidden className="inline size-3.5" />
                  <span className="sr-only">(se deschide într-un tab nou)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Repertoire({ org, withDates }: { org: OrganizerConfig; withDates: Set<string> }) {
  return (
    <section id="repertoriu" aria-labelledby="repertoriu-title" className="org-section bg-surface">
      <div className="frame">
        <SectionHead id="repertoriu-title" title="Repertoriu" />
        <ul className="grid gap-5 md:grid-cols-3">
          {org.repertoire.map((r) => (
            <li key={r.show} className="org-card flex flex-col overflow-hidden !p-0">
              {r.image ? (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={r.image.src}
                    alt={r.image.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: r.image.focus ?? "50% 50%" }}
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="t-display-base t-sub">{r.title}</h3>
                <p className="t-body mt-2 flex-1">{r.description}</p>
                {withDates.has(r.show) ? (
                  <ShowDatesButton show={r.show} className="org-link t-label mt-5 self-start">
                    Vezi datele →
                  </ShowDatesButton>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const CATALOGUE_ORDER: ShowCategory[] = ["teatru", "concerte", "copii"];

export function Catalogue({ org, withDates }: { org: OrganizerConfig; withDates: Set<string> }) {
  const shows = CATALOGUE_ORDER.flatMap((cat) => org.catalogue.filter((s) => s.category === cat));
  return (
    <section id="spectacole" aria-labelledby="spectacole-title" className="org-section">
      <div className="frame">
        <SectionHead id="spectacole-title" title="Spectacole" />
        <ShowGrid shows={shows} withDates={[...withDates]} />
      </div>
    </section>
  );
}

export function Seasons({ org, upcoming }: { org: OrganizerConfig; upcoming: Record<string, NextDate> }) {
  return (
    <section id="stagiuni" aria-labelledby="stagiuni-title" className="org-section overflow-hidden bg-surface">
      <div className="frame">
        <SectionHead id="stagiuni-title" title="Stagiuni" aside={<p className="t-body max-w-md text-muted">Spectacolele fiecărei stagiuni, an de an.</p>} />
        <SeasonSlider seasons={org.seasons} upcoming={upcoming} />
      </div>
    </section>
  );
}

const MONTHS = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"];

export function Subscription({ org }: { org: OrganizerConfig }) {
  if (!org.subscription) return null;
  const { title, body, note } = org.subscription;
  return (
    <section id="abonament" aria-labelledby="abonament-title" className="org-section">
      <div className="frame">
        <div className="sub-panel grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <span className="sub-badge t-label">
              <span aria-hidden className="sub-badge-dot" />
              În curând
            </span>
            <h2 id="abonament-title" className="t-display-base t-heading mt-5">
              {title}
            </h2>
            <p className="mt-4 max-w-md font-display text-[clamp(1.25rem,2.2vw,1.9rem)] leading-snug">{body}</p>
            <p className="t-body mt-4 max-w-md text-white/70">{note}</p>
            <a href="#newsletter" className="cta mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-[#0b1220]">
              Anunță-mă când apare
              <ArrowUpRight aria-hidden className="size-4 rotate-90" />
            </a>
          </div>
          <div aria-hidden className="sub-year">
            <p className="t-label mb-4 text-white/60">12 luni · 12 seri</p>
            <ol className="grid grid-cols-4 gap-2.5 sm:grid-cols-6 lg:grid-cols-4">
              {MONTHS.map((m, i) => (
                <li key={m} className="sub-month" style={{ ["--i" as string]: i }}>
                  <span className="t-label">{m}</span>
                  <span className="sub-ticket" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsletterBand({ org }: { org: OrganizerConfig }) {
  if (!org.newsletter) return null;
  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="org-section">
      <div className="frame">
        <div className="org-panel">
          <h2 id="newsletter-title" className="t-display-base t-heading">
            {org.newsletter.title}
          </h2>
          <p className="t-body mt-3 max-w-xl text-muted">{org.newsletter.body}</p>
          <NewsletterForm demoNote={org.newsletter.demoNote} />
        </div>
      </div>
    </section>
  );
}

export function OrgFooter({ org, links }: { org: OrganizerConfig; links: { href: string; label: string }[] }) {
  const year = new Date().getFullYear();
  return (
    <footer id="site-footer" className="org-footer">
      <div className="frame pb-[calc(40px+env(safe-area-inset-bottom))] pt-20 md:pt-32">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="t-display-base text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.02]">{org.name}</p>
            <p className="mt-4 max-w-sm text-white/65">{org.description}</p>
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
            <p className="t-label text-white/45">Săli</p>
            <ul className="mt-4 grid gap-4">
              {org.venues.map((v) => (
                <li key={v.name}>
                  <a href={mapsUrl(v.name, v.address)} target="_blank" rel="noopener noreferrer" className="org-footer-link">
                    {v.name}
                    <span className="sr-only"> (hartă, se deschide într-un tab nou)</span>
                  </a>
                  <p className="t-label mt-1 text-white/50">{v.address}</p>
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

        <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-8 md:mt-28 md:flex-row md:items-center md:justify-between">
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
