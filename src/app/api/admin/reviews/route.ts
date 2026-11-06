import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const rows = await db
    .select({
      id: reviews.id,
      productId: reviews.productId,
      productName: products.name,
      customerName: reviews.customerName,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      verifiedPurchase: reviews.verifiedPurchase,
      status: reviews.status,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .innerJoin(products, eq(reviews.productId, products.id))
    .orderBy(desc(reviews.createdAt));

  return NextResponse.json(rows);
}
