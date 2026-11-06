import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, BadgeCheck, FileBadge, Leaf, ShieldCheck, Truck } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import BrandIcon from "@/components/BrandIcon";
import VideosSection from "@/components/home/VideosSection";
import { BENEFITS, CERTIFICATES } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Why Us",
  description:
    "Why choose Indira Naturals: 100% pure ginger and garlic powders made only by drying, no preservatives, certified and with video proof of how we make it.",
  alternates: { canonical: "/why-us" },
};

const PROMISES = [
  { icon: Leaf, title: "100% pure & natural", body: "Only ginger and garlic. Nothing else goes into the pouch." },
  { icon: ShieldCheck, title: "Hygienic process", body: "Washed, peeled, dried, ground and packed with care at every step." },
  { icon: BadgeCheck, title: "Batch-marked packs", body: "Every pouch carries a batch number and manufacturing date." },
  { icon: Truck, title: "Fresh to your door", body: "Food-grade zip-lock pouches keep the powder fresh after opening." },
];

export default function WhyUsPage() {
  return (
    <div>
      <section className="container-site pb-6 pt-4 text-center">
        <RevealOnScroll>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">Why choose us</p>
          <h1 className="mt-2 font-serif text-[clamp(2rem,4vw,3.25rem)] text-brand-forest">Why Indira Naturals?</h1>
          <p className="mx-auto mt-4 max-w-2xl text-brand-charcoal/75">
            Ginger and garlic, ready when you are — with the real taste of the raw product and nothing added.
          </p>
        </RevealOnScroll>
      </section>

      {/* Our promises */}
      <section className="container-site py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 0.08}>
              <div className="glass h-full rounded-2xl p-6">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-forest text-white">
                  <p.icon size={22} />
                </div>
                <h2 className="mt-4 font-serif text-lg text-brand-forest">{p.title}</h2>
                <p className="mt-2 text-sm text-brand-charcoal/75">{p.body}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Benefits (PPT benefits slide) */}
      <section className="container-site py-10">
        <div className="glass-green rounded-[2rem] px-6 py-12 sm:px-10">
          <RevealOnScroll className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf-light">Benefits</p>
            <h2 className="mt-2 font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] text-white">How the powder helps in daily life</h2>
          </RevealOnScroll>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <RevealOnScroll key={b.title} delay={i * 0.06}>
                <div className="flex h-full gap-4 rounded-2xl bg-white/10 p-5">
                  <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-brand-sand-light text-brand-forest">
                    <BrandIcon name={b.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{b.title}</h3>
                    <p className="mt-1 text-sm text-white/75">{b.body}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates & licences */}
      <section className="container-site py-10">
        <RevealOnScroll className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">Trust & quality</p>
          <h2 className="mt-2 font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] text-brand-forest">Certifications &amp; licences</h2>
        </RevealOnScroll>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {CERTIFICATES.map((c, i) => (
            <RevealOnScroll key={c.title} delay={i * 0.08}>
              <div className="glass flex h-full flex-col overflow-hidden rounded-2xl">
                <div className="relative grid aspect-[4/3] place-items-center bg-brand-sand-light/60">
                  {c.image ? (
                    <Image src={c.image} alt={c.title} fill sizes="(min-width:640px) 33vw, 90vw" className="object-contain p-4" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-brand-forest/70">
                      <FileBadge size={44} />
                      <span className="text-xs font-semibold">Certificate image coming soon</span>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-3 p-5">
                  <Award size={20} className="mt-0.5 flex-shrink-0 text-brand-gold" />
                  <div>
                    <h3 className="font-serif text-lg text-brand-forest">{c.title}</h3>
                    <p className="text-sm text-brand-charcoal/70">{c.detail}</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Video proofs */}
      <VideosSection
        eyebrow="Video proof"
        title="See how our powder is made"
        intro="We show every step. Each video shows the date it was recorded and the date the batch was made."
      />

      <section className="container-site flex flex-col items-center gap-4 py-10 text-center">
        <h2 className="font-serif text-3xl text-brand-forest">Taste the difference of nothing added</h2>
        <Link href="/shop" className="rounded-full bg-brand-forest px-8 py-3.5 text-sm font-semibold text-brand-ivory hover:bg-brand-leaf">
          Shop Our Powders
        </Link>
      </section>
    </div>
  );
}
