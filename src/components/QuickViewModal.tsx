"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { formatINR } from "@/lib/money";
import { useCart } from "@/lib/cart-context";

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: ProductDTO | null;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const [variantId, setVariantId] = useState<number | null>(
    product ? (product.variants.find((v) => v.isDefault)?.id ?? product.variants[0]?.id ?? null) : null,
  );
  const [qty, setQty] = useState(1);

  const variant = product?.variants.find((v) => v.id === variantId) ?? product?.variants[0];

  function handleClose() {
    setQty(1);
    onClose();
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-charcoal/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view of ${product.name}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-[88vh] w-full max-w-3xl grid-cols-1 overflow-y-auto rounded-2xl bg-white shadow-2xl sm:grid-cols-2"
          >
            <button
              onClick={handleClose}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-charcoal shadow"
            >
              <X size={18} />
            </button>

            <div className="relative aspect-[16/9] bg-white sm:aspect-auto">
              <Image src={product.image} alt={product.name} fill className="object-contain" sizes="400px" />
            </div>

            <div className="flex flex-col gap-3 p-6">
              <p className="text-xs uppercase tracking-wide text-brand-leaf">{product.category}</p>
              <h2 className="font-serif text-2xl text-brand-forest">{product.name}</h2>
              <p className="text-sm text-brand-charcoal/70">{product.shortDescription}</p>
              <p className="font-serif text-xl font-semibold">
                {variant ? formatINR(variant.price) : ""}
                {variant?.comparePrice && (
                  <span className="ml-2 text-sm font-normal text-brand-charcoal/40 line-through">
                    {formatINR(variant.comparePrice)}
                  </span>
                )}
              </p>

              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
                  Pack size
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(v.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        v.id === variantId
                          ? "border-brand-forest bg-brand-forest text-brand-ivory"
                          : "border-brand-brown/30 text-brand-charcoal hover:border-brand-forest"
                      } ${v.stock === 0 ? "cursor-not-allowed opacity-40" : ""}`}
                      disabled={v.stock === 0}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Qty</p>
                <div className="flex items-center rounded-full border border-brand-brown/30">
                  <button
                    className="px-3 py-1 text-lg"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{qty}</span>
                  <button
                    className="px-3 py-1 text-lg"
                    onClick={() => setQty((q) => Math.min(variant?.stock ?? 1, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="text-xs text-brand-charcoal/60">
                {variant && variant.stock > 0 ? `${variant.stock} in stock` : "Currently out of stock"}
              </p>

              <div className="mt-2 flex gap-3">
                <button
                  disabled={!variant || variant.stock === 0}
                  onClick={() => {
                    if (!variant) return;
                    addToCart(
                      {
                        productId: product.id,
                        variantId: variant.id,
                        slug: product.slug,
                        name: product.name,
                        image: product.image,
                        variantLabel: variant.label,
                        price: variant.price,
                        maxStock: variant.stock,
                      },
                      qty,
                    );
                    handleClose();
                  }}
                  className="flex-1 rounded-full bg-brand-forest px-5 py-3 text-sm font-semibold text-brand-ivory transition-colors hover:bg-brand-leaf disabled:bg-brand-charcoal/20"
                >
                  Add to Cart
                </button>
                <Link
                  href={`/product/${product.slug}`}
                  className="flex-1 rounded-full border border-brand-forest px-5 py-3 text-center text-sm font-semibold text-brand-forest transition-colors hover:bg-brand-forest hover:text-brand-ivory"
                >
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
