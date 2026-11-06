export type ProductVariantDTO = {
  id: number;
  label: string;
  weightGrams: number;
  sku: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  isDefault: boolean;
};

export type ProductDTO = {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  image: string;
  galleryImages: string[];
  ingredients: string;
  netWeightLabel: string;
  usageInstructions: string;
  storageInstructions: string;
  allergenInfo: string | null;
  skuPrefix: string;
  status: string;
  featured: boolean;
  bestseller: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  avgRating: number;
  reviewCount: number;
  variants: ProductVariantDTO[];
};

export type CartLine = {
  productId: number;
  variantId: number;
  slug: string;
  name: string;
  image: string;
  variantLabel: string;
  price: number;
  quantity: number;
  maxStock: number;
};

export type WishlistEntry = {
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
};
