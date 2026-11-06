"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { formatINR } from "@/lib/money";
import type { CartLine } from "@/lib/types";

type StoredOrder = {
  orderNumber: string;
  total: number;
  paymentMethod: "cod" | "razorpay";
  items: CartLine[];
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";
  const [stored, setStored] = useState<StoredOrder | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("indira_last_order");
    if (raw) {
      try {
        const parsed: StoredOrder = JSON.parse(raw);
        if (parsed.orderNumber === orderNumber) setStored(parsed);
      } catch {
        // ignore malformed storage
      }
    }
  }, [orderNumber]);

  return (
    <div className="container-site flex flex-col items-center py-16 text-center lg:py-24">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-leaf/15 text-brand-leaf">
        <CheckCircle2 size={40} />
      </div>
      <h1 className="mt-6 font-serif text-3xl text-brand-forest">Thank you for your order!</h1>
      <p className="mt-3 max-w-md text-brand-charcoal/70">
        Your order has been placed successfully. We&apos;ve recorded the details below — a confirmation
        will be sent to your email once our notification service is configured.
      </p>

      <div className="mt-8 w-full max-w-lg rounded-2xl border border-brand-brown/10 bg-white p-6 text-left shadow-card">
        <div className="flex items-center justify-between border-b border-brand-brown/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-charcoal/50">Order Number</p>
            <p className="font-serif text-xl text-brand-forest">{orderNumber || "—"}</p>
          </div>
          {stored && (
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-brand-charcoal/50">Payment</p>
              <p className="font-medium">{stored.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}</p>
            </div>
          )}
        </div>

        {stored ? (
          <>
            <ul className="flex flex-col gap-3 py-4">
              {stored.items.map((item) => (
                <li key={item.variantId} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-brand-cream">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-brand-charcoal/60">{item.variantLabel} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-brand-brown/10 pt-4 font-serif text-lg font-semibold">
              <span>Total Paid / Payable</span>
              <span>{formatINR(stored.total)}</span>
            </div>
          </>
        ) : (
          <p className="py-4 text-sm text-brand-charcoal/60">
            Order details aren&apos;t available in this session. You can look up your order anytime using
            the Track Order page with your order number and email.
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/shop" className="rounded-full bg-brand-forest px-7 py-3 text-sm font-semibold text-brand-ivory hover:bg-brand-leaf">
          Continue Shopping
        </Link>
        <Link href="/track-order" className="rounded-full border border-brand-forest px-7 py-3 text-sm font-semibold text-brand-forest hover:bg-brand-forest hover:text-brand-ivory">
          Track Your Order
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
