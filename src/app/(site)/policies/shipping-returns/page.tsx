import type { Metadata } from "next";
import { getSiteSettings } from "@/db/queries";

export const metadata: Metadata = {
  title: "Shipping & Returns Policy",
  alternates: { canonical: "/policies/shipping-returns" },
};

export default async function ShippingReturnsPage() {
  const settings = await getSiteSettings();
  return (
    <div className="container-site max-w-3xl py-12 lg:py-16">
      <h1 className="font-serif text-3xl text-brand-forest">Shipping &amp; Returns Policy</h1>
      <div className="prose-sm mt-6 flex flex-col gap-5 text-brand-charcoal/80">
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">Shipping</h2>
          <p>
            Orders are typically processed within 1-2 business days. Delivery timelines depend on your
            location and will be confirmed at checkout. Orders above {"₹"}
            {settings.freeShippingThreshold} qualify for free shipping; a flat shipping fee of {"₹"}
            {settings.flatShippingRate} applies to smaller orders. [Placeholder — final shipping partners
            and timelines to be confirmed by the business.]
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">Order Tracking</h2>
          <p>
            You can track the status of your order anytime from the Track Order page using your order
            number and the email address used at checkout.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">Returns &amp; Replacements</h2>
          <p>
            If you receive a damaged, defective, or incorrect product, please contact us within 48 hours
            of delivery at {settings.supportEmail} with your order number and photos of the product. Our
            team will review your request and arrange a replacement or refund where applicable.
            [Placeholder — specific return window and conditions to be confirmed by the business before
            launch.]
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">Cancellations</h2>
          <p>
            Orders can typically be cancelled before they are shipped. Please contact our support team as
            soon as possible if you need to cancel an order.
          </p>
        </section>
      </div>
    </div>
  );
}
