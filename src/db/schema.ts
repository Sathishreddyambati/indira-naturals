import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// ---------- ENUMS ----------
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", ["cod", "razorpay"]);

export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "approved",
  "rejected",
]);

export const couponTypeEnum = pgEnum("coupon_type", ["percent", "fixed"]);

// ---------- PRODUCTS ----------
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  image: text("image").notNull(),
  galleryImages: jsonb("gallery_images").$type<string[]>().notNull().default([]),
  ingredients: text("ingredients").notNull(),
  netWeightLabel: varchar("net_weight_label", { length: 80 }).notNull(),
  usageInstructions: text("usage_instructions").notNull(),
  storageInstructions: text("storage_instructions").notNull(),
  allergenInfo: text("allergen_info"),
  skuPrefix: varchar("sku_prefix", { length: 40 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("published"), // published | draft
  featured: boolean("featured").notNull().default(false),
  bestseller: boolean("bestseller").notNull().default(false),
  seoTitle: varchar("seo_title", { length: 180 }),
  seoDescription: varchar("seo_description", { length: 300 }),
  avgRating: numeric("avg_rating", { precision: 3, scale: 2 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 40 }).notNull(), // e.g. "100g"
  weightGrams: integer("weight_grams").notNull(),
  sku: varchar("sku", { length: 60 }).notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  comparePrice: numeric("compare_price", { precision: 10, scale: 2 }),
  stock: integer("stock").notNull().default(0),
  isDefault: boolean("is_default").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------- REVIEWS ----------
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 160 }),
  body: text("body").notNull(),
  verifiedPurchase: boolean("verified_purchase").notNull().default(false),
  status: reviewStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- COUPONS ----------
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  type: couponTypeEnum("type").notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric("min_order_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  active: boolean("active").notNull().default(true),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- ORDERS ----------
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 30 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  addressLine1: varchar("address_line1", { length: 200 }).notNull(),
  addressLine2: varchar("address_line2", { length: 200 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 10 }).notNull(),
  deliveryInstructions: text("delivery_instructions"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 10, scale: 2 }).notNull().default("0"),
  shipping: numeric("shipping", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  couponCode: varchar("coupon_code", { length: 40 }),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  razorpayOrderId: varchar("razorpay_order_id", { length: 80 }),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 80 }),
  status: orderStatusEnum("status").notNull().default("pending"),
  trackingNumber: varchar("tracking_number", { length: 80 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
  variantId: integer("variant_id").notNull(),
  productName: varchar("product_name", { length: 160 }).notNull(),
  productSlug: varchar("product_slug", { length: 160 }).notNull(),
  productImage: text("product_image").notNull(),
  variantLabel: varchar("variant_label", { length: 40 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: numeric("line_total", { precision: 10, scale: 2 }).notNull(),
});

// ---------- NEWSLETTER / CONTACT ----------
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("new"), // new | read | resolved
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- ADMIN ----------
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  role: varchar("role", { length: 30 }).notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- SITE SETTINGS (singleton row, id = 1) ----------
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  announcementText: varchar("announcement_text", { length: 240 }).notNull().default(
    "Free shipping on prepaid orders above ₹499 — Demo promotional message, editable in Admin.",
  ),
  heroHeadline: varchar("hero_headline", { length: 200 }).notNull().default(
    "Pure Ingredients. Naturally Better.",
  ),
  heroSubtext: varchar("hero_subtext", { length: 300 }).notNull().default(
    "Discover the goodness of everyday ingredients in convenient powder form.",
  ),
  heroCtaPrimaryLabel: varchar("hero_cta_primary_label", { length: 60 }).notNull().default(
    "Shop Our Powders",
  ),
  heroCtaSecondaryLabel: varchar("hero_cta_secondary_label", { length: 60 }).notNull().default(
    "Discover Our Story",
  ),
  freeShippingThreshold: numeric("free_shipping_threshold", { precision: 10, scale: 2 })
    .notNull()
    .default("499"),
  flatShippingRate: numeric("flat_shipping_rate", { precision: 10, scale: 2 })
    .notNull()
    .default("59"),
  codEnabled: boolean("cod_enabled").notNull().default(true),
  onlinePaymentEnabled: boolean("online_payment_enabled").notNull().default(true),
  supportEmail: varchar("support_email", { length: 200 }).notNull().default(
    "support@indiranaturals.example",
  ),
  supportPhone: varchar("support_phone", { length: 30 }).notNull().default("+91 90000 00000"),
  whatsappNumber: varchar("whatsapp_number", { length: 30 }).notNull().default("919000000000"),
  businessAddress: varchar("business_address", { length: 300 }).notNull().default(
    "Indira Naturals, [Address line to be provided], India",
  ),
  instagramUrl: varchar("instagram_url", { length: 200 }),
  facebookUrl: varchar("facebook_url", { length: 200 }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
