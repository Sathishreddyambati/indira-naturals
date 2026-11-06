import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { db } from "@/db";
import { coupons, orderItems, orders, productVariants } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const schema = z.object({
  orderNumber: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!rateLimit(`verify:${ip}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid verification payload" }, { status: 400 });
  }
  const { orderNumber, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Payment signature verification failed" }, { status: 400 });
  }

  const orderRows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  const order = orderRows[0];
  if (!order || order.razorpayOrderId !== razorpay_order_id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Idempotency guard: only process the first successful verification for this order.
  if (order.paymentStatus === "paid") {
    return NextResponse.json({ ok: true, orderNumber, alreadyProcessed: true });
  }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  for (const item of items) {
    await db
      .update(productVariants)
      .set({ stock: sql`GREATEST(${productVariants.stock} - ${item.quantity}, 0)` })
      .where(eq(productVariants.id, item.variantId));
  }

  if (order.couponCode) {
    await db.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.code, order.couponCode));
  }

  await db
    .update(orders)
    .set({
      paymentStatus: "paid",
      status: "confirmed",
      razorpayPaymentId: razorpay_payment_id,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id));

  return NextResponse.json({ ok: true, orderNumber });
}
