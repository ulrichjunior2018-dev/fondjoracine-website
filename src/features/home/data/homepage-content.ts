export const hero = {
  eyebrow: "Scalp-first luxury hair wellness",
  title: "Ritual care for luminous hair at the root.",
  description:
    "FONDJO pairs clinical scalp science with sensorial botanical rituals for healthier-looking density, shine, and softness.",
  primaryCta: "Explore the ritual",
  secondaryCta: "Discover the science",
  image: "/images/volcanic-bottle.png",
  videoPoster: "/images/volcanic-bottle.png",
  videoSrc: "",
} as const;

export const featuredProducts = [
  {
    name: "Root Renewal Scalp Serum",
    description: "A concentrated leave-in treatment for balanced roots and glossy lengths.",
    price: "$88",
    image: "/images/front-label.png",
  },
  {
    name: "Botanical Density Oil",
    description: "A featherweight oil blend for pre-wash massage and high-shine finishing.",
    price: "$72",
    image: "/images/studio-reflection.png",
  },
  {
    name: "Silk Repair Hair Masque",
    description: "A weekly cream masque that cushions strands with slip, softness, and resilience.",
    price: "$64",
    image: "/images/night-routine.png",
  },
] as const;

export const ingredients = [
  {
    name: "Peptide complex",
    note: "Supports the look of stronger, fuller roots over time.",
  },
  {
    name: "Rosemary hydrosol",
    note: "Refreshes the scalp with an herbaceous, spa-clean finish.",
  },
  {
    name: "Camellia seed oil",
    note: "Adds weightless polish and helps reduce the look of dryness.",
  },
  {
    name: "Fermented rice water",
    note: "Brings softness, shine, and a smooth hand-feel to lengths.",
  },
] as const;

export const transformations = [
  {
    label: "Week 1",
    image: "/images/market-lifestyle.png",
    caption: "A clarified scalp ritual focused on comfort and balance.",
  },
  {
    label: "Week 8",
    image: "/images/barbershop.png",
    caption: "Hair appears softer, glossier, and more light-reflective.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "The first formula that made my wash day feel like a private treatment. My scalp feels calm and my hair looks expensive.",
    author: "Mara L.",
    detail: "Fine, color-treated hair",
  },
  {
    quote:
      "It has the quiet polish of a luxury fragrance house, but the results are the part I keep talking about.",
    author: "Simone R.",
    detail: "Textured hair, dry scalp",
  },
  {
    quote:
      "The serum disappears instantly. No residue, no heaviness, just a healthier-looking finish.",
    author: "Claire A.",
    detail: "Straight hair, oil-prone roots",
  },
] as const;

export const instagramGallery = [
  "/images/market-lifestyle.png",
  "/images/barbershop.png",
  "/images/night-routine.png",
  "/images/packing-orders.png",
] as const;

export const trustBadges = [
  "Dermatologist reviewed",
  "Cruelty-free",
  "Responsibly sourced botanicals",
  "Complimentary carbon-conscious shipping over $75",
] as const;
