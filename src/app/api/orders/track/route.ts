import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const schema = z.object({
  orderNumber: z.string().trim().min(3),
  email: z.string().trim().email(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!rateLimit(`track:${ip}`, 15, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a valid order number and email" }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, parsed.data.orderNumber.toUpperCase()))
    .limit(1);
  const order = rows[0];

  if (!order || order.email.toLowerCase() !== parsed.data.email.toLowerCase()) {
    return NextResponse.json({ error: "No matching order found. Check your order number and email." }, { status: 404 });
  }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    trackingNumber: order.trackingNumber,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    createdAt: order.createdAt,
    items: items.map((i) => ({
      productName: i.productName,
      variantLabel: i.variantLabel,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
      productImage: i.productImage,
    })),
  });
}
