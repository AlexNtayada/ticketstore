"use client";

import { ArrowRight, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CITY_EVENT, daysBetween, eventHref, formatDateParts, inDays, monthName, monthYear, price, todayIn, upcoming } from "@/lib/company-utils";
import { SHOW_FILTER_EVENT } from "@/lib/organizer-utils";
import type { CompanyConfig, CompanyEvent } from "@/types/company";
import { TicketButton } from "../ui/TicketButton";

type CityDetail = { city: string; visited: boolean };

/** `buildNow` keeps server and client output identical; the real time takes over after hydration. */
function useNow(buildNow: number) {
  const [now, setNow] = useState(buildNow);
  useEffect(() => setNow(Date.now()), []);
  return now;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─── Hero: next show line + city picker ──────────────────────────────── */

export function NextShow({ org, buildNow }: { org: CompanyConfig; buildNow: number }) {
  const now = useNow(buildNow);
  const e = upcoming(org, now).find((x) => !x.status) ?? null;
  if (!e) return null;
  const n = daysBetween(todayIn(org.timezone, now), e.date);
  const p = price(org, e.priceFrom);
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
      <p className="text-[1.02rem] leading-snug text-white/90">
        <span className="t-label mb-1.5 block text-white/55">Următorul spectacol</span>
        <span className="font-display text-[1.15rem] font-semibold text-white">{e.title}</span>
        <span className="text-white/75">
          {" "}
          · {e.city}, {inDays(n)} ({formatDateParts(e.date).day} {formatDateParts(e.date).month}, {e.time})
        </span>
      </p>
      <div className="flex shrink-0 items-center gap-4">
        {p ? <span className="t-label tabular text-white/75">{p}</span> : null}
        <TicketButton href={eventHref(org, e)} label="Bilete" placement="hero" eventId={e.id} target="_blank" srContext={`${e.title}, ${e.city}`} />
      </div>
    </div>
  );
}

export function CityPicker({ next, visited }: { next: string[]; visited: { city: string }[] }) {
  return (
    <label className="co-city flex items-center gap-3">
      <MapPin aria-hidden className="size-4 shrink-0 text-white/70" />
      <span className="sr-only">Alege orașul</span>
      <select
        defaultValue=""
        onChange={(ev) => {
          const city = ev.target.value;
          if (!city) return;
          const wasVisited = visited.some((v) => v.city === city);
          window.dispatchEvent(new CustomEvent<CityDetail>(CITY_EVENT, { detail: { city, visited: wasVisited } }));
          scrollToId(wasVisited ? "anunta" : "turneu");
          ev.target.value = "";
        }}
        className="min-w-0 flex-1 bg-transparent text-white outline-none"
      >
        <option value="">Alege orașul</option>
        <optgroup label="Urmează">
          {next.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </optgroup>
        <optgroup label="Am mai fost aici">
          {visited.map((c) => (
            <option key={c.city}>{c.city}</option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}

/* ─── Date rows ───────────────────────────────────────────────────────── */

function DateRow({ org, e, poster }: { org: CompanyConfig; e: CompanyEvent; poster?: string }) {
  const d = formatDateParts(e.date);
  const p = price(org, e.priceFrom);
  return (
    <li className="co-row">
      <div className="co-date" aria-hidden>
        <span className="co-date-day tabular">{d.day}</span>
        <span className="co-date-month">{d.month}</span>
      </div>
      <div className="relative hidden aspect-[7/10] w-14 shrink-0 overflow-hidden rounded-lg bg-surface sm:block">
        {poster ? <Image src={poster} alt="" fill sizes="56px" className="object-cover" /> : <div aria-hidden className="show-card-fallback size-full" />}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-[1.08rem] font-semibold leading-tight">
          <span className="sr-only">
            {d.weekday}, {d.day} {d.month}:{" "}
          </span>
          {e.title}
        </h3>
        <p className="mt-1 text-[0.92rem] text-muted">
          <span className="tabular">
            {d.weekday}, {e.time}
          </span>{" "}
          · {e.city}, {e.venue}
        </p>
      </div>
      <div className="co-row-cta">
        {e.status === "soldout" ? (
          <span className="co-status">Sold out</span>
        ) : e.status === "other" ? (
          <span className="co-status co-status-soft">Bilete prin alt canal</span>
        ) : (
          <>
            {p ? <span className="t-label tabular text-muted">{p}</span> : null}
            <TicketButton
              href={eventHref(org, e)}
              label="Bilete"
              placement="details"
              eventId={e.id}
              target="_blank"
              size="sm"
              srContext={`${e.title}, ${e.city}, ${d.day} ${d.month}`}
            />
          </>
        )}
      </div>
    </li>
  );
}

function usePosters(org: CompanyConfig) {
  return useMemo(() => new Map(org.shows.filter((s) => s.poster).map((s) => [s.slug, s.poster!])), [org.shows]);
}

/**
 * "<Luna> se joacă!": the rest of the current month, then "Tot calendarul"
 * opens every upcoming date grouped by month. "Vezi datele" buttons filter it by show.
 */
export function MonthCalendar({ org, buildNow }: { org: CompanyConfig; buildNow: number }) {
  const now = useNow(buildNow);
  const [all, setAll] = useState(false);
  const [show, setShow] = useState<string | null>(null);
  const posters = usePosters(org);

  useEffect(() => {
    const on = (ev: Event) => {
      setShow((ev as CustomEvent<string>).detail);
      setAll(true);
    };
    window.addEventListener(SHOW_FILTER_EVENT, on);
    return () => window.removeEventListener(SHOW_FILTER_EVENT, on);
  }, []);

  const list = upcoming(org, now);
  const month = list[0]?.date.slice(0, 7);
  const visible = list.filter((e) => (all ? true : e.date.slice(0, 7) === month) && (!show || e.show === show));
  const groups = visible.reduce<Record<string, CompanyEvent[]>>((acc, e) => {
    (acc[e.date.slice(0, 7)] ??= []).push(e);
    return acc;
  }, {});
  const showTitle = show ? org.shows.find((s) => s.slug === show)?.title : null;
  const title = month ? `${monthName(`${month}-01`)} se joacă!` : "Calendar";

  return (
    <section id="calendar" aria-labelledby="calendar-title" className="org-section">
      <div className="frame">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-label text-accent">Calendar</p>
            <h2 id="calendar-title" className="t-display-base t-heading mt-3">
              {all ? "Tot calendarul" : title}
            </h2>
          </div>
          <button type="button" onClick={() => setAll((v) => !v)} className="org-ghost self-start md:self-auto">
            {all ? title : `Tot calendarul · ${list.length} date`} <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>

        {showTitle ? (
          <p className="mt-6">
            <button type="button" onClick={() => setShow(null)} className="org-chip" aria-pressed="true">
              Doar: {showTitle}
              <X aria-hidden className="ml-1.5 size-3.5" />
              <span className="sr-only">(elimină filtrul)</span>
            </button>
          </p>
        ) : null}

        <div className="mt-8 space-y-10" aria-live="polite">
          {visible.length === 0 ? (
            <p className="org-card t-body mx-auto text-center">Nicio dată anunțată deocamdată.</p>
          ) : (
            Object.entries(groups).map(([m, items]) => (
              <div key={m}>
                {all ? <h3 className="t-label mb-3 text-muted">{monthYear(`${m}-01`)}</h3> : null}
                <ul className="org-card divide-y divide-line !p-0">
                  {items.map((e) => (
                    <DateRow key={e.id} org={org} e={e} poster={posters.get(e.show)} />
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Tour: city chips + stop cards ───────────────────────────────────── */

export function TourStops({ org, buildNow, cities }: { org: CompanyConfig; buildNow: number; cities: string[] }) {
  const now = useNow(buildNow);
  const [city, setCity] = useState<string>("");
  const posters = usePosters(org);

  useEffect(() => {
    const on = (ev: Event) => {
      const d = (ev as CustomEvent<CityDetail>).detail;
      if (!d.visited) setCity(d.city);
    };
    window.addEventListener(CITY_EVENT, on);
    return () => window.removeEventListener(CITY_EVENT, on);
  }, []);

  const list = upcoming(org, now).filter((e) => !city || e.city === city);

  return (
    <>
      <div role="group" aria-label="Oraș" className="flex flex-wrap gap-2">
        {["", ...cities].map((c) => (
          <button key={c || "toate"} type="button" aria-pressed={city === c} onClick={() => setCity(c)} className="org-chip">
            {c || "Toate"}
          </button>
        ))}
      </div>
      <ul className="co-stops mt-8" aria-live="polite">
        {list.map((e, i) => {
          const d = formatDateParts(e.date);
          const href = eventHref(org, e);
          const poster = posters.get(e.show);
          return (
            <li key={e.id} className="co-stop group" style={{ ["--i" as string]: i }}>
              <div className="relative aspect-[7/10] overflow-hidden rounded-[18px] bg-surface">
                {poster ? (
                  <Image
                    src={poster}
                    alt={`Afișul spectacolului ${e.title}`}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 768px) 30vw, 60vw"
                    className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
                  />
                ) : (
                  <div aria-hidden className="show-card-fallback flex size-full items-end p-4">
                    <span className="font-display text-[1.3rem] font-semibold leading-tight text-white">{e.title}</span>
                  </div>
                )}
                <span className="co-stop-date tabular" aria-hidden>
                  {d.day} {d.month}
                </span>
              </div>
              <p className="mt-3 font-display text-[1.35rem] font-semibold leading-tight">{e.city}</p>
              <p className="mt-1 text-[0.9rem] leading-snug text-muted">
                {e.title}
                <span className="block">
                  {d.weekday}, {d.day} {d.month}, {e.time}
                </span>
              </p>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="org-link t-label mt-2 inline-block">
                  Vezi bilete<span className="sr-only"> pentru {e.title}, {e.city} (se deschide într-un tab nou)</span>
                </a>
              ) : (
                <p className="t-label mt-2 text-muted">{e.status === "soldout" ? "Sold out" : "Bilete prin alt canal"}</p>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ─── Alert form ──────────────────────────────────────────────────────── */

export function AlertForm({ demoNote, cities }: { demoNote: string; cities: string[] }) {
  const [sent, setSent] = useState(false);
  const [city, setCity] = useState("");
  useEffect(() => {
    const on = (ev: Event) => {
      const d = (ev as CustomEvent<CityDetail>).detail;
      if (d.visited) setCity(d.city);
    };
    window.addEventListener(CITY_EVENT, on);
    return () => window.removeEventListener(CITY_EVENT, on);
  }, []);
  return (
    <form
      className="mt-8 grid gap-3 md:grid-cols-[1fr_1.4fr_auto]"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label className="org-input">
        <span className="sr-only">Orașul</span>
        <input name="city" list="co-cities" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Orașul" autoComplete="address-level2" required />
        <datalist id="co-cities">
          {cities.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>
      <label className="org-input">
        <span className="sr-only">Email</span>
        <input name="email" type="email" required placeholder="Email" autoComplete="email" />
      </label>
      <button type="submit" className="cta inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 font-semibold text-on-accent">
        Anunță-mă
      </button>
      <p role="status" className="t-label text-muted md:col-span-3">
        {sent ? demoNote : ""}
      </p>
    </form>
  );
}
