import Image from "next/image";
import { CalendarClock, Factory, Video } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import { MAKING_VIDEOS, formatVideoDate } from "@/lib/videos";

// Home page part 3 (and the Why Us video proofs): making-process videos,
// each with the date it was recorded and the date the batch was made.
export default function VideosSection({
  eyebrow = "Watch us make it",
  title = "Making process videos",
  intro = "Real videos from our making process. Each one shows when it was recorded and when that batch was made.",
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  return (
    <section className="container-site py-16 lg:py-20">
      <RevealOnScroll className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] text-brand-forest">{title}</h2>
        <p className="mt-3 text-brand-charcoal/70">{intro}</p>
      </RevealOnScroll>

      <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
        {MAKING_VIDEOS.map((v, i) => (
          <RevealOnScroll key={v.title} delay={i * 0.06} className="w-[64vw] max-w-[240px] flex-shrink-0 snap-start lg:w-auto lg:max-w-none">
            <article className="glass flex h-full flex-col overflow-hidden rounded-2xl">
              <div className="relative aspect-[9/14] w-full overflow-hidden bg-brand-forest/10">
                {v.src ? (
                  <video
                    src={v.src}
                    poster={v.poster}
                    controls
                    preload="metadata"
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
                    <Image src="/images/logo-sm.png" alt="" width={560} height={315} className="w-3/4 opacity-80" />
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-brand-forest">
                      <Video size={14} /> Video coming soon
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-semibold leading-snug text-brand-forest">{v.title}</h3>
                <p className="flex items-center gap-1.5 text-xs text-brand-charcoal/70">
                  <CalendarClock size={14} className="text-brand-leaf" />
                  Recorded on: <span className="font-medium text-brand-charcoal">{formatVideoDate(v.recordedOn)}</span>
                </p>
                <p className="flex items-center gap-1.5 text-xs text-brand-charcoal/70">
                  <Factory size={14} className="text-brand-leaf" />
                  Made on: <span className="font-medium text-brand-charcoal">{formatVideoDate(v.madeOn)}</span>
                </p>
              </div>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
