"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/money";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="container-site flex flex-col items-center gap-4 py-24 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-brand-cream text-brand-forest">
          <Heart size={32} />
        </div>
        <h1 className="font-serif text-2xl text-brand-forest">Your wishlist is empty</h1>
        <p className="max-w-sm text-brand-charcoal/60">Save your favourite products here to shop them later.</p>
        <Link href="/shop" className="rounded-full bg-brand-forest px-7 py-3 text-sm font-semibold text-brand-ivory hover:bg-brand-leaf">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site py-10 lg:py-14">
      <h1 className="mb-8 font-serif text-3xl text-brand-forest">Your Wishlist</h1>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {wishlist.map((item) => (
          <div key={item.productId} className="overflow-hidden rounded-2xl border border-brand-brown/10 bg-white shadow-card">
            <Link href={`/product/${item.slug}`} className="relative block aspect-square overflow-hidden bg-brand-cream">
              <Image src={item.image} alt={item.name} fill sizes="25vw" className="object-contain" />
            </Link>
            <div className="p-4">
              <Link href={`/product/${item.slug}`} className="font-serif text-lg text-brand-forest hover:underline">
                {item.name}
              </Link>
              <p className="mt-1 font-semibold">{formatINR(item.price)}</p>
              <button
                onClick={() => toggleWishlist(item)}
                className="mt-3 w-full rounded-full border border-brand-forest px-4 py-2 text-xs font-semibold text-brand-forest hover:bg-brand-forest hover:text-brand-ivory"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
