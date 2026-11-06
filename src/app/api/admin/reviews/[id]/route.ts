import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { adminReviewUpdateSchema } from "@/lib/validation";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = adminReviewUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const reviewRows = await db.select().from(reviews).where(eq(reviews.id, Number(id))).limit(1);
  const review = reviewRows[0];
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  await db.update(reviews).set({ status: parsed.data.status }).where(eq(reviews.id, Number(id)));

  const approvedAgg = await db
    .select({ rating: reviews.rating })
    .from(reviews)
    .where(and(eq(reviews.productId, review.productId), eq(reviews.status, "approved")));

  const count = approvedAgg.length;
  const avg = count > 0 ? approvedAgg.reduce((s, r) => s + r.rating, 0) / count : 0;

  await db
    .update(products)
    .set({ avgRating: avg.toFixed(2), reviewCount: count })
    .where(eq(products.id, review.productId));

  return NextResponse.json({ ok: true });
}
