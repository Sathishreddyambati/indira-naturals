import "dotenv/config";
import { db, pool } from "@/db";
import {
  products,
  productVariants,
  reviews,
  siteSettings,
  adminUsers,
  coupons,
} from "@/db/schema";
import bcrypt from "bcryptjs";
import { and, eq, notInArray } from "drizzle-orm";

// Safe to re-run: products, variants and settings are updated in place.

type SeedProduct = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  image: string;
  gallery: string[];
  ingredients: string;
  netWeightLabel: string;
  usage: string;
  storage: string;
  allergen: string | null;
  skuPrefix: string;
  featured: boolean;
  bestseller: boolean;
  variants: { label: string; grams: number; price: string; compare?: string; stock: number }[];
};

const STORAGE =
  "Store in a cool, dry place. Keep away from moisture and sunlight. Always use a dry spoon. Best before 12 months from the date of manufacturing.";
const SIZES = "Available in 50 g, 100 g, 500 g & 1 kg zip-lock pouches";

// NOTE: prices are placeholders until confirmed by Indira Naturals.
const seedProducts: SeedProduct[] = [
  {
    slug: "ginger-powder",
    name: "Ginger Powder",
    shortDescription: "100% pure ginger powder. No preservatives, no additives.",
    description:
      "Our Ginger Powder is made from carefully selected fresh ginger roots and finely processed to retain its natural aroma, flavour and nutrients. We dry the raw ginger until the water is gone, so no preservatives are needed — the powder keeps the real taste of fresh ginger.",
    category: "Powders",
    image: "/images/products/ginger-photo-pack.jpg",
    gallery: [
      "/images/products/ginger-photo-pack.jpg",
      "/images/products/ginger-front.jpg",
      "/images/products/ginger-back.jpg",
      "/images/products/ginger-combined.jpg",
      "/images/products/ginger-photo.jpg",
      "/images/products/ginger-raw.jpg",
      "/images/products/ginger-sizes.jpg",
    ],
    ingredients: "100% Ginger",
    netWeightLabel: SIZES,
    usage:
      "Add a spoon directly to curries, soups, marinades, sauces, tea and spice blends — no peeling or grating needed. 1 kg of raw ginger makes about 100 g of powder, so a little goes a long way.",
    storage: STORAGE,
    allergen: null,
    skuPrefix: "IN-GIN",
    featured: true,
    bestseller: true,
    variants: [
      { label: "50g", grams: 50, price: "109", compare: "129", stock: 100 },
      { label: "100g", grams: 100, price: "199", compare: "229", stock: 80 },
      { label: "500g", grams: 500, price: "899", stock: 40 },
      { label: "1kg", grams: 1000, price: "1699", stock: 20 },
    ],
  },
  {
    slug: "garlic-powder",
    name: "Garlic Powder",
    shortDescription: "100% pure garlic powder with a strong, natural aroma.",
    description:
      "Our Garlic Powder is made from fresh garlic cloves, hygienically processed and finely ground to retain its strong aroma, flavour and natural goodness. Made only by drying — no preservatives and no additives.",
    category: "Powders",
    image: "/images/products/garlic-photo-pack.jpg",
    gallery: [
      "/images/products/garlic-photo-pack.jpg",
      "/images/products/garlic-front.jpg",
      "/images/products/garlic-back.jpg",
      "/images/products/garlic-combined.jpg",
      "/images/products/garlic-photo.jpg",
      "/images/products/garlic-raw.jpg",
      "/images/products/garlic-display.jpg",
    ],
    ingredients: "100% Garlic",
    netWeightLabel: SIZES,
    usage:
      "Add a spoon to curries, dals, soups, marinades, dry rubs and sauces — no peeling or crushing needed. 1 kg of raw garlic makes about 200 g of powder.",
    storage: STORAGE,
    allergen: null,
    skuPrefix: "IN-GAR",
    featured: true,
    bestseller: true,
    variants: [
      { label: "50g", grams: 50, price: "99", compare: "119", stock: 120 },
      { label: "100g", grams: 100, price: "179", compare: "209", stock: 90 },
      { label: "500g", grams: 500, price: "799", stock: 40 },
      { label: "1kg", grams: 1000, price: "1499", stock: 20 },
    ],
  },
  {
    slug: "garlic-ginger-powder",
    name: "Ginger Garlic Powder",
    shortDescription: "A perfect blend of ginger & garlic — paste taste without the effort.",
    description:
      "A perfect blend of ginger and garlic, carefully processed to save your time in cooking while bringing you the natural aroma, taste and health benefits. Ginger garlic paste takes time to make; this powder is ready when you are, with nothing added.",
    category: "Blends",
    image: "/images/products/ginger-garlic-photo-pack.jpg",
    gallery: [
      "/images/products/ginger-garlic-photo-pack.jpg",
      "/images/products/ginger-garlic-front.jpg",
      "/images/products/ginger-garlic-back.jpg",
      "/images/products/ginger-garlic-combined.jpg",
      "/images/products/ginger-garlic-photo.jpg",
      "/images/products/ginger-garlic-raw.jpg",
      "/images/products/ginger-garlic-display.jpg",
    ],
    ingredients: "Ginger, Garlic",
    netWeightLabel: SIZES,
    usage:
      "Use in place of ginger garlic paste. Add a spoon at the start of cooking for curries, biryani, stir-fries, soups and marinades. Use only what you need — handy for weekly cooking.",
    storage: STORAGE,
    allergen: null,
    skuPrefix: "IN-GGB",
    featured: true,
    bestseller: true,
    variants: [
      { label: "50g", grams: 50, price: "119", compare: "139", stock: 70 },
      { label: "100g", grams: 100, price: "219", compare: "249", stock: 60 },
      { label: "500g", grams: 500, price: "999", stock: 30 },
      { label: "1kg", grams: 1000, price: "1899", stock: 15 },
    ],
  },
  {
    slug: "gift-box-pack-of-3",
    name: "Gift Box – Pack of 3",
    shortDescription: "All three variants in one premium gift box.",
    description:
      "Our gift box brings all three variants together: Ginger Powder, Garlic Powder and Ginger Garlic Powder. Premium quality natural powders in matte, food-grade, zip-lock pouches, packed in an eco-friendly box (20 × 14 × 21 cm). A thoughtful gift for any kitchen.",
    category: "Gift Packs",
    image: "/images/products/gift-box-photo-pack.jpg",
    gallery: [
      "/images/products/gift-box-photo-pack.jpg",
      "/images/products/gift-box.jpg",
      "/images/products/gift-box-lineup.jpg",
      "/images/products/all-variants.jpg",
      "/images/products/ginger-garlic-combined.jpg",
    ],
    ingredients: "Ginger Powder (100% Ginger), Garlic Powder (100% Garlic), Ginger Garlic Powder (Ginger, Garlic)",
    netWeightLabel: "3 pouches × 100 g",
    usage:
      "Use Ginger Powder for tea and curries, Garlic Powder for dals and marinades, and Ginger Garlic Powder in place of paste. Add a spoon directly while cooking.",
    storage: STORAGE,
    allergen: null,
    skuPrefix: "IN-BOX3",
    featured: true,
    bestseller: false,
    variants: [{ label: "3 × 100g", grams: 300, price: "549", compare: "597", stock: 40 }],
  },
  {
    slug: "onion-powder",
    name: "Onion Powder",
    shortDescription: "Deep, savoury onion flavour, ready in seconds.",
    description:
      "Indira Naturals Onion Powder is made from carefully dried and ground onions, giving you the deep, savoury flavour of onions without any chopping or tears. Ideal for curries, soups, dry rubs and seasoning blends.",
    category: "Powders",
    image: "/images/products/onion-photo-wide.jpg",
    gallery: ["/images/products/onion-photo-wide.jpg"],
    ingredients: "100% Onion",
    netWeightLabel: SIZES,
    usage: "Use 1 tablespoon in place of one medium onion. Add to curries, soups, dry rubs and marinades.",
    storage: STORAGE,
    allergen: null,
    skuPrefix: "IN-ONI",
    featured: false,
    bestseller: false,
    variants: [
      { label: "50g", grams: 50, price: "89", compare: "109", stock: 110 },
      { label: "100g", grams: 100, price: "159", compare: "189", stock: 95 },
    ],
  },
];

// Products no longer sold: hidden from the shop (kept in the database for past orders).
const RETIRED_SLUGS = ["tomato-powder"];

const seedReviews: Record<string, { name: string; rating: number; title: string; body: string }[]> = {
  "garlic-powder": [
    {
      name: "Ananya R.",
      rating: 5,
      title: "Great everyday staple",
      body: "Saves me so much time on weeknights. The aroma is strong and it blends well into curries. [Demo review]",
    },
  ],
  "ginger-powder": [
    {
      name: "Priya M.",
      rating: 5,
      title: "Perfect for ginger tea",
      body: "I use this for my morning tea and it has a nice warm kick. Will repurchase. [Demo review]",
    },
  ],
};

async function main() {
  console.log("Seeding Indira Naturals data...");

  await db.insert(siteSettings).values({ id: 1 }).onConflictDoNothing();
  await db
    .update(siteSettings)
    .set({
      heroHeadline: "Nature's Goodness in Every Spoon",
      heroSubtext:
        "Ginger and garlic, ready when you are. 100% pure natural powders made only by drying — no preservatives, no additives.",
      heroCtaPrimaryLabel: "Shop Our Powders",
      heroCtaSecondaryLabel: "Our Story",
      supportEmail: "contact.indiranaturals@gmail.com",
      supportPhone: "+91 91771 66077",
      whatsappNumber: "919177166077",
      businessAddress: "Guntur, Andhra Pradesh, India",
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, 1));

  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@indiranaturals.example";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "IndiraAdmin@123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await db
    .insert(adminUsers)
    .values({ email: adminEmail, passwordHash, name: "Indira Naturals Admin", role: "admin" })
    .onConflictDoNothing();

  await db
    .insert(coupons)
    .values({
      code: "WELCOME10",
      type: "percent",
      value: "10",
      minOrderAmount: "299",
      active: true,
      usageLimit: null,
      expiresAt: null,
    })
    .onConflictDoNothing();

  for (const sp of seedProducts) {
    const fields = {
      name: sp.name,
      shortDescription: sp.shortDescription,
      description: sp.description,
      category: sp.category,
      image: sp.image,
      galleryImages: sp.gallery,
      ingredients: sp.ingredients,
      netWeightLabel: sp.netWeightLabel,
      usageInstructions: sp.usage,
      storageInstructions: sp.storage,
      allergenInfo: sp.allergen,
      skuPrefix: sp.skuPrefix,
      status: "published",
      featured: sp.featured,
      bestseller: sp.bestseller,
      seoTitle: `${sp.name} | Indira Naturals`,
      seoDescription: sp.shortDescription,
    };
    const [row] = await db
      .insert(products)
      .values({ slug: sp.slug, ...fields })
      .onConflictDoUpdate({ target: products.slug, set: fields })
      .returning();
    const productId = row.id;

    const skus = sp.variants.map((v) => `${sp.skuPrefix}-${v.label.replace(/\s+/g, "")}`);
    // remove sizes that are no longer offered
    await db
      .delete(productVariants)
      .where(and(eq(productVariants.productId, productId), notInArray(productVariants.sku, skus)));

    for (let i = 0; i < sp.variants.length; i++) {
      const v = sp.variants[i];
      const vFields = {
        productId,
        label: v.label,
        weightGrams: v.grams,
        price: v.price,
        comparePrice: v.compare ?? null,
        stock: v.stock,
        isDefault: sp.variants.length === 1 ? true : i === 1,
        sortOrder: i,
      };
      await db
        .insert(productVariants)
        .values({ sku: skus[i], ...vFields })
        .onConflictDoUpdate({ target: productVariants.sku, set: vFields });
    }

    // demo reviews only on first seed
    const existing = await db.select({ id: reviews.id }).from(reviews).where(eq(reviews.productId, productId));
    const prodReviews = existing.length === 0 ? seedReviews[sp.slug] || [] : [];
    for (const r of prodReviews) {
      await db.insert(reviews).values({
        productId,
        customerName: r.name,
        rating: r.rating,
        title: r.title,
        body: r.body,
        verifiedPurchase: true,
        status: "approved",
      });
    }
    if (prodReviews.length > 0) {
      const avg = prodReviews.reduce((s, r) => s + r.rating, 0) / prodReviews.length;
      await db
        .update(products)
        .set({ avgRating: avg.toFixed(2), reviewCount: prodReviews.length })
        .where(eq(products.id, productId));
    }
  }

  for (const slug of RETIRED_SLUGS) {
    await db.update(products).set({ status: "draft" }).where(eq(products.slug, slug));
  }

  console.log("Seed complete.");
  console.log(`Admin login email: ${adminEmail} (password: see ADMIN_SEED_PASSWORD or seed.ts)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
