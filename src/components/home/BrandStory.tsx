import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function BrandStory() {
  return (
    <section className="bg-brand-forest py-16 text-brand-ivory lg:py-24">
      <div className="container-site grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <RevealOnScroll>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image
              src="/images/products/garlic-ginger-powder.jpg"
              alt="Fresh garlic and ginger alongside Indira Naturals powder"
              fill
              sizes="(min-width: 1024px) 560px, 90vw"
              className="object-cover"
            />
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf-light">
            Our Philosophy
          </p>
          <h2 className="mt-2 font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight">
            Simple ingredients. Honest process.
          </h2>
          <p className="mt-4 text-brand-ivory/80">
            Indira Naturals was founded on a simple belief: everyday vegetables, when dried and milled
            with care, can make cooking faster without making it less natural. We work with garlic,
            ginger, onion and tomato — ingredients already at the heart of Indian kitchens — and turn
            them into powders that keep up with modern life.
          </p>
          <p className="mt-4 text-brand-ivory/80">
            We believe in clear labelling and honest communication. Every claim on this site about our
            sourcing, process, and ingredients is reviewed and updated as our business grows and more
            information is verified.
          </p>
          <Link
            href="/our-story"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-ivory/40 px-6 py-3 text-sm font-semibold transition-colors hover:bg-brand-ivory hover:text-brand-forest"
          >
            Read Our Full Story
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
