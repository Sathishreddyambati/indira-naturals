"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest" | "popularity";

const PAGE_SIZE = 8;

export default function ShopClient({ products }: { products: ProductDTO[] }) {
  const searchParams = useSearchParams();
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );
  const maxPrice = useMemo(
    () => Math.max(...products.flatMap((p) => p.variants.map((v) => v.price)), 500),
    [products],
  );

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category") as string] : [],
  );
  const [priceMax, setPriceMax] = useState(maxPrice);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(searchParams.get("bestseller") === "1");
  const [sort, setSort] = useState<SortOption>("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.category));
    }

    if (bestsellerOnly) {
      list = list.filter((p) => p.bestseller);
    }

    if (inStockOnly) {
      list = list.filter((p) => p.variants.some((v) => v.stock > 0));
    }

    list = list.filter((p) => Math.min(...p.variants.map((v) => v.price)) <= priceMax);

    switch (sort) {
      case "price-asc":
        list.sort(
          (a, b) => Math.min(...a.variants.map((v) => v.price)) - Math.min(...b.variants.map((v) => v.price)),
        );
        break;
      case "price-desc":
        list.sort(
          (a, b) => Math.min(...b.variants.map((v) => v.price)) - Math.min(...a.variants.map((v) => v.price)),
        );
        break;
      case "newest":
        list.sort((a, b) => b.id - a.id);
        break;
      case "popularity":
        list.sort((a, b) => b.reviewCount - a.reviewCount || b.avgRating - a.avgRating);
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestseller) - Number(a.bestseller));
    }

    return list;
  }, [products, query, selectedCategories, bestsellerOnly, inStockOnly, priceMax, sort]);

  const visible = filtered.slice(0, visibleCount);

  const FilterPanel = (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-charcoal/70">
          Category
        </h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="h-4 w-4 accent-brand-forest"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-charcoal/70">
          Max Price: ₹{priceMax}
        </h3>
        <input
          type="range"
          min={Math.min(...products.flatMap((p) => p.variants.map((v) => v.price)))}
          max={maxPrice}
          value={priceMax}
          onChange={(e) => {
            setPriceMax(Number(e.target.value));
            setVisibleCount(PAGE_SIZE);
          }}
          className="w-full accent-brand-forest"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              setVisibleCount(PAGE_SIZE);
            }}
            className="h-4 w-4 accent-brand-forest"
          />
          In stock only
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={bestsellerOnly}
            onChange={(e) => {
              setBestsellerOnly(e.target.checked);
              setVisibleCount(PAGE_SIZE);
            }}
            className="h-4 w-4 accent-brand-forest"
          />
          Best sellers only
        </label>
      </div>
    </div>
  );

  return (
    <div className="container-site py-10 lg:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-brand-forest">Shop Our Products</h1>
          <p className="mt-1 text-sm text-brand-charcoal/60">{filtered.length} products</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="relative min-w-0 flex-1 basis-full sm:basis-auto sm:w-72">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              type="search"
              placeholder="Search products..."
              className="w-full rounded-full border border-brand-brown/30 px-4 py-2.5 text-sm outline-none focus:border-brand-forest"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-full border border-brand-brown/30 px-4 py-2.5 text-sm outline-none focus:border-brand-forest"
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 rounded-full border border-brand-brown/30 px-4 py-2.5 text-sm font-semibold lg:hidden"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">{FilterPanel}</aside>

        <div>
          <ProductGrid products={visible} />
          {visibleCount < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="rounded-full border border-brand-forest px-8 py-3 text-sm font-semibold text-brand-forest transition-colors hover:bg-brand-forest hover:text-brand-ivory"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-brand-charcoal/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-brand-ivory p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-xl text-brand-forest">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            {FilterPanel}
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-6 w-full rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-brand-ivory"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
