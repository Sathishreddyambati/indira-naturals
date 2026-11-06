import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import BrandIcon from "@/components/BrandIcon";
import { BENEFITS, CONTACT, PACK_FACTS, TAGLINE, WHY_WE_STARTED, YIELD_GUIDE } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The Indira Naturals story: why we started making pure ginger and garlic powders, the main benefits, and information about our packs and yield.",
  alternates: { canonical: "/our-story" },
};

export default function AboutPage() {
  return (
    <div>
      <section className="container-site pt-4 text-center">
        <RevealOnScroll>
          <Image
            src="/images/logo-sm.png"
            alt="Indira Naturals"
            width={560}
            height={315}
            className="logo-glow mx-auto h-28 w-auto object-contain"
          />
          <h1 className="mt-4 font-serif text-[clamp(2rem,4vw,3.25rem)] text-brand-forest">Our Story</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-brand-charcoal/75">
            Nature&apos;s goodness in every spoon. <span className="font-semibold text-brand-forest">{TAGLINE}</span>
          </p>
        </RevealOnScroll>
      </section>

      {/* Why we started */}
      <section className="container-site py-12">
        <div className="glass rounded-[2rem] px-6 py-10 sm:px-10">
          <RevealOnScroll className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">Why we started</p>
            <h2 className="mt-2 font-serif text-[clamp(1.6rem,3vw,2.4rem)] text-brand-forest">
              Ginger and garlic, ready when you are
            </h2>
          </RevealOnScroll>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {WHY_WE_STARTED.map((s, i) => (
              <RevealOnScroll key={s.title} delay={i * 0.1}>
                <div className="h-full rounded-2xl border border-brand-leaf/20 bg-white/70 p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-forest font-serif text-lg text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-serif text-xl text-brand-forest">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/75">{s.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <RevealOnScroll className="mt-8 text-center text-sm text-brand-charcoal/70">
            — {CONTACT.founder}, {CONTACT.founderRole}
          </RevealOnScroll>
        </div>
      </section>

      {/* Main benefits highlight */}
      <section className="container-site py-6">
        <div className="glass-green rounded-[2rem] px-6 py-10 sm:px-10">
          <RevealOnScroll className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf-light">Main benefits</p>
            <h2 className="mt-2 font-serif text-[clamp(1.6rem,3vw,2.4rem)] text-white">Why families love our powder</h2>
          </RevealOnScroll>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-center gap-3 rounded-xl bg-white/10 p-4">
                <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-white text-brand-forest">
                  <BrandIcon name={b.icon} size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">{b.title}</p>
                  <p className="hidden text-xs text-white/70 sm:block">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Information: yield guide + packs */}
      <section className="container-site py-12">
        <RevealOnScroll className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">Information</p>
          <h2 className="mt-2 font-serif text-[clamp(1.6rem,3vw,2.4rem)] text-brand-forest">Yield guide &amp; our packs</h2>
        </RevealOnScroll>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevealOnScroll>
            <div className="glass h-full rounded-2xl p-6">
              <h3 className="font-serif text-xl text-brand-forest">How much powder from raw produce</h3>
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-forest/15 text-brand-charcoal/60">
                    <th className="py-2 font-medium">Raw produce</th>
                    <th className="py-2 font-medium">Ginger powder</th>
                    <th className="py-2 font-medium">Garlic powder</th>
                  </tr>
                </thead>
                <tbody>
                  {YIELD_GUIDE.map((r) => (
                    <tr key={r.raw} className="border-b border-brand-forest/10 last:border-0">
                      <td className="py-2 font-medium">{r.raw}</td>
                      <td className="py-2">{r.ginger}</td>
                      <td className="py-2">{r.garlic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-sm text-brand-charcoal/70">
                Ginger gives 10% powder by weight and garlic gives 20%. So 1 kg of raw ginger makes 100 g of powder,
                and 1 kg of raw garlic makes 200 g.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="glass h-full rounded-2xl p-6">
              <h3 className="font-serif text-xl text-brand-forest">Three variants, four sizes</h3>
              <div className="relative mt-4 aspect-[2/1] overflow-hidden rounded-xl bg-white">
                <Image src="/images/products/ginger-sizes.jpg" alt="Ginger powder pouches in 50g, 100g, 500g and 1kg" fill sizes="(min-width:1024px) 560px, 90vw" className="object-cover" />
              </div>
              <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PACK_FACTS.map((f) => (
                  <div key={f.title} className="rounded-xl bg-white/70 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-brand-leaf">{f.title}</dt>
                    <dd className="mt-1 text-sm text-brand-charcoal/80">{f.body}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm text-brand-charcoal/70">Gift box with all three variants. Box size: 20 × 14 × 21 cm.</p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-site flex flex-col items-center gap-4 py-10 text-center">
        <h2 className="font-serif text-3xl text-brand-forest">Ready to bring natural goodness to your kitchen?</h2>
        <Link href="/shop" className="rounded-full bg-brand-forest px-8 py-3.5 text-sm font-semibold text-brand-ivory hover:bg-brand-leaf">
          Shop Our Powders
        </Link>
      </section>
    </div>
  );
}
