import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const schema = z.object({
  productId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  customerName: z.string().trim().min(2).max(120),
  title: z.string().trim().max(160).optional().or(z.literal("")),
  body: z.string().trim().min(5).max(2000),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!rateLimit(`review:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const productRows = await db.select().from(products).where(eq(products.id, parsed.data.productId)).limit(1);
  if (!productRows[0]) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await db.insert(reviews).values({
    productId: parsed.data.productId,
    customerName: parsed.data.customerName,
    rating: parsed.data.rating,
    title: parsed.data.title || null,
    body: parsed.data.body,
    verifiedPurchase: false,
    status: "pending",
  });

  return NextResponse.json({ ok: true });
}
