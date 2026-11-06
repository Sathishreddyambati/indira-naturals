import { NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { adminCouponSchema } from "@/lib/validation";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, response } = await requireAdmin();
  if (!session) return response;
  const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const json = await req.json().catch(() => null);
  const parsed = adminCouponSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid coupon data" }, { status: 400 });
  }
  const input = parsed.data;

  const existing = await db.select().from(coupons).where(eq(coupons.code, input.code.toUpperCase())).limit(1);
  if (existing[0]) {
    return NextResponse.json({ error: "A coupon with this code already exists" }, { status: 400 });
  }

  await db.insert(coupons).values({
    code: input.code.toUpperCase(),
    type: input.type,
    value: input.value.toFixed(2),
    minOrderAmount: input.minOrderAmount.toFixed(2),
    active: input.active,
    usageLimit: input.usageLimit ?? null,
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
  });

  return NextResponse.json({ ok: true });
}
