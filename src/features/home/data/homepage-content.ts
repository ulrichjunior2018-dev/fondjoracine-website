export const hero = {
  eyebrow: "Scalp-first luxury hair wellness",
  title: "Ritual care for luminous hair at the root.",
  description:
    "FONDJO pairs clinical scalp science with sensorial botanical rituals for healthier-looking density, shine, and softness.",
  primaryCta: "Explore the ritual",
  secondaryCta: "Discover the science",
  image:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1800&q=85",
  videoPoster:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1800&q=85",
  videoSrc: "",
} as const;

export const featuredProducts = [
  {
    name: "Root Renewal Scalp Serum",
    description: "A concentrated leave-in treatment for balanced roots and glossy lengths.",
    price: "$88",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Botanical Density Oil",
    description: "A featherweight oil blend for pre-wash massage and high-shine finishing.",
    price: "$72",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Silk Repair Hair Masque",
    description: "A weekly cream masque that cushions strands with slip, softness, and resilience.",
    price: "$64",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85",
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
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85",
    caption: "A clarified scalp ritual focused on comfort and balance.",
  },
  {
    label: "Week 8",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=85",
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
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
] as const;

export const trustBadges = [
  "Dermatologist reviewed",
  "Cruelty-free",
  "Responsibly sourced botanicals",
  "Complimentary carbon-conscious shipping over $75",
] as const;
