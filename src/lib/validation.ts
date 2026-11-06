import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name").max(160),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  addressLine1: z.string().trim().min(5, "Address is too short").max(200),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  deliveryInstructions: z.string().trim().max(500).optional().or(z.literal("")),
  paymentMethod: z.enum(["cod", "razorpay"]),
  couponCode: z.string().trim().max(40).optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        variantId: z.number().int().positive(),
        quantity: z.number().int().positive().max(50),
      }),
    )
    .min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(160),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().min(3, "Please add a subject").max(200),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

export const adminVariantSchema = z.object({
  id: z.number().int().positive().optional(),
  label: z.string().trim().min(1).max(40),
  weightGrams: z.number().int().positive(),
  sku: z.string().trim().min(1).max(60),
  price: z.number().nonnegative(),
  comparePrice: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().min(0),
  isDefault: z.boolean().optional(),
});

export const adminProductSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens"),
  name: z.string().trim().min(2).max(160),
  shortDescription: z.string().trim().min(5).max(300),
  description: z.string().trim().min(10),
  category: z.string().trim().min(2).max(80),
  image: z.string().trim().min(1),
  galleryImages: z.array(z.string().trim()).optional().default([]),
  ingredients: z.string().trim().min(2),
  netWeightLabel: z.string().trim().min(2).max(80),
  usageInstructions: z.string().trim().min(2),
  storageInstructions: z.string().trim().min(2),
  allergenInfo: z.string().trim().max(500).optional().or(z.literal("")),
  skuPrefix: z.string().trim().min(2).max(40),
  status: z.enum(["published", "draft"]),
  featured: z.boolean(),
  bestseller: z.boolean(),
  seoTitle: z.string().trim().max(180).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")),
  variants: z.array(adminVariantSchema).min(1, "Add at least one pack size"),
});

export const adminCouponSchema = z.object({
  code: z.string().trim().min(3).max(40),
  type: z.enum(["percent", "fixed"]),
  value: z.number().positive(),
  minOrderAmount: z.number().nonnegative(),
  active: z.boolean(),
  usageLimit: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().trim().nullable().optional(),
});

export const adminSettingsSchema = z.object({
  announcementText: z.string().trim().min(1).max(240),
  heroHeadline: z.string().trim().min(1).max(200),
  heroSubtext: z.string().trim().min(1).max(300),
  heroCtaPrimaryLabel: z.string().trim().min(1).max(60),
  heroCtaSecondaryLabel: z.string().trim().min(1).max(60),
  freeShippingThreshold: z.number().nonnegative(),
  flatShippingRate: z.number().nonnegative(),
  codEnabled: z.boolean(),
  onlinePaymentEnabled: z.boolean(),
  supportEmail: z.string().trim().email(),
  supportPhone: z.string().trim().min(5).max(30),
  whatsappNumber: z.string().trim().min(5).max(30),
  businessAddress: z.string().trim().min(5).max(300),
  instagramUrl: z.string().trim().max(200).optional().or(z.literal("")),
  facebookUrl: z.string().trim().max(200).optional().or(z.literal("")),
});

export const adminOrderUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  trackingNumber: z.string().trim().max(80).nullable().optional(),
});

export const adminReviewUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});
