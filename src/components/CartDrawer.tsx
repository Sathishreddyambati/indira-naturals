"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/money";

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, lines, updateQuantity, removeFromCart, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-brand-charcoal/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-brand-sand-light shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-brand-brown/15 px-5 py-4">
              <h2 className="font-serif text-xl text-brand-forest">Your Cart ({lines.length})</h2>
              <button
                onClick={closeDrawer}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-brand-sand"
              >
                <X size={18} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-sand text-brand-forest">
                  <ShoppingBag size={32} />
                </div>
                <p className="font-serif text-lg text-brand-forest">Your cart is empty</p>
                <p className="text-sm text-brand-charcoal/60">
                  Looks like you haven&apos;t added any natural goodness yet.
                </p>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="rounded-full bg-brand-forest px-6 py-2.5 text-sm font-semibold text-brand-ivory hover:bg-brand-leaf"
                >
                  Shop Our Powders
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="flex flex-col gap-4">
                    {lines.map((line) => (
                      <li key={line.variantId} className="flex gap-3 border-b border-brand-brown/10 pb-4">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-brand-sand-light">
                          <Image src={line.image} alt={line.name} fill className="object-contain" sizes="80px" />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link href={`/product/${line.slug}`} onClick={closeDrawer}>
                                <p className="font-medium leading-snug text-brand-charcoal hover:underline">
                                  {line.name}
                                </p>
                              </Link>
                              <p className="text-xs text-brand-charcoal/60">Pack: {line.variantLabel}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(line.variantId)}
                              aria-label={`Remove ${line.name} from cart`}
                              className="text-brand-charcoal/40 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-brand-brown/30">
                              <button
                                className="px-2.5 py-1"
                                onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center text-sm">{line.quantity}</span>
                              <button
                                className="px-2.5 py-1"
                                onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                                aria-label="Increase quantity"
                                disabled={line.quantity >= line.maxStock}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="font-semibold">{formatINR(line.price * line.quantity)}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-brand-brown/15 px-5 py-4">
                  <div className="mb-3 flex items-center justify-between text-sm text-brand-charcoal/70">
                    <span>Subtotal</span>
                    <span className="font-serif text-lg font-semibold text-brand-charcoal">
                      {formatINR(subtotal)}
                    </span>
                  </div>
                  <p className="mb-4 text-xs text-brand-charcoal/50">
                    Shipping and discounts calculated at checkout.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/checkout"
                      onClick={closeDrawer}
                      className="rounded-full bg-brand-forest px-5 py-3 text-center text-sm font-semibold text-brand-ivory transition-colors hover:bg-brand-leaf"
                    >
                      Proceed to Checkout
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeDrawer}
                      className="rounded-full border border-brand-forest px-5 py-3 text-center text-sm font-semibold text-brand-forest transition-colors hover:bg-brand-forest hover:text-brand-ivory"
                    >
                      View Cart
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
