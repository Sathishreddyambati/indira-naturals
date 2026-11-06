import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/home/Hero";
import ProcessSection from "@/components/home/ProcessSection";
import VideosSection from "@/components/home/VideosSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import ProductGrid from "@/components/ProductGrid";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getAllPublishedProducts, getSiteSettings } from "@/db/queries";

export const metadata: Metadata = {
  title: "Pure Ingredients. Naturally Better.",
  description:
    "Shop Indira Naturals ginger, garlic, ginger garlic, onion and tomato powders — 100% pure, made only by drying, with no preservatives and no additives.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [products, settings] = await Promise.all([getAllPublishedProducts(), getSiteSettings()]);

  return (
    <>
      {/* Part 1: glassy intro box */}
      <Hero
        headline={settings.heroHeadline}
        subtext={settings.heroSubtext}
        ctaPrimary={settings.heroCtaPrimaryLabel}
        ctaSecondary={settings.heroCtaSecondaryLabel}
      />

      {/* Part 2: making procedure */}
      <ProcessSection />

      {/* Part 3: making videos with dates */}
      <VideosSection />

      {products.length > 0 && (
        <section className="container-site py-16 lg:py-20">
          <RevealOnScroll>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">Our Products</p>
                <h2 className="mt-2 font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] text-brand-forest">
                  Shop the range
                </h2>
              </div>
              <Link href="/shop" className="text-sm font-semibold text-brand-forest hover:underline">
                Shop all products →
              </Link>
            </div>
          </RevealOnScroll>
          <div className="mt-10">
            <ProductGrid products={products} />
          </div>
        </section>
      )}

      <NewsletterSection />
    </>
  );
}
