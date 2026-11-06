"use client";

import { useState } from "react";
import type { ProductDTO } from "@/lib/types";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import RevealOnScroll from "./RevealOnScroll";

export default function ProductGrid({ products }: { products: ProductDTO[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductDTO | null>(null);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-brown/30 bg-white/50 p-12 text-center text-brand-charcoal/60">
        No products match your filters right now. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <RevealOnScroll key={product.id} delay={Math.min(i, 6) * 0.05}>
            <ProductCard product={product} onQuickView={setQuickViewProduct} />
          </RevealOnScroll>
        ))}
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
