"use client";

import Image from "next/image";
import { useState } from "react";
import { CATEGORY_LABELS } from "@/lib/organizer-utils";
import type { OrgShow, ShowCategory } from "@/types/organizer";
import { ShowDatesButton } from "./OrgClient";

type Filter = ShowCategory | "toate";
const FILTERS: Filter[] = ["toate", "teatru", "concerte", "copii"];
const PAGE = 5;

/** Poster grid for the full catalogue: category chips, 5 shows at a time, "load more". */
export function ShowGrid({ shows, withDates }: { shows: OrgShow[]; withDates: string[] }) {
  const [filter, setFilter] = useState<Filter>("toate");
  const [count, setCount] = useState(PAGE);
  const dated = new Set(withDates);

  const list = filter === "toate" ? shows : shows.filter((s) => s.category === filter);
  const visible = list.slice(0, count);
  const left = list.length - visible.length;

  return (
    <>
      <div role="group" aria-label="Categorie" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const n = f === "toate" ? shows.length : shows.filter((s) => s.category === f).length;
          if (!n) return null;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => {
                setFilter(f);
                setCount(PAGE);
              }}
              className="org-chip gap-2"
            >
              {CATEGORY_LABELS[f]}
              <span className="tabular opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-5">
        {visible.map((s, i) => (
          <li key={s.slug} className="show-card group" style={{ ["--i" as string]: i % PAGE }}>
            <div className="relative aspect-[7/10] overflow-hidden rounded-[18px] bg-surface">
              {s.poster ? (
                <Image
                  src={s.poster}
                  alt={`Afișul spectacolului ${s.title}`}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
                />
              ) : (
                <div aria-hidden className="show-card-fallback flex size-full items-end p-4">
                  <span className="t-display-base text-[1.4rem] leading-tight text-white">{s.title}</span>
                </div>
              )}
              <span className="org-tag show-card-tag absolute left-3 top-3">{CATEGORY_LABELS[s.category]}</span>
            </div>
            <h3 className="mt-3 font-semibold leading-snug">{s.title}</h3>
            {s.subtitle ? <p className="t-label mt-1 line-clamp-2 text-muted">{s.subtitle}</p> : null}
            {dated.has(s.slug) ? (
              <ShowDatesButton show={s.slug} className="org-link t-label mt-2 inline-block">
                Vezi datele →
              </ShowDatesButton>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-center gap-3">
        <p role="status" className="t-label text-muted tabular">
          {visible.length} din {list.length} spectacole
        </p>
        {left > 0 ? (
          <button type="button" onClick={() => setCount((c) => c + PAGE)} className="org-chip !h-12 !px-6">
            Încarcă mai multe
          </button>
        ) : null}
      </div>
    </>
  );
}
