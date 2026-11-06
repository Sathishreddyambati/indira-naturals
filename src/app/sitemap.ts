import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { getAllPublishedProducts } from "@/db/queries";
import { getAllRecipes } from "@/lib/recipes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const products = await getAllPublishedProducts();
  const recipes = getAllRecipes();

  const staticRoutes = [
    "",
    "/shop",
    "/our-story",
    "/why-us",
    "/recipes",
    "/contact",
    "/cart",
    "/track-order",
    "/policies/shipping-returns",
    "/policies/privacy",
    "/policies/terms",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const recipeRoutes = recipes.map((r) => ({
    url: `${siteUrl}/recipes/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...recipeRoutes];
}
