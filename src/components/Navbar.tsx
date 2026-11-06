"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/why-us", label: "Why Us" },
  { href: "/our-story", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { itemCount, wishlist, openDrawer } = useCart();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/shop?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-white/70 bg-white/70 shadow-sm backdrop-blur-xl"
          : "border-white/60 bg-white/55 backdrop-blur-md"
      }`}
    >
      <div className="container-site flex h-20 items-center justify-between gap-4">
        <button
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand-cream lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Link href="/" className="flex items-center gap-2" aria-label="Indira Naturals home">
          <Image
            src="/images/logo-sm.png"
            alt="Indira Naturals — Pure, Fresh, Natural"
            width={560}
            height={315}
            priority
            className="logo-glow h-14 w-auto object-contain sm:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-brand-charcoal transition-colors hover:text-brand-leaf"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand-cream"
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Search products"
          >
            <Search size={19} />
          </button>
          <Link
            href="/track-order"
            className="hidden h-10 w-10 place-items-center rounded-full hover:bg-brand-cream sm:grid"
            aria-label="Track order / account"
          >
            <User size={19} />
          </Link>
          <Link
            href="/wishlist"
            className="relative hidden h-10 w-10 place-items-center rounded-full hover:bg-brand-cream sm:grid"
            aria-label={`Wishlist (${wishlist.length} items)`}
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-brand-gold text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button
            className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-brand-cream"
            onClick={openDrawer}
            aria-label={`Cart (${itemCount} items)`}
          >
            <ShoppingBag size={19} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-brand-forest text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-brand-brown/10 bg-brand-ivory px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="container-site flex items-center gap-2">
            <Search size={18} className="text-brand-charcoal/50" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search for ginger, garlic or ginger garlic powder..."
              className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-brand-charcoal/40"
            />
            <button type="submit" className="text-sm font-semibold text-brand-forest">
              Search
            </button>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-brand-charcoal/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col gap-1 bg-brand-ivory p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Image src="/images/logo-sm.png" alt="Indira Naturals" width={560} height={315} className="h-12 w-auto" />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-brand-charcoal hover:bg-brand-cream"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-brand-charcoal hover:bg-brand-cream"
            >
              Wishlist
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-brand-charcoal hover:bg-brand-cream"
            >
              Track Order
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
