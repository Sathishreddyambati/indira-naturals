import Link from "next/link";
import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getAllRecipes } from "@/lib/recipes";

export default function InspirationSection() {
  const recipes = getAllRecipes().slice(0, 3);
  return (
    <section className="container-site py-16 lg:py-24">
      <RevealOnScroll>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">
              Cooking Inspiration
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] text-brand-forest">
              Ways to Use Our Powders
            </h2>
          </div>
          <Link href="/recipes" className="text-sm font-semibold text-brand-forest hover:underline">
            View all recipes →
          </Link>
        </div>
      </RevealOnScroll>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe, i) => (
          <RevealOnScroll key={recipe.slug} delay={i * 0.08}>
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
                <h3 className="font-serif text-lg text-brand-forest">{recipe.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-brand-charcoal/70">{recipe.excerpt}</p>
              </div>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
