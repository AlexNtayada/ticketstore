"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { MediaImage } from "@/types/event";

interface VideoPlayerProps {
  poster?: MediaImage;
  title: string;
  playLabel: string;
  sizes: string;
  ratio?: string;
  /** Self-hosted file */
  src?: string;
  /** Third-party embed (YouTube / Vimeo), loaded only after the visitor asks. */
  embed?: { provider: "youtube" | "vimeo"; videoId: string; notice: string };
}

function embedUrl(provider: "youtube" | "vimeo", id: string) {
  const safe = encodeURIComponent(id);
  return provider === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${safe}?autoplay=1&rel=0&modestbranding=1`
    : `https://player.vimeo.com/video/${safe}?autoplay=1&dnt=1`;
}

/**
 * Click-to-play facade: only a poster image is loaded up front. No autoplay,
 * no third-party requests until the visitor presses play.
 */
export function VideoPlayer({ poster, title, playLabel, sizes, ratio = "16 / 9", src, embed }: VideoPlayerProps) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative overflow-hidden bg-surface" style={{ aspectRatio: ratio }}>
      {active ? (
        embed ? (
          <iframe
            src={embedUrl(embed.provider, embed.videoId)}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <video src={src} controls autoPlay playsInline className="absolute inset-0 size-full bg-black object-contain" poster={poster?.src}>
            <track kind="captions" />
          </video>
        )
      ) : (
        <button type="button" onClick={() => setActive(true)} className="group absolute inset-0 size-full text-left">
          {poster ? (
            <Image src={poster.src} alt="" fill sizes={sizes} className="object-cover transition-transform duration-[var(--motion-slow)] ease-expo group-hover:scale-[1.03]" />
          ) : null}
          <span className="absolute inset-0 bg-black/25" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-20 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-[var(--motion-normal)] ease-expo group-hover:scale-110 md:size-24">
              <Play aria-hidden className="ml-1 size-7 fill-current" />
            </span>
          </span>
          <span className="t-label absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-white md:p-6">
            <span>
              {playLabel}: {title}
            </span>
            {embed ? <span className="normal-case tracking-normal opacity-70">{embed.notice}</span> : null}
          </span>
        </button>
      )}
    </div>
  );
}
