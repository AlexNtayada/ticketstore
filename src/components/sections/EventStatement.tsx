import type { PageModel } from "@/lib/page-model";
import { Marquee } from "../ui/Marquee";
import { RevealText } from "../ui/RevealText";
import { SectionLabel } from "../ui/SectionLabel";

/** Typography-led manifesto on the inverse ground: the poster flips to paper. */
export function EventStatement({ model, index }: { model: PageModel; index: string }) {
  const { event, t, dates } = model;
  const lines = (event.statement ?? []).filter(Boolean);
  const align = ["md:pl-[3%]", "pl-[8%] md:pl-[18%]", "text-right md:pr-[4%]"];

  return (
    <section aria-labelledby="statement-title" className="statement-band relative overflow-hidden bg-inverse text-on-inverse">
      <Marquee
        className="t-display-base border-b border-current/15 py-3 text-[clamp(1.25rem,2vw,1.75rem)]"
        items={[event.artistName, event.kicker ?? "", dates.numeric, event.venue.name, event.venue.city]}
      />
      <div className="frame section-space">
        <SectionLabel index={index} label={t.sections.statement} indexTone="inherit" className="mb-[clamp(40px,7vw,110px)] opacity-70" />
        <RevealText
          id="statement-title"
          lines={lines}
          drift={event.features.advancedMotion}
          className="t-display-base text-[clamp(3.2rem,12vw,12rem)] leading-[calc(var(--display-line-height)*0.98)]"
          lineClasses={align}
        />
      </div>
    </section>
  );
}
