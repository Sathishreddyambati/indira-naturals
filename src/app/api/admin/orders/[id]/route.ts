import { NextResponse } from "next/server";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { updateIndiraOrder } from "@/lib/indira-firestore";
import { adminOrderUpdateSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const { id } = await params;
  const rows = await db.select().from(orders).where(eq(orders.id, Number(id))).limit(1);
  if (!rows[0]) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, Number(id)));

  return NextResponse.json({ ...rows[0], items });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = adminOrderUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update payload" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.status) updates.status = parsed.data.status;
  if (parsed.data.paymentStatus) updates.paymentStatus = parsed.data.paymentStatus;
  if (parsed.data.trackingNumber !== undefined) updates.trackingNumber = parsed.data.trackingNumber;

  await db.update(orders).set(updates).where(eq(orders.id, Number(id)));
  return NextResponse.json({ ok: true });
}
