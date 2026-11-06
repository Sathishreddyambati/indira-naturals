import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products, reviews, contactMessages } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const allOrders = await db.select().from(orders);
  const totalOrders = allOrders.length;
  const paidOrders = allOrders.filter((o) => o.paymentStatus === "paid" || o.paymentMethod === "cod");
  const totalRevenue = paidOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
  const ordersByStatus = allOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const [{ count: productCount }] = await db.select({ count: sql<number>`count(*)::int` }).from(products);
  const [{ count: pendingReviewCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(reviews)
    .where(eq(reviews.status, "pending"));
  const [{ count: newMessageCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contactMessages)
    .where(eq(contactMessages.status, "new"));

  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return NextResponse.json({
    totalOrders,
    totalRevenue,
    pendingOrders,
    ordersByStatus,
    productCount,
    pendingReviewCount,
    newMessageCount,
    recentOrders,
  });
}
