export type Recipe = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  relatedProductSlug: string;
  content: string[];
};

// Editorial cooking-inspiration content. These are general usage ideas for
// cooking with ingredient powders, not medical or health claims, and not
// product-specific instructions beyond what is confirmed on each product page.
const recipes: Recipe[] = [
  {
    slug: "cooking-with-garlic-powder",
    title: "5 Easy Ways to Cook with Garlic Powder",
    category: "Garlic",
    excerpt:
      "From dry rubs to dals, here are simple everyday ways to bring garlic powder into your cooking.",
    image: "/images/products/garlic-powder.jpg",
    relatedProductSlug: "garlic-powder",
    content: [
      "Garlic powder is a convenient way to add bold, savoury flavour to your cooking without peeling or chopping fresh cloves.",
      "1. Dry rubs: Combine garlic powder with salt, pepper, and your favourite spices for a quick rub on vegetables, paneer, or meats before grilling or roasting.",
      "2. Dal and curries: Stir a pinch into dal, sabzi, or curry bases alongside your usual tempering for extra depth.",
      "3. Marinades: Mix into yogurt or oil-based marinades for a smooth, evenly distributed garlic flavour.",
      "4. Popcorn and snacks: Sprinkle over roasted nuts, popcorn, or fries for a savoury kick.",
      "5. Soups and broths: Whisk into soups and broths for a quick flavour boost without texture from fresh garlic bits.",
      "Tip: Start with half the quantity you'd use for fresh garlic and adjust to taste, since dried powder is more concentrated by volume.",
    ],
  },
  {
    slug: "ways-to-use-ginger-powder",
    title: "Ways to Use Ginger Powder Beyond Tea",
    category: "Ginger",
    excerpt: "Ginger powder isn't just for chai — explore its role in curries, baking, and marinades.",
    image: "/images/products/ginger-powder.jpg",
    relatedProductSlug: "ginger-powder",
    content: [
      "Ginger powder brings warmth and a gentle zesty bite to both sweet and savoury dishes.",
      "1. Chai and warm drinks: A classic use — add a pinch to tea, warm milk, or lemon water.",
      "2. Curries and gravies: Combine with other spices at the start of cooking to build a warm flavour base.",
      "3. Baking: Use in cookies, cakes, and spiced breads for a comforting warmth.",
      "4. Marinades: Blend into marinades for vegetables, paneer, or meats alongside other spices.",
      "5. Soups: Stir into soups for a warming, aromatic note, especially in colder months.",
      "Tip: Ginger powder is more concentrated than fresh ginger, so use it sparingly and adjust to your preferred strength.",
    ],
  },
  {
    slug: "cooking-applications-onion-powder",
    title: "Cooking Applications for Onion Powder",
    category: "Onion",
    excerpt: "Save prep time and skip the tears with these everyday onion powder ideas.",
    image: "/images/products/onion-powder.jpg",
    relatedProductSlug: "onion-powder",
    content: [
      "Onion powder delivers the deep, savoury flavour of onions in an instant, with no chopping required.",
      "1. Curry bases: Add at the start of cooking in place of sautéed onions when you're short on time.",
      "2. Dry seasoning blends: Combine with other spices for a quick all-purpose seasoning for vegetables and snacks.",
      "3. Soups and stews: Stir into soups and stews to build a savoury base note.",
      "4. Marinades: Blend into marinades for a rounded, savoury flavour.",
      "5. Roasted vegetables: Toss vegetables with oil and onion powder before roasting for an even coating of flavour.",
      "Tip: One tablespoon of onion powder is roughly equivalent to one medium onion in flavour strength, though texture will differ.",
    ],
  },
  {
    slug: "tomato-powder-sauces-soups",
    title: "Tomato Powder in Sauces & Soups",
    category: "Tomato",
    excerpt: "A pantry shortcut for tomato purée, sauces, and soups whenever fresh tomatoes aren't on hand.",
    image: "/images/products/tomato-powder.jpg",
    relatedProductSlug: "tomato-powder",
    content: [
      "Tomato powder offers a vibrant, tangy tomato flavour that's easy to keep on hand.",
      "1. Quick purée: Mix with warm water to reconstitute into a purée-like consistency for curries and gravies.",
      "2. Soups: Stir directly into soups for added body and tang.",
      "3. Sauces: Blend into pasta or curry sauces for a concentrated tomato note.",
      "4. Seasoning blends: Combine with other dried spices for rubs and seasoning mixes.",
      "5. Dips and chutneys: Add to yogurt-based dips or chutneys for colour and tang.",
      "Tip: Reconstituted tomato powder works best in cooked dishes rather than as a direct replacement for fresh tomato slices.",
    ],
  },
  {
    slug: "storage-and-handling-tips",
    title: "Storage & Handling Tips for Ingredient Powders",
    category: "Storage",
    excerpt: "Simple habits that help keep your ingredient powders fresh for longer.",
    image: "/images/products/garlic-ginger-powder.jpg",
    relatedProductSlug: "garlic-ginger-powder",
    content: [
      "Getting the most out of your ingredient powders starts with how you store them.",
      "1. Keep it dry: Moisture is the biggest enemy of powder texture — always use a dry spoon.",
      "2. Seal tightly: Reseal the pack or transfer to an airtight container after each use.",
      "3. Avoid direct sunlight and heat: Store in a cool, dry pantry away from the stove.",
      "4. Check the product label: Always follow the specific storage instructions printed on your product's packaging.",
      "5. Use within a reasonable time: For best flavour, use opened packs within a few months.",
    ],
  },
];

export function getAllRecipes(): Recipe[] {
  return recipes;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}
