import { NextResponse } from "next/server";
import { db } from "@/db";
import { coupons, orderItems, orders, productVariants, products, siteSettings } from "@/db/schema";
import { checkoutSchema } from "@/lib/validation";
import { eq, inArray, sql } from "drizzle-orm";
import { generateOrderNumber } from "@/lib/order-number";
import { computeDiscount, computeShipping } from "@/lib/pricing";
import { toNumber } from "@/lib/money";
import { getRazorpayClient, isRazorpayConfigured } from "@/lib/razorpay";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createIndiraOrder } from "@/lib/indira-firestore";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!rateLimit(`checkout:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid order data" }, { status: 400 });
  }
  const input = parsed.data;

  const settingsRows = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  const settings = settingsRows[0];
  if (!settings) {
    return NextResponse.json({ error: "Store is not configured" }, { status: 500 });
  }

  if (input.paymentMethod === "cod" && !settings.codEnabled) {
    return NextResponse.json({ error: "Cash on Delivery is currently unavailable" }, { status: 400 });
  }
  if (input.paymentMethod === "razorpay" && (!settings.onlinePaymentEnabled || !isRazorpayConfigured())) {
    return NextResponse.json({ error: "Online payment is currently unavailable" }, { status: 400 });
  }

  const variantIds = input.items.map((i) => i.variantId);
  const variantRows = await db
    .select({
      id: productVariants.id,
      productId: productVariants.productId,
      label: productVariants.label,
      price: productVariants.price,
      stock: productVariants.stock,
    })
    .from(productVariants)
    .where(inArray(productVariants.id, variantIds));

  if (variantRows.length !== new Set(variantIds).size) {
    return NextResponse.json({ error: "One or more items are no longer available" }, { status: 400 });
  }

  const productIds = Array.from(new Set(variantRows.map((v) => v.productId)));
  const productRows = await db.select().from(products).where(inArray(products.id, productIds));

  let computedLines;
  try {
    computedLines = input.items.map((item) => {
      const variant = variantRows.find((v) => v.id === item.variantId)!;
      const product = productRows.find((p) => p.id === variant.productId)!;
      if (item.quantity > variant.stock) {
        throw new Error(`Only ${variant.stock} unit(s) of ${product.name} (${variant.label}) are in stock`);
      }
      const unitPrice = toNumber(variant.price);
      return {
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: product.image,
        variantLabel: variant.label,
        unitPrice,
        quantity: item.quantity,
        lineTotal: unitPrice * item.quantity,
      };
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Stock error" }, { status: 400 });
  }

  const subtotal = computedLines.reduce((s, l) => s + l.lineTotal, 0);

  let coupon = null;
  if (input.couponCode) {
    const couponRows = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, input.couponCode.toUpperCase()))
      .limit(1);
    if (!couponRows[0]) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }
    coupon = couponRows[0];
  }

  const discount = computeDiscount(coupon, subtotal);
  if (input.couponCode && discount === 0) {
    return NextResponse.json(
      { error: "This coupon is not valid for your order" },
      { status: 400 },
    );
  }

  const shipping = computeShipping(subtotal - discount, toNumber(settings.freeShippingThreshold), toNumber(settings.flatShippingRate));
  const total = Math.max(0, subtotal - discount + shipping);
  const orderNumber = generateOrderNumber();

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerName: input.customerName,
      email: input.email,
      phone: input.phone,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2 || null,
      city: input.city,
      state: input.state,
      pincode: input.pincode,
      deliveryInstructions: input.deliveryInstructions || null,
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      couponCode: coupon ? coupon.code : null,
      paymentMethod: input.paymentMethod,
      paymentStatus: "pending",
      status: "pending",
    })
    .returning();

  await db.insert(orderItems).values(
    computedLines.map((l) => ({
      orderId: order.id,
      productId: l.productId,
      variantId: l.variantId,
      productName: l.productName,
      productSlug: l.productSlug,
      productImage: l.productImage,
      variantLabel: l.variantLabel,
      unitPrice: l.unitPrice.toFixed(2),
      quantity: l.quantity,
      lineTotal: l.lineTotal.toFixed(2),
    })),
  );

  if (input.paymentMethod === "cod") {
    // Reserve stock immediately for committed COD orders.
    for (const l of computedLines) {
      await db
        .update(productVariants)
        .set({ stock: sql`${productVariants.stock} - ${l.quantity}` })
        .where(eq(productVariants.id, l.variantId));
    }
    if (coupon) {
      await db.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.id, coupon.id));
    }
    await db.update(orders).set({ status: "confirmed" }).where(eq(orders.id, order.id));
    try {
      await createIndiraOrder(orderNumber, {
    customerName: input.customerName,
    email: input.email.toLowerCase(),
    phone: input.phone,

    addressLine1: input.addressLine1,
    addressLine2: input.addressLine2 || "",
    city: input.city,
    state: input.state,
    pincode: input.pincode,
    deliveryInstructions: input.deliveryInstructions || "",

    items: computedLines,

    subtotal,
    discount,
    shipping,
    total,

    couponCode: coupon?.code || null,

    paymentMethod: "cod",
    paymentStatus: "pending",
    status: "confirmed",

    trackingNumber: null,

    statusHistory: [
      {
        status: "pending",
        note: "Order placed",
        createdAt: new Date().toISOString(),
      },
      {
        status: "confirmed",
        note: "Order confirmed",
        createdAt: new Date().toISOString(),
      },
    ],
  });
          });
} catch (firestoreError) {
  console.error("COD Firestore sync failed:", firestoreError);
      }

    return NextResponse.json({
      orderNumber,
      paymentMethod: "cod",
      total,
    });
  }

  // Razorpay flow — create a Razorpay order; stock is reserved only after verified payment.
  try {
    const razorpay = getRazorpayClient();
    const rpOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: orderNumber,
      notes: { orderNumber },
    });
    await db.update(orders).set({ razorpayOrderId: rpOrder.id }).where(eq(orders.id, order.id));

    return NextResponse.json({
      orderNumber,
      paymentMethod: "razorpay",
      total,
      razorpayOrderId: rpOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    await db.update(orders).set({ status: "cancelled", paymentStatus: "failed" }).where(eq(orders.id, order.id));
    return NextResponse.json(
      { error: "Could not initiate online payment. Please try again or choose Cash on Delivery." },
      { status: 502 },
    );
  }
}
