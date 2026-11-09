"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import type { FAQItem } from "@/types/event";

interface FAQProps {
  items: FAQItem[];
  title: string;
  label: string;
  index: string;
}

/** Accessible disclosure accordion (button + region). Several items may be open. */
export function FAQ({ items, title, label, index }: FAQProps) {
  const verified = items.filter((f) => f.question.trim() && f.answer.trim());
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const uid = useId();
  if (!verified.length) return null;

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section id="faq" aria-labelledby={`${uid}-title`} className="section-space relative border-t border-line">
      <div className="frame grid-poster gap-y-10">
        <div className="col-span-4 md:col-span-6 lg:col-span-4">
          <p className="t-label mb-6 flex items-center gap-3 text-muted">
            <span className="tabular text-accent">{index}</span>
            <span aria-hidden className="h-px w-8 bg-current opacity-40" />
            <span>{label}</span>
          </p>
          <h2 id={`${uid}-title`} className="t-display-base t-heading max-w-[8ch]">
            {title}
          </h2>
        </div>
        <ul className="col-span-4 md:col-span-6 lg:col-span-8">
          {verified.map((f, i) => {
            const isOpen = open.has(i);
            const btn = `${uid}-q${i}`;
            const panel = `${uid}-a${i}`;
            return (
              <li key={f.question} className="border-t border-line last:border-b">
                <h3>
                  <button
                    id={btn}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => toggle(i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
                  >
                    <span className="text-[clamp(1.05rem,1.5vw,1.35rem)] font-semibold leading-snug">{f.question}</span>
                    <span
                      aria-hidden
                      className={`grid size-10 shrink-0 place-items-center rounded-full border border-line transition-[transform,background-color,color] duration-[var(--motion-normal)] ease-expo group-hover:border-fg ${
                        isOpen ? "rotate-45 border-accent bg-accent text-on-accent" : ""
                      }`}
                    >
                      <Plus className="size-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={panel}
                  role="region"
                  aria-labelledby={btn}
                  hidden={!isOpen}
                  className="pb-7 pr-16"
                >
                  <p className="t-body">{f.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
