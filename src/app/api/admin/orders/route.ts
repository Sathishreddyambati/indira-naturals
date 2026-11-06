import { NextResponse } from "next/server";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { desc, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const orderIds = allOrders.map((o) => o.id);
  const items = orderIds.length > 0 ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds)) : [];

  const data = allOrders.map((o) => ({
    ...o,
    items: items.filter((i) => i.orderId === o.id),
  }));

  return NextResponse.json(data);
}
