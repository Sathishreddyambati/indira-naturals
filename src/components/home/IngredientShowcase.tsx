"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import RevealOnScroll from "@/components/RevealOnScroll";

type Ingredient = {
  key: string;
  label: string;
  slug: string;
  image: string;
  blurb: string;
};

const INGREDIENTS: Ingredient[] = [
  {
    key: "garlic",
    label: "Garlic",
    slug: "garlic-powder",
    image: "/images/products/garlic-powder.jpg",
    blurb:
      "Bold and savoury — a pantry shortcut for curries, marinades, and dry rubs without the peeling or chopping.",
  },
  {
    key: "ginger",
    label: "Ginger",
    slug: "ginger-powder",
    image: "/images/products/ginger-powder.jpg",
    blurb:
      "Warm and zesty — perfect for teas, baked goods, curries, and spice blends, ready in a pinch.",
  },
  {
    key: "onion",
    label: "Onion",
    slug: "onion-powder",
    image: "/images/products/onion-powder.jpg",
    blurb: "Deep and savoury — the base note for countless dishes, minus the tears and prep time.",
  },
  {
    key: "tomato",
    label: "Tomato",
    slug: "tomato-powder",
    image: "/images/products/tomato-powder.jpg",
    blurb: "Vibrant and tangy — reconstitute into purée or stir straight into sauces, soups, and curries.",
  },
];

export default function IngredientShowcase() {
  const [active, setActive] = useState(INGREDIENTS[0]);

  return (
    <section className="bg-brand-cream py-16 lg:py-24">
      <div className="container-site">
        <RevealOnScroll>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">
            Explore the Ingredients
          </p>
          <h2 className="mt-2 text-center font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] text-brand-forest">
            Choose Your Ingredient
          </h2>
        </RevealOnScroll>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {INGREDIENTS.map((ing) => (
            <button
              key={ing.key}
              onClick={() => setActive(ing)}
              className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition-colors ${
                active.key === ing.key
                  ? "border-brand-forest bg-brand-forest text-brand-ivory"
                  : "border-brand-brown/30 bg-white text-brand-charcoal hover:border-brand-forest"
              }`}
            >
              {ing.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.35 }}
              className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-card"
            >
              <Image src={active.image} alt={`${active.label} powder by Indira Naturals`} fill sizes="(min-width:1024px) 560px, 90vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.key + "-text"}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35 }}
            >
              <h3 className="font-serif text-3xl text-brand-forest">{active.label} Powder</h3>
              <p className="mt-4 text-brand-charcoal/75">{active.blurb}</p>
              <Link
                href={`/product/${active.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-brand-ivory transition-colors hover:bg-brand-leaf"
              >
                Shop {active.label} Powder →
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
