import { z } from "zod";

const localizedTextSchema = z
  .object({
    en: z.string().min(1),
    fr: z.string().min(1),
  })
  .strict();

const imageSrcSchema = z
  .string()
  .refine(
    (value) => value.startsWith("/images/") || z.string().url().safeParse(value).success,
    "Expected an absolute URL or a local /images/ asset path",
  );

const imageSchema = z
  .object({
    alt: localizedTextSchema,
    height: z.number().int().positive(),
    src: imageSrcSchema,
    width: z.number().int().positive(),
  })
  .strict();

const cmsSectionSchema = z
  .object({
    eyebrow: localizedTextSchema,
    intro: localizedTextSchema.optional(),
    title: localizedTextSchema,
  })
  .strict();

const paymentMethodSchema = z
  .object({
    accountName: z.string().min(1),
    instructions: localizedTextSchema,
    label: z.string().min(1),
    number: z.string().min(6).or(z.literal("")),
  })
  .strict();

export const elixirContentSchema = z.object({
  availability: localizedTextSchema,
  beforeAfter: cmsSectionSchema.extend({
    items: z.array(
      z
        .object({
          after: imageSchema,
          before: imageSchema,
          caption: localizedTextSchema,
          customer: z
            .object({
              city: z.string().min(1),
              name: z.string().min(1),
              week: z.number().int().nonnegative(),
            })
            .strict()
            .optional(),
          isPlaceholder: z.boolean().optional(),
          label: localizedTextSchema,
        })
        .strict(),
    ),
  }),
  brand: z.string().min(1),
  brandPositioning: z
    .object({
      primary: localizedTextSchema,
      secondary: localizedTextSchema,
    })
    .strict(),
  currency: z.string().length(3),
  description: localizedTextSchema,
  faq: cmsSectionSchema.extend({
    items: z.array(
      z
        .object({
          answer: localizedTextSchema,
          question: localizedTextSchema,
        })
        .strict(),
    ),
  }),
  finalCta: cmsSectionSchema.extend({
    button: localizedTextSchema,
  }),
  founder: cmsSectionSchema.extend({
    image: imageSchema,
    name: z.string().min(1),
    signature: localizedTextSchema,
  }),
  guarantee: cmsSectionSchema.extend({
    badges: z.array(localizedTextSchema),
    terms: localizedTextSchema,
  }),
  hero: z
    .object({
      eyebrow: localizedTextSchema,
      primaryCta: localizedTextSchema,
      secondaryCta: localizedTextSchema,
      title: localizedTextSchema,
    })
    .strict(),
  highlights: z.array(
    z
      .object({
        label: localizedTextSchema,
        value: localizedTextSchema,
      })
      .strict(),
  ),
  howToUse: cmsSectionSchema.extend({
    steps: z.array(
      z
        .object({
          step: localizedTextSchema,
          text: localizedTextSchema,
          title: localizedTextSchema,
        })
        .strict(),
    ),
  }),
  id: z.string().min(1),
  images: z.array(imageSchema).min(1),
  ingredientScience: cmsSectionSchema.extend({
    ingredients: z.array(
      z
        .object({
          image: z.string().min(1).optional(),
          imageAlt: localizedTextSchema.optional(),
          name: localizedTextSchema,
          note: localizedTextSchema,
        })
        .strict(),
    ),
  }),
  innerCircle: cmsSectionSchema.extend({
    benefits: z.array(localizedTextSchema),
    cta: localizedTextSchema,
    priceXaf: z.string().min(1),
  }),
  inventory: z
    .object({
      lowStockThreshold: z.number().int().nonnegative(),
      stockCount: z.number().int().nonnegative(),
    })
    .strict(),
  launchAnnouncement: cmsSectionSchema.extend({
    badge: localizedTextSchema,
    cta: localizedTextSchema,
    enabled: z.boolean(),
  }),
  manualPayments: z
    .object({
      heading: localizedTextSchema,
      intro: localizedTextSchema,
      methods: z.array(paymentMethodSchema).min(1),
    })
    .strict(),
  priceCents: z.number().int().nonnegative(),
  priceXaf: z.string().min(1),
  problem: cmsSectionSchema.extend({
    concerns: z.array(
      z
        .object({
          label: localizedTextSchema,
          text: localizedTextSchema,
        })
        .strict(),
    ),
  }),
  product: cmsSectionSchema.extend({
    description: localizedTextSchema,
    name: localizedTextSchema,
    priceXaf: z.string().min(1),
    size: localizedTextSchema,
  }),
  seo: z
    .object({
      description: localizedTextSchema,
      title: localizedTextSchema,
    })
    .strict(),
  shipping: localizedTextSchema,
  slug: z.string().min(1),
  socialLinks: z
    .object({
      instagram: z.string().url().optional(),
      tiktok: z.string().url().optional(),
    })
    .strict(),
  stripePriceId: z.string().optional(),
  testimonials: cmsSectionSchema.extend({
    items: z.array(
      z
        .object({
          approved: z.boolean().default(true),
          location: localizedTextSchema,
          name: z.string().min(1),
          quote: localizedTextSchema,
          result: localizedTextSchema,
        })
        .strict(),
    ),
  }),
  timeline: cmsSectionSchema.extend({
    stages: z.array(
      z
        .object({
          day: localizedTextSchema,
          text: localizedTextSchema,
          title: localizedTextSchema,
        })
        .strict(),
    ),
  }),
  title: localizedTextSchema,
  trust: z.array(localizedTextSchema),
  whatsapp: z
    .object({
      diagnosisCta: localizedTextSchema,
      finalCta: localizedTextSchema,
      label: localizedTextSchema,
      message: localizedTextSchema,
      phone: z.string().regex(/^\+?\d{8,15}$/),
    })
    .strict(),
});
// Not `.strict()` at the root: published CMS rows may still carry legacy keys
// (`proof`, `ritual`, `ingredients`, …). Zod strips unknowns so the storefront
// keeps working without falling back / spamming the Next.js error overlay.

export const cmsEditableFields = [
  "hero.title",
  "images",
  "product.priceXaf",
  "product.description",
  "ingredientScience.ingredients",
  "beforeAfter.items",
  "testimonials.items",
  "faq.items",
  "founder",
  "guarantee",
  "whatsapp.phone",
  "manualPayments.methods",
  "socialLinks.instagram",
  "socialLinks.tiktok",
  "inventory.stockCount",
  "innerCircle",
  "launchAnnouncement",
] as const;
