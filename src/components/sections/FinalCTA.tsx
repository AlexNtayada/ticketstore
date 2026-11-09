import Image from "next/image";
import type { PageModel } from "@/lib/page-model";
import { RevealMedia } from "../ui/RevealMedia";
import { RevealText } from "../ui/RevealText";
import { TicketButton } from "../ui/TicketButton";

/** The last frame of the campaign: accent ground, duotone image, one clear action. */
export function FinalCTA({ model }: { model: PageModel }) {
  const { event, t, ticket, cta, dates } = model;
  const headline = event.finalCta?.headline?.filter(Boolean) ?? [];
  const lines = headline.length ? headline : [event.artistName];
  const image = event.finalCta?.image ?? event.heroImage;
  const closed = ticket.status === "ended" || ticket.status === "cancelled";

  return (
    <section id="final-cta" aria-labelledby="final-title" className="relative isolate overflow-hidden bg-accent text-on-accent">
      <div className="frame relative grid-poster items-stretch gap-y-12 py-[clamp(80px,12vw,180px)]">
        <div className="relative z-10 col-span-4 flex flex-col md:col-span-6 lg:col-span-8">
          <RevealText
            id="final-title"
            lines={lines}
            className="t-display-base text-[clamp(3.8rem,11.5vw,11rem)] leading-[calc(var(--display-line-height)*0.98)]"
            lineClasses={["", "md:pl-[8%]"]}
          />

          <div className="mt-auto flex flex-col gap-8 pt-[clamp(40px,6vw,88px)] md:flex-row md:items-end md:justify-between">
            <dl className="t-meta space-y-1">
              <div>
                <dt className="sr-only">{t.details.date}</dt>
                <dd className="tabular">{dates.long}</dd>
              </div>
              <div>
                <dt className="sr-only">{t.details.venue}</dt>
                <dd>{event.venue.name}</dd>
              </div>
              {event.venue.city ? (
                <div>
                  <dt className="sr-only">{t.details.location}</dt>
                  <dd>{event.venue.city}</dd>
                </div>
              ) : null}
              {!closed && ticket.priceLabel ? (
                <div className="pt-3">
                  <dt className="sr-only">{t.details.tickets}</dt>
                  <dd className="tabular">{ticket.priceLabel}</dd>
                </div>
              ) : null}
            </dl>
            <TicketButton
              {...cta}
              label={ticket.href && ticket.status === "on_sale" ? t.cta.get : cta.label}
              placement="final"
              variant="dark"
              size="xl"
              className="w-full md:w-auto data-[misconfigured]:border-on-accent/50 [&[aria-disabled]]:border-on-accent/50 [&[aria-disabled]]:text-on-accent/70"
            />
          </div>
        </div>

        {image ? (
          <RevealMedia from="right" className="col-span-4 md:col-span-6 lg:col-span-4 lg:-mr-[var(--gutter)]">
            <div aria-hidden className="relative h-full min-h-[320px] overflow-hidden rounded-[var(--radius-media)] bg-on-accent lg:min-h-[560px]">
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover opacity-90 mix-blend-luminosity grayscale contrast-125"
              />
            </div>
          </RevealMedia>
        ) : null}
      </div>
    </section>
  );
}
