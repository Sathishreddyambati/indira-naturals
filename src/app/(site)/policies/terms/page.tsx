import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/policies/terms" },
};

export default function TermsPage() {
  return (
    <div className="container-site max-w-3xl py-12 lg:py-16">
      <h1 className="font-serif text-3xl text-brand-forest">Terms of Service</h1>
      <div className="mt-6 flex flex-col gap-5 text-brand-charcoal/80">
        <p>
          These Terms of Service govern your use of the Indira Naturals website and your purchase of
          products from us. By using this site, you agree to these terms.
        </p>
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">Orders &amp; Pricing</h2>
          <p>
            All prices are listed in Indian Rupees (INR) and are subject to change without notice. We
            reserve the right to refuse or cancel any order for reasons including product unavailability,
            pricing errors, or suspected fraud.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">Product Information</h2>
          <p>
            We aim to display accurate product descriptions, images, and pricing. Minor variations in
            product appearance may occur. Please refer to the product packaging for the most accurate
            ingredient and usage information.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">Payments</h2>
          <p>
            Online payments are processed securely through our payment gateway partner. Cash on Delivery,
            where offered, must be paid in full at the time of delivery.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">Limitation of Liability</h2>
          <p>
            Indira Naturals is not liable for indirect or consequential damages arising from the use of
            our products or website, to the extent permitted by applicable law.
          </p>
        </section>
        <p className="text-xs text-brand-charcoal/50">
          [This is a general placeholder policy. Please have it reviewed by a legal professional before
          launch to ensure compliance with applicable consumer protection laws.]
        </p>
      </div>
    </div>
  );
}
