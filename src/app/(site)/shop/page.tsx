import type { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "@/components/shop/ShopClient";
import { getAllPublishedProducts } from "@/db/queries";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop Indira Naturals ginger, garlic, ginger garlic, onion and tomato powders — 100% pure, no preservatives, no additives.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getAllPublishedProducts();
  return (
    <Suspense fallback={<div className="container-site py-20 text-center text-brand-charcoal/50">Loading products…</div>}>
      <ShopClient products={products} />
    </Suspense>
  );
}
