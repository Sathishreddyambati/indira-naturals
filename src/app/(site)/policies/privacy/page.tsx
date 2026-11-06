import type { Metadata } from "next";
import { getSiteSettings } from "@/db/queries";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/policies/privacy" },
};

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  return (
    <div className="container-site max-w-3xl py-12 lg:py-16">
      <h1 className="font-serif text-3xl text-brand-forest">Privacy Policy</h1>
      <div className="mt-6 flex flex-col gap-5 text-brand-charcoal/80">
        <p>
          This Privacy Policy explains how Indira Naturals (&quot;we&quot;, &quot;us&quot;) collects, uses,
          and protects your personal information when you use this website.
        </p>
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">Information We Collect</h2>
          <p>
            When you place an order, we collect your name, email address, phone number, and shipping
            address to fulfil your order. When you contact us or subscribe to our newsletter, we collect
            your name and email address.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">How We Use Your Information</h2>
          <p>
            We use your information solely to process orders, provide customer support, and — if you
            opt in — send occasional newsletter updates. We do not sell your personal information to
            third parties.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">Payment Information</h2>
          <p>
            We do not store your card, UPI, or bank details. Online payments are processed securely by
            our payment gateway partner (Razorpay), and payment verification is performed on our server.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">Data Retention &amp; Security</h2>
          <p>
            We retain order information as required for business and legal purposes and apply reasonable
            technical safeguards to protect your data from unauthorized access.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif text-xl text-brand-forest">Contact Us</h2>
          <p>
            For privacy-related questions, please contact us at {settings.supportEmail}.
          </p>
        </section>
        <p className="text-xs text-brand-charcoal/50">
          [This is a general placeholder policy. Please have it reviewed by a legal professional before
          launch to ensure compliance with applicable data protection laws.]
        </p>
      </div>
    </div>
  );
}
