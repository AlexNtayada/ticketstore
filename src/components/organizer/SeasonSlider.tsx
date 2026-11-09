"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatDateParts } from "@/lib/organizer-utils";
import type { OrgSeason } from "@/types/organizer";

export interface NextDate {
  date: string;
  time: string;
  venue: string;
}

const AUTOPLAY_MS = 3500;

function when(date: string, time?: string) {
  const p = formatDateParts(date);
  const year = date.slice(0, 4);
  return `${p.day} ${p.month} ${year}${time ? ` · ${time}` : ""}`;
}

/**
 * Seasons as an auto-advancing card slider with a year toggle.
 * Pauses on hover/focus, off-screen and with reduced motion.
 */
export function SeasonSlider({ seasons, upcoming }: { seasons: OrgSeason[]; upcoming: Record<string, NextDate> }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const track = useRef<HTMLUListElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const season = seasons[idx] ?? seasons[0];

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const w = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * w, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => step(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, visible, step, idx]);

  useEffect(() => {
    track.current?.scrollTo({ left: 0 });
  }, [idx]);

  if (!season) return null;

  return (
    <div
      ref={root}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Alege stagiunea" className="season-toggle">
          {seasons.map((s, i) => (
            <button
              key={s.id}
              id={`tab-${s.id}`}
              role="tab"
              type="button"
              aria-selected={i === idx}
              aria-controls="season-panel"
              tabIndex={i === idx ? 0 : -1}
              onClick={() => setIdx(i)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                const n = (i + (e.key === "ArrowRight" ? 1 : seasons.length - 1)) % seasons.length;
                setIdx(n);
                document.getElementById(`tab-${seasons[n]?.id}`)?.focus();
              }}
            >
              <span className="tabular">{s.short}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <p className="t-label text-muted tabular">{season.shows.length} spectacole</p>
          <button type="button" onClick={() => step(-1)} className="season-arrow" aria-label="Înapoi">
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button type="button" onClick={() => step(1)} className="season-arrow" aria-label="Înainte">
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      <div id="season-panel" role="tabpanel" aria-labelledby={`tab-${season.id}`} className="mt-8">
        <h3 className="sr-only">{season.label}</h3>
        <ul
          key={season.id}
          ref={track}
          className="season-track -mx-[var(--gutter)] flex scroll-px-[var(--gutter)] snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[var(--gutter)] pb-2"
        >
          {season.shows.map((s, i) => {
            const next = idx === 0 && !s.date ? upcoming[s.show] : undefined;
            return (
              <li key={s.show} className="season-card w-[62vw] shrink-0 snap-start sm:w-[240px] lg:w-[260px]" style={{ ["--i" as string]: Math.min(i, 6) }}>
                <div className="relative aspect-[7/10] overflow-hidden rounded-[20px] bg-[#0b1220]">
                  {s.poster ? (
                    <Image src={s.poster} alt={`Afișul spectacolului ${s.title}`} fill sizes="(min-width: 640px) 260px, 62vw" className="object-cover" />
                  ) : null}
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    {s.note ? <p className="t-label mb-1.5 text-white/70">{s.note}</p> : null}
                    <p className="t-display-base text-[1.2rem] leading-tight">{s.title}</p>
                    {s.date ? (
                      <p className="t-label mt-2 tabular text-white/85">
                        {when(s.date, s.time)}
                        {s.venue ? <span className="block text-white/60">{s.venue}</span> : null}
                      </p>
                    ) : next ? (
                      <p className="t-label mt-2 tabular text-white/85">
                        Următoarea: {when(next.date, next.time)}
                        <span className="block text-white/60">{next.venue}</span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
