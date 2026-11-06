"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, WishlistEntry } from "@/lib/types";
import { toast } from "sonner";

const CART_KEY = "indira_cart_v1";
const WISHLIST_KEY = "indira_wishlist_v1";

type CartContextValue = {
  lines: CartLine[];
  wishlist: WishlistEntry[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  removeFromCart: (variantId: number) => void;
  clearCart: () => void;
  toggleWishlist: (entry: WishlistEntry) => void;
  isWishlisted: (productId: number) => boolean;
  subtotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<WishlistEntry[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(readStorage(CART_KEY, []));
    setWishlist(readStorage(WISHLIST_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === line.variantId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, line.maxStock);
        return prev.map((l) =>
          l.variantId === line.variantId ? { ...l, quantity: nextQty } : l,
        );
      }
      return [...prev, { ...line, quantity: Math.min(quantity, line.maxStock) }];
    });
    toast.success(`${line.name} (${line.variantLabel}) added to cart`);
    setDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((variantId: number, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.variantId === variantId
            ? { ...l, quantity: Math.max(1, Math.min(quantity, l.maxStock)) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((variantId: number) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const toggleWishlist = useCallback((entry: WishlistEntry) => {
    setWishlist((prev) => {
      const exists = prev.find((w) => w.productId === entry.productId);
      if (exists) {
        toast("Removed from wishlist");
        return prev.filter((w) => w.productId !== entry.productId);
      }
      toast.success("Added to wishlist");
      return [...prev, entry];
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: number) => wishlist.some((w) => w.productId === productId),
    [wishlist],
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines],
  );
  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  const value: CartContextValue = {
    lines,
    wishlist,
    isDrawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
    subtotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
