import type { GalleryItem } from "@/types/event";
import type { PageModel } from "@/lib/page-model";
import { MediaFrame } from "../ui/MediaFrame";
import { RevealMedia } from "../ui/RevealMedia";
import { SectionLabel } from "../ui/SectionLabel";
import { SpotifyEmbed } from "../ui/SpotifyEmbed";
import { VideoPlayer } from "../ui/VideoPlayer";

/**
 * Editorial composition slots. Each slot is a 12-column placement plus a
 * crop ratio; items flow into slots in order, so the layout adapts to however
 * many images the organizer supplies without becoming a uniform card grid.
 */
const SLOTS = [
  { cls: "col-span-4 md:col-span-6 lg:col-span-12 -mx-[var(--gutter)]", ratio: "21 / 10", mobileRatio: "4 / 5", sizes: "100vw", from: "bottom" as const },
  { cls: "col-span-4 md:col-span-4 lg:col-span-7", ratio: "4 / 5", sizes: "(min-width:1024px) 58vw, (min-width:768px) 66vw, 100vw", from: "left" as const },
  { cls: "col-span-3 col-start-2 md:col-span-2 md:col-start-5 lg:col-span-4 lg:col-start-9 md:mt-[30%]", ratio: "3 / 4", sizes: "(min-width:1024px) 33vw, 75vw", from: "bottom" as const },
  { cls: "col-span-4 md:col-span-3 lg:col-span-5 lg:col-start-2", ratio: "4 / 5", sizes: "(min-width:1024px) 42vw, 100vw", from: "bottom" as const },
  { cls: "col-span-4 md:col-span-3 lg:col-span-6 lg:col-start-7 md:mt-[20%]", ratio: "3 / 2", sizes: "(min-width:1024px) 50vw, 100vw", from: "right" as const },
];

function renderItem(item: GalleryItem, model: PageModel, ratio: string, sizes: string) {
  const { t, event } = model;
  if (item.type === "image") {
    return <MediaFrame image={item.image} ratio={ratio} sizes={sizes} />;
  }
  if (item.type === "video") {
    return <VideoPlayer src={item.src} poster={item.poster} title={item.title} playLabel={t.media.play} sizes={sizes} ratio={ratio} />;
  }
  if (!event.features.mediaEmbeds) return null;
  const host = item.provider === "youtube" ? "youtube-nocookie.com" : "vimeo.com";
  return (
    <VideoPlayer
      embed={{ provider: item.provider, videoId: item.videoId, notice: `${t.media.embedNotice} ${host}` }}
      poster={item.poster}
      title={item.title}
      playLabel={t.media.loadEmbed}
      sizes={sizes}
      ratio="16 / 9"
    />
  );
}

export function MediaGallery({ model, index }: { model: PageModel; index: string }) {
  const { event, t } = model;
  const items = event.gallery.filter((g) => g.type !== "embed" || event.features.mediaEmbeds);
  const advanced = event.features.advancedGallery;
  const composed = advanced ? items.slice(0, SLOTS.length) : items;
  const strip = advanced ? items.slice(SLOTS.length) : [];
  const spotify = event.features.mediaEmbeds && event.spotifyEmbedUrl ? event.spotifyEmbedUrl : null;
  if (!items.length && !spotify) return null;

  return (
    <section id="media" aria-labelledby="media-title" className="section-space relative bg-surface">
      <div className="frame">
        <div className="mb-[clamp(40px,6vw,96px)] flex items-end justify-between gap-6 border-b border-line pb-6">
          <div>
            <SectionLabel index={index} label={t.sections.media} className="mb-6 text-muted" />
            <h2 id="media-title" className="t-display-base t-heading">
              {event.artistName}
              <span className="text-muted"> / {t.sections.media}</span>
            </h2>
          </div>
          <p className="t-label tabular hidden text-muted md:block">
            ({String(items.length).padStart(2, "0")})
          </p>
        </div>

        {advanced ? (
          <div className="grid-poster gap-y-[clamp(24px,5vw,72px)]">
            {composed.map((item, i) => {
              const slot = SLOTS[i]!;
              return (
                <RevealMedia key={i} className={slot.cls} from={slot.from}>
                  <div className={i === 0 ? "hidden md:block" : undefined}>{renderItem(item, model, slot.ratio, slot.sizes)}</div>
                  {i === 0 && slot.mobileRatio ? <div className="md:hidden">{renderItem(item, model, slot.mobileRatio, "100vw")}</div> : null}
                </RevealMedia>
              );
            })}
          </div>
        ) : (
          // Free tier: clean alternating two-column editorial flow
          <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
            {composed.map((item, i) => (
              <RevealMedia key={i} className={i % 3 === 0 ? "md:col-span-2" : i % 2 ? "md:mt-24" : ""}>
                {renderItem(item, model, i % 3 === 0 ? "16 / 9" : "4 / 5", i % 3 === 0 ? "100vw" : "(min-width:768px) 50vw, 100vw")}
              </RevealMedia>
            ))}
          </div>
        )}
      </div>

      {strip.length ? (
        <div className="mt-[clamp(32px,5vw,72px)]">
          <ul className="h-scroll flex gap-4 overflow-x-auto px-[var(--gutter)] pb-4 md:gap-6" aria-label={t.sections.media}>
            {strip.map((item, i) => (
              <li key={i} className="w-[78vw] shrink-0 md:w-[38vw] lg:w-[28vw]">
                {renderItem(item, model, "4 / 5", "(min-width:1024px) 28vw, 78vw")}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {spotify ? (
        <div className="frame mt-[clamp(32px,5vw,72px)] max-w-3xl">
          <SpotifyEmbed url={spotify} label={t.media.listen} notice={t.media.embedNotice} />
        </div>
      ) : null}
    </section>
  );
}
