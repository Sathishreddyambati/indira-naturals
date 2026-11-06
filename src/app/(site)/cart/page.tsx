"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/money";

export default function CartPage() {
  const { lines, updateQuantity, removeFromCart, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState("");

  if (lines.length === 0) {
    return (
      <div className="container-site flex flex-col items-center justify-center gap-5 py-24 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-brand-sand text-brand-forest">
          <ShoppingBag size={36} />
        </div>
        <h1 className="font-serif text-2xl text-brand-forest">Your cart is empty</h1>
        <p className="max-w-sm text-brand-charcoal/60">
          Looks like you haven&apos;t added any natural goodness yet. Explore our powders to get started.
        </p>
        <Link href="/shop" className="rounded-full bg-brand-forest px-7 py-3 text-sm font-semibold text-brand-ivory hover:bg-brand-leaf">
          Shop Our Powders
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site py-10 lg:py-14">
      <h1 className="mb-8 font-serif text-3xl text-brand-forest">Your Cart</h1>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col divide-y divide-brand-brown/10 rounded-2xl border border-brand-brown/10 bg-brand-sand-light">
          {lines.map((line) => (
            <div key={line.variantId} className="flex gap-4 p-4 sm:p-5">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-brand-sand">
                <Image src={line.image} alt={line.name} fill sizes="96px" className="object-contain" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/product/${line.slug}`} className="font-serif text-lg text-brand-forest hover:underline">
                      {line.name}
                    </Link>
                    <p className="text-sm text-brand-charcoal/60">Pack: {line.variantLabel}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(line.variantId)}
                    aria-label={`Remove ${line.name}`}
                    className="text-brand-charcoal/40 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-brand-brown/30">
                    <button
                      className="px-3 py-1.5"
                      onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm">{line.quantity}</span>
                    <button
                      className="px-3 py-1.5"
                      onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                      disabled={line.quantity >= line.maxStock}
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="font-serif text-lg font-semibold">{formatINR(line.price * line.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-brand-brown/10 bg-brand-sand-light p-6 shadow-card">
          <h2 className="mb-4 font-serif text-xl text-brand-forest">Order Summary</h2>
          <div className="mb-4 flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Discount code"
              className="flex-1 rounded-full border border-brand-brown/30 px-4 py-2 text-sm outline-none focus:border-brand-forest"
            />
          </div>
          <p className="mb-4 text-xs text-brand-charcoal/50">
            Discount codes are verified securely at checkout.
          </p>
          <div className="flex items-center justify-between border-t border-brand-brown/10 py-3 text-sm">
            <span className="text-brand-charcoal/70">Subtotal</span>
            <span className="font-semibold">{formatINR(subtotal)}</span>
          </div>
          <p className="mb-4 text-xs text-brand-charcoal/50">
            Shipping and final discount will be calculated at checkout.
          </p>
          <Link
            href={couponCode ? `/checkout?coupon=${encodeURIComponent(couponCode)}` : "/checkout"}
            className="block rounded-full bg-brand-forest px-6 py-3.5 text-center text-sm font-semibold text-brand-ivory transition-colors hover:bg-brand-leaf"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/shop"
            className="mt-3 block rounded-full border border-brand-forest px-6 py-3.5 text-center text-sm font-semibold text-brand-forest transition-colors hover:bg-brand-forest hover:text-brand-ivory"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
