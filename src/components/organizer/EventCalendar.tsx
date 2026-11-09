"use client";

import { MapPin, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  formatDayHeading,
  priceLabel,
  SHOW_FILTER_EVENT,
  sortEvents,
  ticketHref,
  todayIn,
  upcomingEvents,
} from "@/lib/organizer-utils";
import type { OrganizerConfig, ShowCategory } from "@/types/organizer";
import { TicketButton } from "../ui/TicketButton";

type Category = ShowCategory | "toate";
const CATEGORIES: Category[] = ["toate", "teatru", "concerte", "copii"];

/**
 * "Next 30 days" calendar with category, venue and show filters.
 * `buildNow` keeps server and client output identical on first render;
 * the real current time takes over after hydration, so past dates drop off.
 */
export function EventCalendar({ org, buildNow }: { org: OrganizerConfig; buildNow: number }) {
  const [now, setNow] = useState(buildNow);
  const [category, setCategory] = useState<Category>("toate");
  const [venue, setVenue] = useState("");
  const [show, setShow] = useState<string | null>(null);
  const [all, setAll] = useState(false);

  useEffect(() => setNow(Date.now()), []);
  useEffect(() => {
    const onFilter = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      setShow(slug);
      setCategory("toate");
      setVenue("");
      setAll(true);
    };
    window.addEventListener(SHOW_FILTER_EVENT, onFilter);
    return () => window.removeEventListener(SHOW_FILTER_EVENT, onFilter);
  }, []);

  const base = useMemo(() => {
    if (!all) return upcomingEvents(org, now);
    const today = todayIn(org.timezone, now);
    return sortEvents(org.events).filter((e) => e.date >= today);
  }, [org, now, all]);
  const venues = useMemo(() => [...new Set(org.events.map((e) => e.venue))].sort((a, b) => a.localeCompare(b, "ro")), [org.events]);

  const list = base.filter(
    (e) => (category === "toate" || e.category === category) && (!venue || e.venue === venue) && (!show || e.show === show),
  );
  const days = list.reduce<Record<string, typeof list>>((acc, e) => {
    (acc[e.date] ??= []).push(e);
    return acc;
  }, {});
  // Poster per show: catalogue first, then season line-ups (some current shows are only listed there).
  const posters = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of org.seasons.flatMap((x) => x.shows)) if (s.poster) m.set(s.show, s.poster);
    for (const c of org.catalogue) if (c.poster) m.set(c.slug, c.poster);
    return m;
  }, [org.catalogue, org.seasons]);
  const showTitle = show ? org.events.find((e) => e.show === show)?.title : null;

  return (
    <section id="calendar" aria-labelledby="calendar-title" className="org-section">
      <div className="frame">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="calendar-title" className="t-display-base t-heading">
            {all ? "Tot calendarul" : org.calendar.title}
          </h2>
          <button type="button" onClick={() => setAll((v) => !v)} className="org-ghost self-start md:self-auto">
            {all ? org.calendar.title : "Tot calendarul"} →
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Categorie" className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className="org-chip"
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
          <label className="org-select t-label flex items-center gap-3">
            <select aria-label="Sala" value={venue} onChange={(e) => setVenue(e.target.value)} className="min-w-0 flex-1 bg-transparent text-fg lg:w-72">
              <option value="">Toate sălile</option>
              {venues.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>

        {showTitle ? (
          <p className="mt-4">
            <button type="button" onClick={() => setShow(null)} className="org-chip" aria-pressed="true">
              Doar: {showTitle}
              <X aria-hidden className="ml-1.5 size-3.5" />
              <span className="sr-only">(elimină filtrul)</span>
            </button>
          </p>
        ) : null}

        <div className="mt-8 space-y-5" aria-live="polite">
          {Object.keys(days).length === 0 ? (
            <p className="org-card t-body text-center">Niciun eveniment pentru filtrele alese.</p>
          ) : (
            Object.entries(days).map(([date, items]) => (
              <div key={date} className="grid gap-2 md:grid-cols-[11rem_1fr] md:gap-6">
                <h3 className="t-label pt-1 text-muted md:pt-5">{formatDayHeading(date)}</h3>
                <ul className="org-card divide-y divide-line !p-0">
                  {items.map((e) => {
                    const price = priceLabel(org, e.priceFrom);
                    return (
                      <li key={e.id} className="grid grid-cols-[3.25rem_1fr] items-center gap-x-4 gap-y-3 px-3 py-3 md:grid-cols-[3.25rem_4rem_1fr_auto] md:px-4">
                        <div className="relative aspect-[7/10] overflow-hidden rounded-lg bg-surface md:row-span-1">
                          {posters.get(e.show) ? (
                            <Image src={posters.get(e.show)!} alt="" fill sizes="52px" className="object-cover" />
                          ) : null}
                        </div>
                        <p className="t-display-base hidden text-[1.15rem] tabular text-accent md:block">{e.time}</p>
                        <div className="min-w-0">
                          <p className="t-display-base mb-0.5 text-[0.95rem] tabular text-accent md:hidden">{e.time}</p>
                          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span className="font-display text-[1.05rem] font-semibold leading-tight">{e.title}</span>
                            <span className="org-tag">{CATEGORY_LABELS[e.category]}</span>
                          </p>
                          <p className="t-label mt-1 flex items-start gap-1.5 text-muted">
                            <MapPin aria-hidden className="mt-[1px] size-3.5 shrink-0" />
                            <span className="min-w-0 truncate">
                              {e.city}, {e.venue}
                            </span>
                          </p>
                        </div>
                        <div className="col-span-2 flex items-center justify-between gap-4 md:col-span-1 md:justify-end">
                          {price ? <p className="t-label tabular text-muted">{price}</p> : null}
                          <TicketButton
                            href={ticketHref(org, e.ticketUrl)}
                            label="Bilete"
                            placement="details"
                            eventId={e.id}
                            target="_blank"
                            size="sm"
                            srContext={`${e.title}, ${e.city}, ${formatDayHeading(e.date)}`}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
