interface MarqueeProps {
  items: string[];
  className?: string;
  duration?: number;
}

/** Running poster strip. Decorative duplicate of on-page info, so hidden from assistive tech. */
export function Marquee({ items, className = "", duration = 38 }: MarqueeProps) {
  const clean = items.filter(Boolean);
  if (!clean.length) return null;
  const run = [...clean, ...clean, ...clean];
  return (
    <div aria-hidden className={`marquee overflow-hidden whitespace-nowrap ${className}`}>
      <div className="marquee-track flex w-max" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {run.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="px-[0.5em]">{item}</span>
                <span className="inline-block size-[0.32em] rotate-45 bg-current opacity-80" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
