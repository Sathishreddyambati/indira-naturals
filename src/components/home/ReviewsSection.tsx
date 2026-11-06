import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import StarRating from "@/components/StarRating";
import type { getFeaturedReviews } from "@/db/queries";

type ReviewRow = Awaited<ReturnType<typeof getFeaturedReviews>>[number];

export default function ReviewsSection({ reviews }: { reviews: ReviewRow[] }) {
  if (reviews.length === 0) return null;
  return (
    <section className="container-site py-16 lg:py-24">
      <RevealOnScroll>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">
          Customer Reviews
        </p>
        <h2 className="mt-2 text-center font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] text-brand-forest">
          Loved by Home Cooks
        </h2>
      </RevealOnScroll>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <RevealOnScroll key={review.id} delay={i * 0.08}>
            <div className="flex h-full flex-col gap-3 rounded-2xl border border-brand-brown/10 bg-white p-6 shadow-card">
              <StarRating rating={review.rating} />
              {review.title && <p className="font-serif text-lg text-brand-forest">{review.title}</p>}
              <p className="flex-1 text-sm text-brand-charcoal/75">&ldquo;{review.body}&rdquo;</p>
              <div className="flex items-center justify-between pt-2 text-xs text-brand-charcoal/60">
                <span className="font-semibold">
                  {review.customerName}
                  {review.verifiedPurchase && (
                    <span className="ml-2 rounded-full bg-brand-leaf/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-leaf">
                      Verified
                    </span>
                  )}
                </span>
                <Link href={`/product/${review.productSlug}`} className="hover:underline">
                  {review.productName}
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
