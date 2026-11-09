"use client";

import { useState } from "react";

/** Map iframe that loads only when the visitor asks for it (privacy + performance). */
export function MapEmbed({ url, title, label, notice }: { url: string; title: string; label: string; notice: string }) {
  const [active, setActive] = useState(false);
  let safe: string | null = null;
  try {
    safe = new URL(url).protocol === "https:" ? url : null;
  } catch {
    safe = null;
  }
  if (!safe) return null;
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-media)] border border-line bg-surface md:aspect-[21/8]">
      {active ? (
        <iframe src={safe} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 size-full border-0 grayscale" />
      ) : (
        <button type="button" onClick={() => setActive(true)} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <span className="t-label rounded-full border border-current px-5 py-3">{label}</span>
          <span className="text-sm text-muted">{notice}</span>
        </button>
      )}
    </div>
  );
}
