import { ArrowUpRight } from "lucide-react";
import type { PageModel } from "@/lib/page-model";
import { hasText } from "@/lib/event-utils";
import { Newsletter } from "../ui/Newsletter";

const socialLabels: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  spotify: "Spotify",
  tiktok: "TikTok",
  website: "Website",
};

export function Footer({ model }: { model: PageModel }) {
  const { event, t } = model;
  const socials = Object.entries(event.socialLinks).filter(([, url]) => hasText(url) && /^https:\/\//.test(url!));
  const org = event.organizer;
  const legal = [
    hasText(event.legal?.privacyUrl) ? { href: event.legal!.privacyUrl!, label: t.footer.privacy } : null,
    hasText(event.legal?.termsUrl) ? { href: event.legal!.termsUrl!, label: t.footer.terms } : null,
  ].filter((l): l is { href: string; label: string } => !!l);
  const showBranding = !event.features.removeTicketstoreBranding;
  const newsletter = event.features.newsletter && event.newsletter?.actionUrl ? event.newsletter : null;

  return (
    <footer id="site-footer" className="relative border-t border-line pb-[calc(88px+env(safe-area-inset-bottom))] pt-16 md:pb-10 md:pt-24">
      <div className="frame">
        {newsletter ? (
          <div className="mb-16 border-b border-line pb-16">
            <Newsletter config={newsletter} labels={t.newsletter} />
          </div>
        ) : null}

        <div className="grid-poster gap-y-10">
          <div className="col-span-4 md:col-span-6 lg:col-span-5">
            <p className="t-display-base text-[clamp(3rem,7vw,6rem)] leading-[calc(var(--display-line-height)*0.98)]">
              {event.artistName}
              <span aria-hidden className="text-accent">.</span>
            </p>
          </div>

          {socials.length ? (
            <nav aria-label="Social" className="col-span-2 md:col-span-2 lg:col-span-2 lg:col-start-7">
              <ul className="space-y-2">
                {socials.map(([key, url]) => (
                  <li key={key}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="t-label inline-flex items-center gap-1.5 hover:text-accent">
                      {socialLabels[key] ?? key}
                      <ArrowUpRight aria-hidden className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {org && (hasText(org.email) || hasText(org.phone) || hasText(org.name)) ? (
            <div className="col-span-2 md:col-span-2 lg:col-span-3 lg:col-start-10">
              <p className="t-label mb-3 text-muted">{t.footer.organizer}</p>
              <p className="text-sm">{org.name}</p>
              {org.legalName ? <p className="text-sm text-muted">{org.legalName}</p> : null}
              {org.registration ? <p className="text-sm text-muted">{org.registration}</p> : null}
              {hasText(org.email) ? (
                <a href={`mailto:${org.email}`} className="block text-sm underline-offset-4 hover:underline">
                  {org.email}
                </a>
              ) : null}
              {hasText(org.phone) ? (
                <a href={`tel:${org.phone!.replace(/\s+/g, "")}`} className="block text-sm underline-offset-4 hover:underline">
                  {org.phone}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-fg">
                  {l.label}
                </a>
              </li>
            ))}
            {event.isDemo ? <li>{t.demo}</li> : null}
          </ul>
          {showBranding ? (
            <p>
              {t.footer.poweredBy}{" "}
              <a href="https://www.ticketstore.ro" className="font-semibold text-fg/80 hover:text-accent">
                Ticketstore.ro
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
