import { toNumber } from "@/lib/money";
import type { coupons } from "@/db/schema";

export type CouponRow = typeof coupons.$inferSelect;

export function computeDiscount(coupon: CouponRow | null, subtotal: number): number {
  if (!coupon) return 0;
  if (!coupon.active) return 0;
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) return 0;
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) return 0;
  const minOrder = toNumber(coupon.minOrderAmount);
  if (subtotal < minOrder) return 0;

  const value = toNumber(coupon.value);
  if (coupon.type === "percent") {
    return Math.round((subtotal * value) / 100);
  }
  return Math.min(value, subtotal);
}

export function computeShipping(subtotal: number, freeThreshold: number, flatRate: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= freeThreshold ? 0 : flatRate;
}
