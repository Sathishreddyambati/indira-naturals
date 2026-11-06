import { NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { adminCouponSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = adminCouponSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid coupon data" }, { status: 400 });
  }
  const input = parsed.data;

  const updates: Record<string, unknown> = {};
  if (input.code) updates.code = input.code.toUpperCase();
  if (input.type) updates.type = input.type;
  if (input.value !== undefined) updates.value = input.value.toFixed(2);
  if (input.minOrderAmount !== undefined) updates.minOrderAmount = input.minOrderAmount.toFixed(2);
  if (input.active !== undefined) updates.active = input.active;
  if (input.usageLimit !== undefined) updates.usageLimit = input.usageLimit;
  if (input.expiresAt !== undefined) updates.expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;

  await db.update(coupons).set(updates).where(eq(coupons.id, Number(id)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (!session) return response;
  const { id } = await params;
  await db.delete(coupons).where(eq(coupons.id, Number(id)));
  return NextResponse.json({ ok: true });
}
