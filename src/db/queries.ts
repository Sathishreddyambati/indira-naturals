import { db } from "@/db";
import { products, productVariants, reviews, siteSettings } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import type { ProductDTO, ProductVariantDTO } from "@/lib/types";
import { toNumber } from "@/lib/money";

function mapVariant(v: typeof productVariants.$inferSelect): ProductVariantDTO {
  return {
    id: v.id,
    label: v.label,
    weightGrams: v.weightGrams,
    sku: v.sku,
    price: toNumber(v.price),
    comparePrice: v.comparePrice ? toNumber(v.comparePrice) : null,
    stock: v.stock,
    isDefault: v.isDefault,
  };
}

export async function getAllPublishedProducts(): Promise<ProductDTO[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.status, "published"))
    .orderBy(products.id);

  const variantRows = await db.select().from(productVariants).orderBy(productVariants.sortOrder);

  return rows.map((p) => ({
    ...p,
    galleryImages: p.galleryImages ?? [],
    avgRating: toNumber(p.avgRating),
    variants: variantRows
      .filter((v) => v.productId === p.id)
      .map(mapVariant),
  }));
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  const p = rows[0];
  if (!p) return null;
  const variantRows = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, p.id))
    .orderBy(productVariants.sortOrder);
  return {
    ...p,
    galleryImages: p.galleryImages ?? [],
    avgRating: toNumber(p.avgRating),
    variants: variantRows.map(mapVariant),
  };
}

export async function getProductsByIds(ids: number[]): Promise<ProductDTO[]> {
  if (ids.length === 0) return [];
  const rows = await db.select().from(products).where(inArray(products.id, ids));
  const variantRows = await db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.productId, ids));
  return rows.map((p) => ({
    ...p,
    galleryImages: p.galleryImages ?? [],
    avgRating: toNumber(p.avgRating),
    variants: variantRows.filter((v) => v.productId === p.id).map(mapVariant),
  }));
}

export async function getApprovedReviewsForProduct(productId: number) {
  return db
    .select()
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.status, "approved")))
    .orderBy(reviews.createdAt);
}

export async function getFeaturedReviews(limit = 6) {
  const rows = await db
    .select({
      id: reviews.id,
      customerName: reviews.customerName,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      verifiedPurchase: reviews.verifiedPurchase,
      createdAt: reviews.createdAt,
      productId: reviews.productId,
      productName: products.name,
      productSlug: products.slug,
    })
    .from(reviews)
    .innerJoin(products, eq(reviews.productId, products.id))
    .where(eq(reviews.status, "approved"))
    .orderBy(reviews.createdAt)
    .limit(limit);
  return rows;
}

export type SiteSettingsDTO = typeof siteSettings.$inferSelect;

export async function getSiteSettings(): Promise<SiteSettingsDTO> {
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  if (rows[0]) return rows[0];
  const inserted = await db.insert(siteSettings).values({ id: 1 }).returning();
  return inserted[0];
}
