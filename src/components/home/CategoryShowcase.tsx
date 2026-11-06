import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import type { ProductDTO } from "@/lib/types";

export default function CategoryShowcase({ products }: { products: ProductDTO[] }) {
  return (
    <section className="container-site py-16 lg:py-24">
      <RevealOnScroll>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">
          Our Range
        </p>
        <h2 className="mt-2 text-center font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] text-brand-forest">
          Discover Our Powders
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-brand-charcoal/70">
          Everyday ingredients, naturally dried and finely milled — ready whenever your recipe needs them.
        </p>
      </RevealOnScroll>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
        {products.map((product, i) => (
          <RevealOnScroll key={product.id} delay={i * 0.06}>
            <Link
              href={`/product/${product.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width:1024px) 20vw, 45vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-serif text-lg text-white">{product.name}</p>
                <p className="text-xs text-white/75">{product.category}</p>
              </div>
            </Link>
          </RevealOnScroll>
        ))}
        <RevealOnScroll delay={products.length * 0.06}>
          <Link
            href="/shop"
            className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-leaf/40 bg-brand-leaf/5 text-center transition-colors hover:bg-brand-leaf/10"
          >
            <span className="font-serif text-lg text-brand-forest">Shop All</span>
            <span className="text-xs text-brand-charcoal/60">View full range →</span>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
