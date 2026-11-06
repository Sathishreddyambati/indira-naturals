import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { adminProductSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const rows = await db.select().from(products).orderBy(products.id);
  const variantRows = await db.select().from(productVariants);

  const data = rows.map((p) => ({
    ...p,
    variants: variantRows.filter((v) => v.productId === p.id).sort((a, b) => a.sortOrder - b.sortOrder),
  }));

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const json = await req.json().catch(() => null);
  const parsed = adminProductSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid product data" }, { status: 400 });
  }
  const input = parsed.data;

  const existingSlug = await db.select().from(products).where(eq(products.slug, input.slug)).limit(1);
  if (existingSlug[0]) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 });
  }

  const [created] = await db
    .insert(products)
    .values({
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
    })
    .returning();

  await db.insert(productVariants).values(
    input.variants.map((v, i) => ({
      productId: created.id,
      label: v.label,
      weightGrams: v.weightGrams,
      sku: v.sku,
      price: v.price.toFixed(2),
      comparePrice: v.comparePrice ? v.comparePrice.toFixed(2) : null,
      stock: v.stock,
      isDefault: v.isDefault ?? i === 0,
      sortOrder: i,
    })),
  );

  return NextResponse.json({ ok: true, id: created.id });
}
