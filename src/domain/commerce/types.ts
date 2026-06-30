export type CurrencyCode = "USD";

export type ProductStatus = "draft" | "active" | "archived";
export type OrderStatus =
  | "draft"
  | "pending_payment"
  | "payment_submitted"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type TicketStatus = "open" | "pending" | "resolved" | "closed";

export type ProductVariant = {
  id: string;
  title: string;
  sku: string;
  price_cents: number;
  compare_at_price_cents: number | null;
  currency: CurrencyCode;
  is_active: boolean;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  position: number;
};

export type ProductSummary = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  status: ProductStatus;
  seo_title: string | null;
  seo_description: string | null;
  product_variants: ProductVariant[];
  product_images: ProductImage[];
};

export type ProductReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  is_verified_purchase: boolean;
  created_at: string;
};

export type ProductDetail = ProductSummary & {
  description: string | null;
  ingredients: string | null;
  usage_instructions: string | null;
  reviews: ProductReview[];
};

export type Category = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  position: number;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_image_url: string | null;
  position: number;
};

export type Customer = {
  id: string;
  profile_id: string;
  stripe_customer_id: string | null;
  referral_code: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  unit_price_cents: number;
  variant_id: string;
  product_variants: {
    id: string;
    title: string;
    sku: string;
    product_id: string;
    products: {
      title: string;
      slug: string;
      product_images: ProductImage[];
    } | null;
  } | null;
};

export type Cart = {
  id: string;
  currency: CurrencyCode;
  cart_items: CartLine[];
};
