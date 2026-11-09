import type { EventConfig } from "@/types/event";
import { formatEventDate, formatWeekday, getSectionVisibility } from "./event-utils";
import { getDictionary, type Dictionary } from "./i18n";
import { getTicketState, type TicketState } from "./ticketstore";

/** Derived, display-ready data shared by every section. Built once per render. */
export interface PageModel {
  event: EventConfig;
  t: Dictionary;
  ticket: TicketState;
  /** Spread into <TicketButton>; add `placement`. */
  cta: {
    href: string | null;
    label: string;
    eventId: string;
    target: "_self" | "_blank";
    misconfigured: boolean;
    srContext: string;
  };
  dates: { long: string; short: string; numeric: string; weekday: string };
  place: string;
  visible: ReturnType<typeof getSectionVisibility>;
}

export function buildPageModel(event: EventConfig): PageModel {
  const t = getDictionary(event.locale);
  const ticket = getTicketState(event);
  const dates = {
    long: formatEventDate(event, "long"),
    short: formatEventDate(event, "short"),
    numeric: formatEventDate(event, "numeric"),
    weekday: formatWeekday(event),
  };
  return {
    event,
    t,
    ticket,
    cta: {
      href: ticket.href,
      label: ticket.label,
      eventId: event.id,
      target: event.ticketLinkTarget ?? "_self",
      misconfigured: ticket.misconfigured,
      srContext: [event.eventName || event.artistName, dates.long].filter(Boolean).join(", "),
    },
    dates,
    place: [event.venue.name, event.venue.city].filter(Boolean).join(", "),
    visible: getSectionVisibility(event),
  };
}
