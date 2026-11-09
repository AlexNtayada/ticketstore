import { formatPrice } from "@/lib/event-utils";
import type { PageModel } from "@/lib/page-model";
import { isTicketstoreUrl, PRESENTATION_HREF } from "@/lib/ticketstore";
import { getThemeLayout } from "@/lib/theme";
import type { EventConfig } from "@/types/event";
import { SectionLabel } from "../ui/SectionLabel";
import { TicketButton } from "../ui/TicketButton";

function formatTourDate(event: EventConfig, date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  const loc = event.locale === "ro" ? "ro-RO" : "en-GB";
  return {
    day: new Intl.DateTimeFormat(loc, { day: "2-digit", timeZone: "UTC" }).format(d),
    month: new Intl.DateTimeFormat(loc, { month: "short", timeZone: "UTC" }).format(d).replace(".", ""),
    weekday: new Intl.DateTimeFormat(loc, { weekday: "long", timeZone: "UTC" }).format(d),
  };
}

/** Premium (features.multipleEvents): the same show in other cities, as a tour poster list. */
export function TourDates({ model, index }: { model: PageModel; index: string }) {
  const { event, t, cta } = model;
  const presentation = event.ticketMode === "presentation";
  const dates = (event.tourDates ?? [])
    .filter((d) => isTicketstoreUrl(d.ticketUrl))
    .sort((a, b) => (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? "")));
  if (!event.features.multipleEvents || dates.length < 2) return null;
  const cards = getThemeLayout(event) === "cards";

  return (
    <section id="tour" aria-labelledby="tour-title" className="section-space relative border-t border-line">
      <div className="frame">
        <div className="mb-[clamp(32px,5vw,72px)] flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index={index} label={t.sections.tour} className="mb-6 text-muted" />
            <h2 id="tour-title" className="t-display-base t-heading">{t.sections.tourTitle}</h2>
          </div>
          <p className="t-label tabular text-muted">({String(dates.length).padStart(2, "0")})</p>
        </div>
        <ol className={cards ? "grid gap-5 md:grid-cols-2 lg:grid-cols-3" : "border-t border-line"}>
          {dates.map((d) => {
            const f = formatTourDate(event, d.date);
            const current = d.ticketUrl === event.ticketUrl;
            const price = formatPrice(event, d.priceFrom);
            return (
              <li
                key={d.ticketUrl}
                aria-current={current ? "page" : undefined}
                className={
                  cards
                    ? `tour-card grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-4 rounded-[20px] border p-6 ${current ? "border-accent" : "border-line"}`
                    : "grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 border-b border-line py-6 md:grid-cols-[9rem_1fr_auto_auto] md:gap-x-10 md:py-8"
                }
              >
                {cards ? (
                  <p className="flex size-16 flex-col items-center justify-center rounded-2xl bg-accent/10 leading-none text-accent">
                    <span className="t-display-base text-[1.6rem] tabular">{f.day}</span>
                    <span className="t-label mt-1 font-sans">{f.month}</span>
                  </p>
                ) : (
                  <p className="t-display-base flex items-baseline gap-2 leading-none">
                    <span className="text-[clamp(2.6rem,5vw,4.5rem)] tabular">{f.day}</span>
                    <span className="t-label font-sans">{f.month}</span>
                  </p>
                )}
                <div className="min-w-0">
                  <p className="t-display-base t-sub">{d.city}</p>
                  <p className="t-label mt-1 text-muted">
                    {d.venue}
                    <span className={cards ? "block" : "hidden md:inline"}>{cards ? "" : " · "}{f.weekday}{d.time ? ` · ${d.time}` : ""}</span>
                  </p>
                  {current ? <p className="t-label mt-2 text-accent">{t.tour.current}</p> : null}
                </div>
                <p className={`t-label tabular col-start-2 text-muted ${cards ? "self-center" : "md:col-start-auto"}`}>{price ? `${t.tour.from} ${price}` : ""}</p>
                <div className={cards ? "col-span-2" : "col-span-2 md:col-span-1"}>
                  <TicketButton
                    {...cta}
                    href={presentation ? PRESENTATION_HREF : d.ticketUrl}
                    label={t.cta.buy}
                    misconfigured={false}
                    srContext={`${d.city}, ${f.day} ${f.month}`}
                    placement="details"
                    variant={current ? "accent" : "outline"}
                    className={cards ? "w-full" : "w-full md:w-auto"}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
