import type { PageModel } from "@/lib/page-model";
import { MediaFrame } from "../ui/MediaFrame";
import { RevealMedia } from "../ui/RevealMedia";
import { RevealText } from "../ui/RevealText";
import { SectionLabel } from "../ui/SectionLabel";

/** Oversized portrait left, stepped headline and short narrative right. */
export function ArtistStory({ model, index }: { model: PageModel; index: string }) {
  const { event, t } = model;
  const story = event.story;
  if (!story) return null;
  const body = story.body.filter(Boolean);
  const headline = story.headline.filter(Boolean);
  const steps = ["", "pl-[12%]", "pl-[24%]"];

  return (
    <section id="about" aria-labelledby="story-title" className="section-space relative">
      <div className="grid-poster items-start gap-y-12 px-[var(--gutter)] lg:pl-0">
        {story.image ? (
          <RevealMedia className="col-span-4 -mx-[var(--gutter)] md:col-span-6 lg:col-span-7 lg:mx-0" parallax={event.features.advancedMotion}>
            <MediaFrame image={story.image} ratio="4 / 5" sizes="(min-width: 1024px) 58vw, 100vw" zoom={false} showCaption={false} />
          </RevealMedia>
        ) : null}

        <div className={`col-span-4 md:col-span-6 ${story.image ? "lg:col-span-5 lg:pt-[18vh] lg:pr-[var(--gutter)]" : "lg:col-span-10 lg:col-start-2"}`}>
          <SectionLabel index={index} label={t.sections.story} className="mb-10 text-muted" />
          {headline.length ? (
            <RevealText
              id="story-title"
              lines={headline}
              className="t-display-base t-heading leading-[0.9]"
              lineClasses={steps}
            />
          ) : (
            <h2 id="story-title" className="sr-only">{t.sections.story}</h2>
          )}
          {body.length ? (
            <div className="mt-10 space-y-5 md:mt-14">
              {body.map((p, i) => (
                <p key={i} className={`t-body ${i === 0 ? "text-fg" : ""}`}>
                  {p}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
