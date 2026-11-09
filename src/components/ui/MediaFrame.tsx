import Image from "next/image";
import type { MediaImage } from "@/types/event";

interface MediaFrameProps {
  image: MediaImage;
  sizes: string;
  /** CSS aspect ratio, e.g. "4 / 5". Defaults to the image's own ratio. */
  ratio?: string;
  className?: string;
  priority?: boolean;
  zoom?: boolean;
  showCaption?: boolean;
  imgClassName?: string;
}

/** Image with fixed aspect ratio (no layout shift), optional hover zoom and caption. */
export function MediaFrame({
  image,
  sizes,
  ratio,
  className = "",
  priority,
  zoom = true,
  showCaption = true,
  imgClassName = "",
}: MediaFrameProps) {
  const caption = showCaption ? image.caption ?? null : null;
  return (
    <figure className={`relative ${className}`}>
      <div
        className={`relative overflow-hidden rounded-[var(--radius-media)] bg-surface ${zoom ? "media-zoom" : ""}`}
        style={{ aspectRatio: ratio ?? `${image.width} / ${image.height}` }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imgClassName}`}
          style={{ objectPosition: image.focus ?? "50% 50%" }}
        />
        {caption ? (
          <figcaption className="media-caption t-label absolute inset-x-0 bottom-0 flex justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white">
            <span>{caption}</span>
            {image.credit ? <span className="opacity-70">© {image.credit}</span> : null}
          </figcaption>
        ) : null}
      </div>
    </figure>
  );
}
