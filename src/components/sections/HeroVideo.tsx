"use client";

import { useEffect, useRef, useState } from "react";

interface HeroVideoProps {
  src: string;
  type?: string;
  poster: string;
}

/**
 * Premium background video. Muted, inline, looping, never with audio.
 * Only attaches a source on wide screens, without reduced motion or
 * data-saver, so phones never download it; the poster image stays underneath.
 */
export function HeroVideo({ src, type = "video/mp4", poster }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => setEnabled(wide.matches && !reduced.matches && !conn?.saveData);
    update();
    wide.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (enabled) v.play().catch(() => undefined);
    else v.pause();
  }, [enabled]);

  if (!enabled) return null;
  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden
      tabIndex={-1}
    >
      <source src={src} type={type} />
    </video>
  );
}
