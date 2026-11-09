"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { MediaImage } from "@/types/event";
import { TicketButton, type TicketButtonProps } from "../ui/TicketButton";
import { MobileNavigation, type NavLink } from "./MobileNavigation";

interface HeaderProps {
  brand: string;
  logo?: MediaImage;
  links: NavLink[];
  menuLabel: string;
  closeLabel: string;
  meta: string;
  ticket: Omit<TicketButtonProps, "placement">;
  /** "edges": logo and ticket button pinned to the viewport edges, links centered. */
  layout?: "frame" | "edges";
}

/**
 * Transparent over the hero, then a compact solid bar once the page scrolls.
 * Scroll-spy marks the section in view with the accent.
 */
export function Header({ brand, logo, links, menuLabel, closeLabel, meta, ticket, layout = "frame" }: HeaderProps) {
  const edges = layout === "edges";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // The hero is observed too: while it fills the middle of the screen no link is active.
    const sections = ["#hero", ...links.map((l) => l.href)]
      .map((h) => document.getElementById(h.slice(1)))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = `#${e.target.id}`;
          setActive(links.some((l) => l.href === id) ? id : null);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [links]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,height,backdrop-filter] duration-[var(--motion-normal)] ease-expo ${
          scrolled ? "border-b border-line bg-bg/90 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div
          className={`${
            edges ? "grid grid-cols-[1fr_auto] px-[clamp(16px,2.4vw,40px)] lg:grid-cols-[1fr_auto_1fr]" : "frame flex justify-between"
          } items-center gap-6 transition-[height] duration-[var(--motion-normal)] ease-expo ${
            scrolled ? "h-[calc(var(--header-h)-12px)]" : "h-[var(--header-h)]"
          }`}
        >
          <a href="#top" className="flex min-w-0 items-center justify-self-start" aria-label={`${brand} — back to top`}>
            {logo ? (
              <Image src={logo.src} alt="" width={logo.width} height={logo.height} className="h-7 w-auto" priority />
            ) : (
              <span className="t-display-base truncate text-[1.6rem] leading-none md:text-[1.9rem]">{brand}</span>
            )}
          </a>

          <nav aria-label="Primary" className={`hidden ${edges ? "lg:block" : "md:block"}`}>
            <ul className={`flex items-center ${edges ? "gap-7 xl:gap-9" : "gap-8"}`}>
              {links.map((l) => {
                const isActive = active === l.href;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-current={isActive ? "location" : undefined}
                      className="t-label group relative flex items-center gap-2 py-2"
                    >
                      <span
                        aria-hidden
                        className={`size-1.5 rounded-full bg-accent transition-transform duration-[var(--motion-fast)] ${isActive ? "scale-100" : "scale-0"}`}
                      />
                      <span className="relative">
                        {l.label}
                        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-[var(--motion-normal)] ease-expo group-hover:scale-x-100" />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 justify-self-end">
            <span className="hidden sm:contents">
              <TicketButton {...ticket} placement="header" size="sm" />
            </span>
            <button
              type="button"
              className={`t-label -mr-2 inline-flex h-11 items-center gap-2.5 px-2 ${edges ? "lg:hidden" : "md:hidden"}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              {menuLabel}
              <span aria-hidden className="flex w-5 flex-col gap-[5px]">
                <span className="h-[1.5px] w-full bg-current" />
                <span className="h-[1.5px] w-3/5 self-end bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileNavigation open={open} onClose={close} links={links} closeLabel={closeLabel} meta={meta} ticket={ticket} />
    </>
  );
}
