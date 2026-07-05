import { z } from "zod";

function isSlug(value: string) {
  const parts = value.split("-");

  return parts.every((part) => part.length > 0 && [...part].every((char) => /[a-z0-9]/.test(char)));
}

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(24),
  offset: z.coerce.number().int().min(0).default(0),
});

export const productListQuerySchema = paginationQuerySchema.extend({
  category: z.string().min(1).optional(),
  collection: z.string().min(1).optional(),
  q: z.string().min(2).max(120).optional(),
});

export const createProductVariantSchema = z.object({
  title: z.string().min(1).max(120),
  sku: z.string().min(2).max(80),
  price_cents: z.number().int().min(0),
  compare_at_price_cents: z.number().int().min(0).optional(),
  currency: z.literal("USD").default("USD"),
  is_default: z.boolean().default(false),
});

export const createProductSchema = z.object({
  title: z.string().min(2).max(180),
  slug: z
    .string()
    .min(2)
    .max(180)
    .refine(isSlug, "Slug must contain lowercase letters, numbers, and hyphens only."),
  subtitle: z.string().max(220).optional(),
  description: z.string().max(10000).optional(),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  seo_title: z.string().max(70).optional(),
  seo_description: z.string().max(170).optional(),
  variants: z.array(createProductVariantSchema).min(1),
});

export const addCartItemSchema = z.object({
  variant_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

export const updateCartItemSchema = z.object({
  cart_item_id: z.string().uuid(),
  quantity: z.number().int().min(0).max(99),
});

export const createOrderSchema = z.object({
  cart_id: z.string().uuid(),
  email: z.string().email(),
  shipping_address: z.record(z.string(), z.unknown()),
  billing_address: z.record(z.string(), z.unknown()),
});

export const oneProductPaymentMethodSchema = z.enum([
  "whatsapp",
  "mtn_momo",
  "orange_money",
  "stripe",
]);

export const createOneProductOrderSchema = z.object({
  company: z.string().max(0, "Invalid submission.").optional().or(z.literal("")),
  city: z.string().min(2).max(120),
  delivery_address: z.string().min(8).max(500),
  email: z.string().email().optional().or(z.literal("")),
  locale: z.enum(["en", "fr"]).default("en"),
  name: z.string().min(2).max(160),
  payment_method: oneProductPaymentMethodSchema,
  phone: z.string().min(8).max(24),
  quantity: z.number().int().min(1).max(6).default(1),
  transaction_reference: z.string().min(4).max(120).optional().or(z.literal("")),
});

export const submitPaymentReferenceSchema = z.object({
  transaction_reference: z.string().min(4).max(120),
});

export const adminOrderStatusUpdateSchema = z.object({
  note: z.string().max(1000).optional(),
  status: z.enum([
    "pending_payment",
    "payment_submitted",
    "confirmed",
    "packed",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
});

export const adminContentUpdateSchema = z.object({
  content: z.record(z.string(), z.unknown()),
});

export const adminStockUpdateSchema = z.object({
  lowStockThreshold: z.number().int().min(0).max(100000).optional(),
  stockCount: z.number().int().min(0).max(100000),
});

export const adminTestimonialApprovalSchema = z.object({
  approved: z.boolean(),
  index: z.number().int().min(0),
});

const imageSrcSchema = z
  .string()
  .refine(
    (value) => value.startsWith("/images/") || z.string().url().safeParse(value).success,
    "Expected an absolute URL or a local /images/ asset path",
  );

export const adminImageUpdateSchema = z.object({
  altEn: z.string().min(1).max(240),
  altFr: z.string().min(1).max(240),
  height: z.number().int().positive(),
  index: z.number().int().min(0),
  kind: z.enum(["product", "before", "after", "founder"]),
  pairIndex: z.number().int().min(0).optional(),
  src: imageSrcSchema,
  width: z.number().int().positive(),
});

export const innerCircleMemberSchema = z.object({
  city: z.string().max(120).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  full_name: z.string().min(2).max(160),
  notes: z.string().max(1000).optional().or(z.literal("")),
  phone: z.string().min(8).max(24),
  status: z.enum(["active", "paused", "cancelled"]).default("active"),
});

export const innerCircleStatusUpdateSchema = z.object({
  status: z.enum(["active", "paused", "cancelled"]),
});

export const createReviewSchema = z.object({
  product_id: z.string().uuid(),
  order_id: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(8).max(5_000),
});

export const wishlistItemSchema = z.object({
  product_id: z.string().uuid(),
});

export const createSupportTicketSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(4).max(180),
  body: z.string().min(8).max(10000),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
});

export const hairTypeSchema = z.enum([
  "natural",
  "relaxed",
  "braided",
  "locs",
  "transitioning",
  "heat_damaged",
  "not_sure",
]);

export const hairConcernSchema = z.enum([
  "slow_growth",
  "breakage",
  "dryness",
  "itchy_scalp",
  "thinning_edges",
  "dandruff",
  "hair_shedding",
  "weak_hair",
  "damaged_hair",
]);

export const concernDurationSchema = z.enum([
  "less_than_1_month",
  "1_to_3_months",
  "3_to_6_months",
  "6_to_12_months",
  "more_than_1_year",
]);

export const scalpOilingFrequencySchema = z.enum([
  "never",
  "once_weekly",
  "two_to_three_times_weekly",
  "daily",
  "only_when_dry",
]);

export const hairstyleSchema = z.enum([
  "braids",
  "wigs",
  "weaves",
  "natural_afro",
  "silk_press",
  "relaxed_styles",
  "locs",
  "protective_styles",
]);

export const heatUseSchema = z.enum(["never", "rarely", "weekly", "multiple_times_weekly"]);

export const scalpSymptomSchema = z.enum([
  "none",
  "itching",
  "flaking",
  "pain",
  "burning",
  "sores",
  "redness",
  "heavy_dandruff",
]);

export const sensitiveStatusSchema = z.enum(["yes", "no", "not_sure"]);

export const hairConsultationAnswersSchema = z.object({
  concernDuration: concernDurationSchema,
  hairType: hairTypeSchema,
  heatUse: heatUseSchema,
  mainConcern: hairConcernSchema,
  photoReview: z.boolean(),
  previousProducts: z.string().max(800).optional().or(z.literal("")),
  scalpOiling: scalpOilingFrequencySchema,
  scalpSymptoms: z.array(scalpSymptomSchema).min(1).max(8),
  sensitiveStatus: sensitiveStatusSchema,
  styles: z.array(hairstyleSchema).min(1).max(8),
});

export const createHairConsultationSchema = z.object({
  company: z.string().max(0, "Invalid submission.").optional().or(z.literal("")),
  consentGiven: z.literal(true, {
    error: "Consent is required before saving a consultation.",
  }),
  customer: z.object({
    email: z.string().email().optional().or(z.literal("")),
    name: z.string().min(2).max(160),
    phone: z.string().min(8).max(24),
  }),
  locale: z.enum(["en", "fr"]).default("en"),
  answers: hairConsultationAnswersSchema,
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateOneProductOrderInput = z.infer<typeof createOneProductOrderSchema>;
export type SubmitPaymentReferenceInput = z.infer<typeof submitPaymentReferenceSchema>;
export type OneProductPaymentMethod = z.infer<typeof oneProductPaymentMethodSchema>;
export type AdminOrderStatusUpdateInput = z.infer<typeof adminOrderStatusUpdateSchema>;
export type AdminContentUpdateInput = z.infer<typeof adminContentUpdateSchema>;
export type AdminStockUpdateInput = z.infer<typeof adminStockUpdateSchema>;
export type AdminTestimonialApprovalInput = z.infer<typeof adminTestimonialApprovalSchema>;
export type AdminImageUpdateInput = z.infer<typeof adminImageUpdateSchema>;
export type InnerCircleMemberInput = z.infer<typeof innerCircleMemberSchema>;
export type InnerCircleStatusUpdateInput = z.infer<typeof innerCircleStatusUpdateSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type WishlistItemInput = z.infer<typeof wishlistItemSchema>;
export type CreateSupportTicketInput = z.infer<typeof createSupportTicketSchema>;
export type HairConsultationAnswersInput = z.infer<typeof hairConsultationAnswersSchema>;
export type CreateHairConsultationInput = z.infer<typeof createHairConsultationSchema>;
