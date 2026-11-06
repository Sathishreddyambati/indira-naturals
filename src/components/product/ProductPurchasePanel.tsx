"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProductDTO } from "@/lib/types";
import { formatINR } from "@/lib/money";
import { useCart } from "@/lib/cart-context";
import StarRating from "@/components/StarRating";
import ShareButton from "@/components/ShareButton";

export default function ProductPurchasePanel({ product }: { product: ProductDTO }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [variantId, setVariantId] = useState(
    product.variants.find((v) => v.isDefault)?.id ?? product.variants[0]?.id,
  );
  const [qty, setQty] = useState(1);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const inStock = (variant?.stock ?? 0) > 0;
  const wishlisted = isWishlisted(product.id);

  function buildLine() {
    if (!variant) return null;
    return {
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      variantLabel: variant.label,
      price: variant.price,
      maxStock: variant.stock,
    };
  }

  function handleAddToCart() {
    const line = buildLine();
    if (!line) return;
    addToCart(line, qty);
  }

  function handleBuyNow() {
    const line = buildLine();
    if (!line) return;
    addToCart(line, qty);
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">
          {product.category}
        </p>
        <h1 className="mt-1 font-serif text-3xl text-brand-forest sm:text-4xl">{product.name}</h1>
        {product.reviewCount > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={product.avgRating} showValue />
            <span className="text-xs text-brand-charcoal/50">({product.reviewCount} reviews)</span>
          </div>
        )}
      </div>

      <p className="text-brand-charcoal/75">{product.shortDescription}</p>

      <div className="flex items-baseline gap-3">
        <span className="font-serif text-3xl font-semibold text-brand-charcoal">
          {variant ? formatINR(variant.price) : "—"}
        </span>
        {variant?.comparePrice && (
          <span className="text-lg text-brand-charcoal/40 line-through">
            {formatINR(variant.comparePrice)}
          </span>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
          Pack Size: <span className="text-brand-charcoal">{variant?.label}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setVariantId(v.id);
                setQty(1);
              }}
              disabled={v.stock === 0}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                v.id === variantId
                  ? "border-brand-forest bg-brand-forest text-brand-ivory"
                  : "border-brand-brown/30 text-brand-charcoal hover:border-brand-forest"
              } ${v.stock === 0 ? "cursor-not-allowed opacity-40" : ""}`}
            >
              {v.label} — {formatINR(v.price)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">Quantity</p>
        <div className="flex items-center rounded-full border border-brand-brown/30">
          <button
            className="px-3.5 py-2 text-lg disabled:opacity-30"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-medium">{qty}</span>
          <button
            className="px-3.5 py-2 text-lg disabled:opacity-30"
            onClick={() => setQty((q) => Math.min(variant?.stock ?? 1, q + 1))}
            disabled={!variant || qty >= variant.stock}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <span
          className={`text-xs font-medium ${inStock ? "text-brand-leaf" : "text-red-600"}`}
        >
          {inStock ? `${variant?.stock} in stock` : "Out of stock"}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="flex-1 rounded-full bg-brand-forest px-6 py-3.5 text-sm font-semibold text-brand-ivory transition-colors hover:bg-brand-leaf disabled:cursor-not-allowed disabled:bg-brand-charcoal/20"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!inStock}
          className="flex-1 rounded-full border-2 border-brand-forest px-6 py-3.5 text-sm font-semibold text-brand-forest transition-colors hover:bg-brand-forest hover:text-brand-ivory disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy Now
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-brand-brown/10 pt-4">
        <button
          onClick={() =>
            toggleWishlist({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.image,
              price: variant?.price ?? 0,
            })
          }
          className="text-sm font-medium text-brand-charcoal/70 hover:text-brand-forest"
        >
          {wishlisted ? "♥ Saved to wishlist" : "♡ Add to wishlist"}
        </button>
        <ShareButton title={product.name} />
      </div>
    </div>
  );
}
