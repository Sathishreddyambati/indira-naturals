import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutGuard from "@/components/checkout/CheckoutGuard";
import { getSiteSettings } from "@/db/queries";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { toNumber } from "@/lib/money";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const settings = await getSiteSettings();
  const razorpayEnabled = settings.onlinePaymentEnabled && isRazorpayConfigured();

  return (
    <div className="container-site py-10 lg:py-14">
      <h1 className="mb-8 font-serif text-3xl text-brand-forest">Checkout</h1>
      <Suspense>
        <CheckoutGuard>
          <CheckoutForm
            codEnabled={settings.codEnabled}
            razorpayEnabled={razorpayEnabled}
            freeShippingThreshold={toNumber(settings.freeShippingThreshold)}
            flatShippingRate={toNumber(settings.flatShippingRate)}
            brandName="Indira Naturals"
          />
        </CheckoutGuard>
      </Suspense>
    </div>
  );
}
