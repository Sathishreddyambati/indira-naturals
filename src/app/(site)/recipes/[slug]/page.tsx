import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getAllRecipes, getRecipeBySlug } from "@/lib/recipes";

export async function generateStaticParams() {
  return getAllRecipes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) return {};
  return {
    title: recipe.title,
    description: recipe.excerpt,
    alternates: { canonical: `/recipes/${recipe.slug}` },
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  return (
    <div className="container-site py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-brand-charcoal/60">
        <Link href="/" className="hover:text-brand-forest">Home</Link>
        <ChevronRight size={12} />
        <Link href="/recipes" className="hover:text-brand-forest">Recipes</Link>
        <ChevronRight size={12} />
        <span className="text-brand-charcoal">{recipe.title}</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <span className="rounded-full bg-brand-leaf/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-leaf">
          {recipe.category} · Cooking Inspiration
        </span>
        <h1 className="mt-3 font-serif text-3xl text-brand-forest sm:text-4xl">{recipe.title}</h1>

        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={recipe.image} alt={recipe.title} fill sizes="768px" className="object-cover" />
        </div>

        <div className="mt-8 flex flex-col gap-4 text-brand-charcoal/80">
          {recipe.content.map((para, i) => (
            <p key={i} className={i === 0 ? "text-lg" : ""}>{para}</p>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-brand-cream p-6">
          <p className="text-sm text-brand-charcoal/70">
            This article is general cooking inspiration, not medical or nutritional advice. Always check
            the specific usage and storage instructions on your product packaging.
          </p>
          <Link
            href={`/product/${recipe.relatedProductSlug}`}
            className="mt-4 inline-block rounded-full bg-brand-forest px-6 py-2.5 text-sm font-semibold text-brand-ivory hover:bg-brand-leaf"
          >
            Shop the Featured Product →
          </Link>
        </div>
      </div>
    </div>
  );
}
