interface SectionLabelProps {
  index: string;
  label: string;
  className?: string;
  as?: "p" | "h2";
  id?: string;
  /** Use "inherit" on accent / inverse grounds where the accent would vanish. */
  indexTone?: "accent" | "inherit";
}

/** Poster-style index label: "04 — The details". */
export function SectionLabel({ index, label, className = "", as: Tag = "p", id, indexTone = "accent" }: SectionLabelProps) {
  return (
    <Tag id={id} className={`t-label flex items-center gap-3 ${className}`}>
      <span className={`tabular ${indexTone === "accent" ? "text-accent" : ""}`}>{index}</span>
      <span aria-hidden className="h-px w-8 bg-current opacity-40" />
      <span>{label}</span>
    </Tag>
  );
}
