import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { adminProductSchema } from "@/lib/validation";
import { eq, and, ne } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const { id } = await params;
  const productId = Number(id);
  const rows = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  if (!rows[0]) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  const variantRows = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId))
    .orderBy(productVariants.sortOrder);

  return NextResponse.json({ ...rows[0], variants: variantRows });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const { id } = await params;
  const productId = Number(id);

  const json = await req.json().catch(() => null);
  const parsed = adminProductSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid product data" }, { status: 400 });
  }
  const input = parsed.data;

  const slugConflict = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, input.slug), ne(products.id, productId)))
    .limit(1);
  if (slugConflict[0]) {
    return NextResponse.json({ error: "Another product already uses this slug" }, { status: 400 });
  }

  await db
    .update(products)
    .set({
      slug: input.slug,
      name: input.name,
      shortDescription: input.shortDescription,
      description: input.description,
      category: input.category,
      image: input.image,
      galleryImages: input.galleryImages,
      ingredients: input.ingredients,
      netWeightLabel: input.netWeightLabel,
      usageInstructions: input.usageInstructions,
      storageInstructions: input.storageInstructions,
      allergenInfo: input.allergenInfo || null,
      skuPrefix: input.skuPrefix,
      status: input.status,
      featured: input.featured,
      bestseller: input.bestseller,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  const existingVariants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId));
  const incomingIds = new Set(input.variants.filter((v) => v.id).map((v) => v.id));

  for (const existing of existingVariants) {
    if (!incomingIds.has(existing.id)) {
      await db.delete(productVariants).where(eq(productVariants.id, existing.id));
    }
  }

  for (let i = 0; i < input.variants.length; i++) {
    const v = input.variants[i];
    if (v.id) {
      await db
        .update(productVariants)
        .set({
          label: v.label,
          weightGrams: v.weightGrams,
          sku: v.sku,
          price: v.price.toFixed(2),
          comparePrice: v.comparePrice ? v.comparePrice.toFixed(2) : null,
          stock: v.stock,
          isDefault: v.isDefault ?? i === 0,
          sortOrder: i,
        })
        .where(eq(productVariants.id, v.id));
    } else {
      await db.insert(productVariants).values({
        productId,
        label: v.label,
        weightGrams: v.weightGrams,
        sku: v.sku,
        price: v.price.toFixed(2),
        comparePrice: v.comparePrice ? v.comparePrice.toFixed(2) : null,
        stock: v.stock,
        isDefault: v.isDefault ?? i === 0,
        sortOrder: i,
      });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const { id } = await params;
  await db.delete(products).where(eq(products.id, Number(id)));
  return NextResponse.json({ ok: true });
}
