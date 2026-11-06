import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchasePanel from "@/components/product/ProductPurchasePanel";
import ProductGrid from "@/components/ProductGrid";
import ReviewForm from "@/components/product/ReviewForm";
import StarRating from "@/components/StarRating";
import RevealOnScroll from "@/components/RevealOnScroll";
import { Accordion } from "@/components/Accordion";
import { getAllPublishedProducts, getApprovedReviewsForProduct, getProductBySlug } from "@/db/queries";
import { formatINR } from "@/lib/money";
import { BENEFITS } from "@/lib/brand";
import BrandIcon from "@/components/BrandIcon";

export async function generateStaticParams() {
  const products = await getAllPublishedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.image],
    },
  };
}

const GENERAL_FAQS = [
  {
    question: "How should I store this product?",
    answer: "Store in a cool, dry place away from direct sunlight and reseal the pack tightly after each use.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are typically processed within 1-2 business days. Delivery timelines vary by location — exact estimates are provided at checkout.",
  },
  {
    question: "What if I receive a damaged or incorrect product?",
    answer:
      "Please contact our support team within 48 hours of delivery with photos of the product, and we will help resolve it per our shipping & returns policy.",
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer: "Cash on Delivery is available in select locations where enabled at checkout.",
  },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "published") notFound();

  const [approvedReviews, allProducts] = await Promise.all([
    getApprovedReviewsForProduct(product.id),
    getAllPublishedProducts(),
  ]);

  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);
  const relatedFallback = related.length > 0 ? related : allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const maxPrice = Math.max(...product.variants.map((v) => v.price));
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: [product.image],
    sku: product.skuPrefix,
    category: product.category,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: minPrice,
      highPrice: maxPrice,
      availability: totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.avgRating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  return (
    <div className="container-site py-8 lg:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-brand-charcoal/60">
        <Link href="/" className="hover:text-brand-forest">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-brand-forest">Shop</Link>
        <ChevronRight size={12} />
        <span className="text-brand-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={[product.image, ...product.galleryImages.filter((g) => g !== product.image)]} name={product.name} />
        <ProductPurchasePanel product={product} />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-3 font-serif text-2xl text-brand-forest">Product Description</h2>
            <p className="leading-relaxed text-brand-charcoal/75">{product.description}</p>
          </section>

          <section className="glass-green rounded-2xl p-6">
            <h2 className="font-serif text-2xl text-white">How to use &amp; benefits</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{product.usageInstructions}</p>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <li key={b.title} className="flex gap-3 rounded-xl bg-white/10 p-3">
                  <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-brand-sand-light text-brand-forest">
                    <BrandIcon name={b.icon} size={16} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{b.title}</span>
                    <span className="block text-xs text-white/75">{b.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="glass rounded-xl p-5">
              <h3 className="mb-2 font-serif text-lg text-brand-forest">Ingredients</h3>
              <p className="text-sm text-brand-charcoal/75">{product.ingredients}</p>
            </div>
            <div className="glass rounded-xl p-5">
              <h3 className="mb-2 font-serif text-lg text-brand-forest">Net Weight</h3>
              <p className="text-sm text-brand-charcoal/75">{product.netWeightLabel}</p>
            </div>
            <div className="glass rounded-xl p-5">
              <h3 className="mb-2 font-serif text-lg text-brand-forest">Usage Instructions</h3>
              <p className="text-sm text-brand-charcoal/75">{product.usageInstructions}</p>
            </div>
            <div className="glass rounded-xl p-5">
              <h3 className="mb-2 font-serif text-lg text-brand-forest">Storage Instructions</h3>
              <p className="text-sm text-brand-charcoal/75">{product.storageInstructions}</p>
            </div>
            {product.allergenInfo && (
              <div className="glass rounded-xl p-5 sm:col-span-2">
                <h3 className="mb-2 font-serif text-lg text-brand-forest">Allergen Information</h3>
                <p className="text-sm text-brand-charcoal/75">{product.allergenInfo}</p>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 font-serif text-2xl text-brand-forest">Shipping &amp; Returns</h2>
            <p className="text-sm leading-relaxed text-brand-charcoal/75">
              Orders are processed within 1-2 business days. Shipping charges and delivery estimates are
              calculated at checkout based on your location. For details on returns and replacements, see our{" "}
              <Link href="/policies/shipping-returns" className="font-medium text-brand-forest hover:underline">
                Shipping &amp; Returns Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-2xl text-brand-forest">Frequently Asked Questions</h2>
            <Accordion items={GENERAL_FAQS} />
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-brand-forest">Customer Reviews</h2>
              {product.reviewCount > 0 && <StarRating rating={product.avgRating} showValue />}
            </div>
            <div className="flex flex-col gap-4">
              {approvedReviews.length === 0 ? (
                <p className="text-sm text-brand-charcoal/60">
                  No reviews yet. Be the first to share your experience with this product.
                </p>
              ) : (
                approvedReviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-brand-brown/10 p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="font-semibold text-brand-charcoal">{r.customerName}</p>
                      <StarRating rating={r.rating} size={14} />
                    </div>
                    {r.title && <p className="mb-1 font-medium text-brand-forest">{r.title}</p>}
                    <p className="text-sm text-brand-charcoal/75">{r.body}</p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6">
              <ReviewForm productId={product.id} />
            </div>
          </section>
        </div>

        <aside className="glass h-fit rounded-2xl p-6">
          <h3 className="mb-3 font-serif text-lg text-brand-forest">At a Glance</h3>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between border-b border-brand-brown/10 pb-2">
              <dt className="text-brand-charcoal/60">Category</dt>
              <dd className="font-medium">{product.category}</dd>
            </div>
            <div className="flex justify-between border-b border-brand-brown/10 pb-2">
              <dt className="text-brand-charcoal/60">Price Range</dt>
              <dd className="font-medium">{formatINR(minPrice)} – {formatINR(maxPrice)}</dd>
            </div>
            <div className="flex justify-between border-b border-brand-brown/10 pb-2">
              <dt className="text-brand-charcoal/60">Pack Sizes</dt>
              <dd className="font-medium">{product.variants.map((v) => v.label).join(", ")}</dd>
            </div>
            <div className="flex justify-between pb-2">
              <dt className="text-brand-charcoal/60">Availability</dt>
              <dd className={`font-medium ${totalStock > 0 ? "text-brand-leaf" : "text-red-600"}`}>
                {totalStock > 0 ? "In Stock" : "Out of Stock"}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      {relatedFallback.length > 0 && (
        <section className="mt-16">
          <RevealOnScroll>
            <h2 className="mb-6 font-serif text-2xl text-brand-forest">You May Also Like</h2>
          </RevealOnScroll>
          <ProductGrid products={relatedFallback} />
        </section>
      )}
    </div>
  );
}
