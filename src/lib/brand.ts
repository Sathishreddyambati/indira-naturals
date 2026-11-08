// Brand content taken from "Indira Naturals – Our Story" (PPT) and the website brief (DOCX).

export const CONTACT = {
  founder: "Bathula Manikumar",
  founderRole: "Founder",
  phones: [
    { display: "+91 91771 66077", tel: "+919177166077" },
    { display: "+91 63098 55221", tel: "+916309855221" },
  ],
  whatsapp: "919177166077",
  email: "contact.indiranaturals@gmail.com",
  address: "Guntur, Andhra Pradesh, India",
};

export const TAGLINE = "Pure • Fresh • Natural";

export const WHY_WE_STARTED = [
  {
    title: "Pastes take time",
    body: "Making ginger garlic paste at home, in shops or in restaurants takes a lot of time. When there is no time, people buy ready-made paste from the retail shop.",
  },
  {
    title: "Real taste, nothing added",
    body: "We dry the raw ginger and garlic until the water is gone, so no preservatives are needed. The powder keeps the real taste of the raw product, not a tasteless powder.",
  },
  {
    title: "Cooking once a week",
    body: "Bachelors and busy young households cook once a week and struggle to keep fresh paste. We keep powders for other spices, so why not for ginger and garlic?",
  },
];

export type ProcessStep = { title: string; body: string; icon: string };

export const PROCESS_STEPS: ProcessStep[] = [
  { icon: "sprout", title: "Select", body: "Fresh, good-quality ginger and garlic are chosen with care." },
  { icon: "droplets", title: "Wash & clean", body: "Dirt and dust are washed off so the raw produce is clean." },
  { icon: "knife", title: "Peel & slice", body: "The skin is removed and the produce is cut into thin, even pieces." },
  { icon: "sun", title: "Dry", body: "The slices are dried until no water is left, so no preservatives are needed." },
  { icon: "cog", title: "Grind", body: "The dried slices are ground into a fine powder." },
  { icon: "filter", title: "Sieve", body: "The powder is sieved so it is even and smooth." },
  { icon: "package", title: "Pack", body: "Packed hygienically in food-grade, zip-lock stand-up pouches." },
  { icon: "tag", title: "Label", body: "Batch number and manufacturing date are marked. Best before 12 months." },
];

export const BENEFITS = [
  { icon: "clock", title: "Saves time", body: "No peeling, grinding or making paste. Just add a spoon." },
  { icon: "leaf", title: "Real taste", body: "Keeps the taste of the raw ginger and garlic." },
  { icon: "shield", title: "Nothing added", body: "No preservatives and no additives. Made only by drying." },
  { icon: "box", title: "Easy to store", body: "Keep in a cool, dry place. Best before 12 months from manufacture." },
  { icon: "calendar", title: "Made for weekly cooking", body: "Handy for bachelors and busy homes. Use only what you need." },
  { icon: "chef", title: "Easy to use", body: "Add to curries, soups, marinades, sauces and spice blends. Use a dry spoon." },
];

export const TRUST_BADGES = ["No preservatives", "No additives", "100% pure & natural", "Rich in nutrients", "Made in India"];

export const YIELD_GUIDE = [
  { raw: "50 g", ginger: "5 g", garlic: "10 g" },
  { raw: "100 g", ginger: "10 g", garlic: "20 g" },
  { raw: "250 g", ginger: "25 g", garlic: "50 g" },
  { raw: "500 g", ginger: "50 g", garlic: "100 g" },
  { raw: "1 kg", ginger: "100 g", garlic: "200 g" },
];

export const PACK_FACTS = [
  { title: "Pouch", body: "Matte, food-grade, multi-layer laminated stand-up pouch" },
  { title: "Seal", body: "Heat sealed with a zip lock, printed with food-safe inks" },
  { title: "Shelf life", body: "Best before 12 months from the date of manufacturing" },
  { title: "Sizes", body: "From 100 g up to 1 kg — 100 g, 200 g, 500 g and 1 kg for every powder" },
];

// Certificates & licences. Add the image file to public/images/certificates/ and set `image`.
export const CERTIFICATES: { title: string; detail: string; image?: string }[] = [
  { title: "FSSAI Licence", detail: "Food Safety and Standards Authority of India" },
  { title: "Lab Test Report", detail: "Purity and quality test of our powders" },
  { title: "Business Registration", detail: "Registered food business, Guntur" },
];
