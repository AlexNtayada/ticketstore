"use client";

import { useState } from "react";

/** Spotify player behind a consent-friendly facade. Premium (features.mediaEmbeds). */
export function SpotifyEmbed({ url, label, notice }: { url: string; label: string; notice: string }) {
  const [active, setActive] = useState(false);
  let safe: string | null = null;
  try {
    const u = new URL(url);
    if (u.hostname === "open.spotify.com" && u.pathname.startsWith("/embed/")) safe = u.toString();
  } catch {
    safe = null;
  }
  if (!safe) return null;
  return active ? (
    <iframe src={safe} title="Spotify" height={352} loading="lazy" allow="encrypted-media" className="w-full rounded-xl border-0" />
  ) : (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="flex h-[152px] w-full flex-col items-start justify-between border border-line p-6 text-left transition-colors hover:border-accent"
    >
      <span className="t-display-base t-sub">{label}</span>
      <span className="t-label text-muted">{notice} open.spotify.com</span>
    </button>
  );
}
