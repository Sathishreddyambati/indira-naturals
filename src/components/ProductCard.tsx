"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { formatINR } from "@/lib/money";
import { useCart } from "@/lib/cart-context";
import StarRating from "./StarRating";

export default function ProductCard({
  product,
  onQuickView,
}: {
  product: ProductDTO;
  onQuickView?: (product: ProductDTO) => void;
}) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const defaultVariant =
    product.variants.find((v) => v.isDefault) ?? product.variants[0];
  const inStock = (defaultVariant?.stock ?? 0) > 0;
  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-brown/10 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-white">
        <Link href={`/product/${product.slug}`} className="block h-full w-full" aria-label={product.name}>
          <Image
            src={product.image}
            alt={`${product.name} by Indira Naturals`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestseller && (
            <span className="rounded-full bg-brand-forest px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-ivory">
              Best Seller
            </span>
          )}
          {!inStock && (
            <span className="rounded-full bg-brand-charcoal px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              Out of Stock
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            toggleWishlist({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.image,
              price: minPrice,
            })
          }
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-forest shadow-sm transition-transform hover:scale-110"
        >
          <Heart size={16} className={wishlisted ? "fill-brand-forest" : ""} />
        </button>

        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-10 items-center gap-1.5 rounded-full bg-brand-ivory/95 px-4 py-2 text-xs font-semibold text-brand-forest opacity-0 shadow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Eye size={14} /> Quick View
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-brand-leaf">{product.category}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-lg leading-snug text-brand-forest hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-brand-charcoal/70">{product.shortDescription}</p>

        {product.reviewCount > 0 && (
          <StarRating rating={product.avgRating} size={14} showValue />
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <span className="font-serif text-lg font-semibold text-brand-charcoal">
              {formatINR(minPrice)}
            </span>
            <span className="ml-1 text-xs text-brand-charcoal/60">onwards</span>
          </div>
          <button
            type="button"
            disabled={!inStock}
            onClick={() =>
              defaultVariant &&
              addToCart({
                productId: product.id,
                variantId: defaultVariant.id,
                slug: product.slug,
                name: product.name,
                image: product.image,
                variantLabel: defaultVariant.label,
                price: defaultVariant.price,
                maxStock: defaultVariant.stock,
              })
            }
            className="grid h-10 w-10 place-items-center rounded-full bg-brand-forest text-brand-ivory transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:bg-brand-charcoal/20"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
