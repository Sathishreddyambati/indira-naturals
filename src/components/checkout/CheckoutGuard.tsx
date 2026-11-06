"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCart } from "@/lib/cart-context";

export default function CheckoutGuard({ children }: { children: ReactNode }) {
  const { lines } = useCart();

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-brand-brown/30 py-20 text-center">
        <p className="font-serif text-xl text-brand-forest">Your cart is empty</p>
        <p className="text-sm text-brand-charcoal/60">Add a few products before heading to checkout.</p>
        <Link href="/shop" className="rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-brand-ivory hover:bg-brand-leaf">
          Shop Our Powders
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
