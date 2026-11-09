"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  target: number;
  labels: { days: string; hours: string; minutes: string };
  title: string;
}

/**
 * Premium countdown to doors/show time. Rendered only after mount so server
 * and client markup always match (no hydration mismatch).
 */
export function Countdown({ target, labels, title }: CountdownProps) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Reserve the space before mount (no layout shift); render nothing once the show has started.
  if (now === null) return <span aria-hidden className="block h-[4.5rem]" />;
  if (target <= now) return null;
  const diff = target - now;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const parts = [
    [days, labels.days],
    [hours, labels.hours],
    [minutes, labels.minutes],
  ] as const;

  return (
    <span className="block">
    <span className="t-label mb-3 block text-muted">{title}</span>
    <span className="flex items-baseline gap-5 tabular">
      {parts.map(([v, l]) => (
        <span key={l} className="flex items-baseline gap-1.5">
          <span className="t-display-base t-sub">{String(v).padStart(2, "0")}</span>
          <span className="t-label text-muted">{l}</span>
        </span>
      ))}
    </span>
    </span>
  );
}
