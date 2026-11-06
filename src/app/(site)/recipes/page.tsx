import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getAllRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Recipes & Cooking Inspiration",
  description:
    "Cooking inspiration and usage ideas for Indira Naturals garlic, ginger, onion and tomato powders.",
  alternates: { canonical: "/recipes" },
};

export default function RecipesPage() {
  const recipes = getAllRecipes();
  return (
    <div className="container-site py-12 lg:py-16">
      <RevealOnScroll>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">
          Cooking Inspiration
        </p>
        <h1 className="mt-2 text-center font-serif text-[clamp(2rem,4vw,3rem)] text-brand-forest">
          Recipes &amp; Usage Ideas
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-brand-charcoal/70">
          General cooking inspiration for using ingredient powders in everyday meals. These are usage
          ideas, not medical or nutritional advice.
        </p>
      </RevealOnScroll>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe, i) => (
          <RevealOnScroll key={recipe.slug} delay={i * 0.06}>
            <Link
              href={`/recipes/${recipe.slug}`}
              className="group block overflow-hidden rounded-2xl border border-brand-brown/10 bg-white shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  sizes="(min-width:1024px) 33vw, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-brand-ivory/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-forest">
                  {recipe.category}
                </span>
              </div>
              <div className="p-5">
                <h2 className="font-serif text-lg text-brand-forest">{recipe.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-brand-charcoal/70">{recipe.excerpt}</p>
              </div>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}
