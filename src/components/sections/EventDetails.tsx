import type { ReactNode } from "react";
import { eventStartTimestamp, formatPrice, hasText } from "@/lib/event-utils";
import type { PageModel } from "@/lib/page-model";
import { isTicketstoreUrl } from "@/lib/ticketstore";
import { Countdown } from "../ui/Countdown";
import { SectionLabel } from "../ui/SectionLabel";
import { TicketButton } from "../ui/TicketButton";

function Row({ label, children, accent }: { label: string; children: ReactNode; accent?: boolean }) {
  return (
    <div className="grid grid-cols-4 gap-x-3 border-t border-line py-5 md:grid-cols-8 md:gap-x-6 md:py-7">
      <dt className="t-label col-span-4 mb-2 text-muted md:col-span-2 md:mb-0 md:pt-[0.6em]">{label}</dt>
      <dd className={`t-display-base t-sub col-span-4 md:col-span-6 ${accent ? "text-accent" : ""}`}>{children}</dd>
    </div>
  );
}

/** The information panel of the printed poster: a strict typographic grid, no cards. */
export function EventDetails({ model, index }: { model: PageModel; index: string }) {
  const { event, t, ticket, cta, dates } = model;
  const price = formatPrice(event);
  const target = eventStartTimestamp(event);
  const showCountdown = event.features.countdown && target !== null && (event.status === "on_sale" || event.status === "coming_soon");
  const products = (event.tickets ?? []).filter((p) => isTicketstoreUrl(p.url));
  const sameUrl = products.every((p) => p.url === event.ticketUrl);
  const alert = event.status === "cancelled" || event.status === "postponed" ? (event.statusNote ?? t.status[event.status]) : null;

  return (
    <section id="info" aria-labelledby="details-title" className="section-space relative">
      <div className="frame grid-poster gap-y-12">
        <div className="col-span-4 md:col-span-6 lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
            <SectionLabel index={index} label={t.sections.tickets} className="mb-8 text-muted" />
            <h2 id="details-title" className="t-display-base t-display max-w-[6ch]">
              {t.details.title}
            </h2>
            {showCountdown ? (
              <div className="mt-10">
                <Countdown target={target} labels={t.details} title={t.details.countdown} />
              </div>
            ) : null}
          </div>
        </div>

        <div className="col-span-4 md:col-span-6 lg:col-span-8">
          {alert ? (
            <p role="status" className="t-meta mb-8 border border-accent px-5 py-4 text-accent">
              {alert}
            </p>
          ) : null}
          <dl>
            <Row label={t.details.date}>
              <span className="tabular">{dates.long}</span>
              {dates.weekday ? <span className="t-label ml-4 align-middle font-sans text-muted">{dates.weekday}</span> : null}
            </Row>
            <Row label={t.details.venue}>{event.venue.name}</Row>
            {hasText(event.venue.city) ? (
              <Row label={t.details.location}>{[event.venue.city, event.venue.country].filter(Boolean).join(", ")}</Row>
            ) : null}
            {event.doorsTime ? (
              <Row label={t.details.doors}>
                <span className="tabular">{event.doorsTime}</span>
                {event.startTime ? (
                  <span className="ml-6 text-muted">
                    <span className="t-label mr-3 align-middle font-sans">{t.details.start}</span>
                    <span className="tabular">{event.startTime}</span>
                  </span>
                ) : null}
              </Row>
            ) : event.startTime ? (
              <Row label={t.details.start}>
                <span className="tabular">{event.startTime}</span>
              </Row>
            ) : null}
            {hasText(event.ageRestriction) ? <Row label={t.details.age}>{event.ageRestriction}</Row> : null}
            {ticket.status !== "on_sale" ? (
              <Row label={t.details.status} accent>
                {t.status[ticket.status]}
              </Row>
            ) : null}
            {products.length === 0 && price && ticket.priceLabel ? (
              <Row label={t.details.tickets} accent>
                <span className="tabular">{ticket.priceLabel}</span>
              </Row>
            ) : null}
          </dl>

          <div className="ticket-panel">
          {products.length > 0 ? (
            <ul className="border-t border-line">
              {products.map((p) => (
                <li key={p.url + p.label} className="flex flex-row items-center justify-between gap-4 border-b border-line py-5">
                  <div>
                    <p className="t-display-base t-sub">{p.label}</p>
                    {p.note ? <p className="t-label mt-1 text-muted">{p.note}</p> : null}
                  </div>
                  <div className="flex items-center gap-5">
                    {formatPrice(event, p.price) ? <span className="t-display-base t-sub tabular">{formatPrice(event, p.price)}</span> : null}
                    {/* Per-row buttons only when a category has its own link; otherwise one CTA below. */}
                    {!sameUrl ? <TicketButton {...cta} href={ticket.href ? (event.ticketMode === "presentation" ? ticket.href : p.url) : null} placement="details" variant="outline" /> : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-line pt-8 md:flex-row md:items-center md:justify-end md:gap-6">
            {event.availabilityNote ? <p className="t-label text-accent">{event.availabilityNote}</p> : null}
            <TicketButton {...cta} placement="details" size="lg" className="w-full md:w-auto" />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
