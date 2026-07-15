/**
 * Supabase database types.
 *
 * ⚠️ BASELINE SNAPSHOT — hand-maintained, not yet machine-generated.
 *
 * This file mirrors the shape that `supabase gen types typescript` produces, but
 * currently covers only the tables the application actively reads/writes plus the
 * full public enum set. Column definitions are transcribed from
 * `supabase/migrations/000001`–`000010` and are accurate as of migration 000010.
 *
 * To replace this with the COMPLETE, authoritative schema (all tables, views,
 * functions, relationships), run:
 *
 *   npm run db:types        # remote project (needs SUPABASE_PROJECT_ID + logged-in CLI)
 *   npm run db:types:local  # against a local `supabase start` stack
 *
 * That command overwrites this file. Do not add business logic here.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type ProductStatus = "draft" | "active" | "archived";
type OrderStatus =
  | "draft"
  | "pending"
  | "paid"
  | "processing"
  | "fulfilled"
  | "cancelled"
  | "refunded"
  | "pending_payment"
  | "payment_submitted"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered";
type PaymentStatus =
  | "requires_payment_method"
  | "requires_confirmation"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";
type FulfillmentStatus = "unfulfilled" | "partial" | "fulfilled" | "returned";
type ReviewStatus = "pending" | "approved" | "rejected";
type SubscriptionStatus = "active" | "paused" | "cancelled" | "past_due";
type TicketStatus = "open" | "pending" | "resolved" | "closed";
type NotificationChannel = "email" | "in_app" | "sms";
type DiscountType = "percentage" | "fixed_amount" | "free_shipping";
type InventoryMovementType =
  "adjustment" | "sale" | "return" | "reservation" | "release" | "transfer";
type StorefrontContentStatus = "draft" | "published" | "archived";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          role: string;
          phone: string | null;
          avatar_url: string | null;
          marketing_consent: boolean;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: string;
          phone?: string | null;
          avatar_url?: string | null;
          marketing_consent?: boolean;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: string;
          phone?: string | null;
          avatar_url?: string | null;
          marketing_consent?: boolean;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          profile_id: string;
          stripe_customer_id: string | null;
          referral_code: string;
          referred_by_customer_id: string | null;
          lifetime_value_cents: number;
          orders_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          stripe_customer_id?: string | null;
          referral_code: string;
          referred_by_customer_id?: string | null;
          lifetime_value_cents?: number;
          orders_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          stripe_customer_id?: string | null;
          referral_code?: string;
          referred_by_customer_id?: string | null;
          lifetime_value_cents?: number;
          orders_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          parent_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          position: number;
          is_active: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          position?: number;
          is_active?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          position?: number;
          is_active?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          hero_image_url: string | null;
          position: number;
          is_active: boolean;
          starts_at: string | null;
          ends_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          hero_image_url?: string | null;
          position?: number;
          is_active?: boolean;
          starts_at?: string | null;
          ends_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          hero_image_url?: string | null;
          position?: number;
          is_active?: boolean;
          starts_at?: string | null;
          ends_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      collection_products: {
        Row: {
          collection_id: string;
          product_id: string;
          position: number;
        };
        Insert: {
          collection_id: string;
          product_id: string;
          position?: number;
        };
        Update: {
          collection_id?: string;
          product_id?: string;
          position?: number;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          subtitle: string | null;
          description: string | null;
          status: ProductStatus;
          brand: string;
          sku_prefix: string | null;
          ingredients: string | null;
          usage_instructions: string | null;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          subtitle?: string | null;
          description?: string | null;
          status?: ProductStatus;
          brand?: string;
          sku_prefix?: string | null;
          ingredients?: string | null;
          usage_instructions?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          subtitle?: string | null;
          description?: string | null;
          status?: ProductStatus;
          brand?: string;
          sku_prefix?: string | null;
          ingredients?: string | null;
          usage_instructions?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          title: string;
          sku: string;
          barcode: string | null;
          price_cents: number;
          compare_at_price_cents: number | null;
          currency: string;
          weight_grams: number | null;
          option_values: Json;
          is_default: boolean;
          is_active: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          title: string;
          sku: string;
          barcode?: string | null;
          price_cents: number;
          compare_at_price_cents?: number | null;
          currency?: string;
          weight_grams?: number | null;
          option_values?: Json;
          is_default?: boolean;
          is_active?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          title?: string;
          sku?: string;
          barcode?: string | null;
          price_cents?: number;
          compare_at_price_cents?: number | null;
          currency?: string;
          weight_grams?: number | null;
          option_values?: Json;
          is_default?: boolean;
          is_active?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          url: string;
          alt: string;
          position: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          url: string;
          alt: string;
          position?: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_id?: string | null;
          url?: string;
          alt?: string;
          position?: number;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          cart_id: string | null;
          status: OrderStatus;
          fulfillment_status: FulfillmentStatus;
          currency: string;
          subtotal_cents: number;
          discount_cents: number;
          shipping_cents: number;
          tax_cents: number;
          total_cents: number;
          email: string | null;
          shipping_address: Json;
          billing_address: Json;
          coupon_id: string | null;
          stripe_checkout_session_id: string | null;
          metadata: Json;
          placed_at: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          delivery_city: string | null;
          delivery_address: string | null;
          payment_method: string | null;
          manual_payment_reference: string | null;
          manual_payment_provider: string | null;
          payment_instructions: Json;
          confirmation_token: string | null;
          admin_payment_verified_at: string | null;
          admin_payment_verified_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          cart_id?: string | null;
          status?: OrderStatus;
          fulfillment_status?: FulfillmentStatus;
          currency?: string;
          subtotal_cents: number;
          discount_cents?: number;
          shipping_cents?: number;
          tax_cents?: number;
          total_cents: number;
          email?: string | null;
          shipping_address: Json;
          billing_address: Json;
          coupon_id?: string | null;
          stripe_checkout_session_id?: string | null;
          metadata?: Json;
          placed_at?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          delivery_city?: string | null;
          delivery_address?: string | null;
          payment_method?: string | null;
          manual_payment_reference?: string | null;
          manual_payment_provider?: string | null;
          payment_instructions?: Json;
          confirmation_token?: string | null;
          admin_payment_verified_at?: string | null;
          admin_payment_verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          cart_id?: string | null;
          status?: OrderStatus;
          fulfillment_status?: FulfillmentStatus;
          currency?: string;
          subtotal_cents?: number;
          discount_cents?: number;
          shipping_cents?: number;
          tax_cents?: number;
          total_cents?: number;
          email?: string | null;
          shipping_address?: Json;
          billing_address?: Json;
          coupon_id?: string | null;
          stripe_checkout_session_id?: string | null;
          metadata?: Json;
          placed_at?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          delivery_city?: string | null;
          delivery_address?: string | null;
          payment_method?: string | null;
          manual_payment_reference?: string | null;
          manual_payment_provider?: string | null;
          payment_instructions?: Json;
          confirmation_token?: string | null;
          admin_payment_verified_at?: string | null;
          admin_payment_verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          title: string;
          variant_title: string | null;
          sku: string | null;
          quantity: number;
          unit_price_cents: number;
          total_cents: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          title: string;
          variant_title?: string | null;
          sku?: string | null;
          quantity: number;
          unit_price_cents: number;
          total_cents: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          title?: string;
          variant_title?: string | null;
          sku?: string | null;
          quantity?: number;
          unit_price_cents?: number;
          total_cents?: number;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          customer_id: string;
          label: string | null;
          first_name: string;
          last_name: string;
          company: string | null;
          line1: string;
          line2: string | null;
          city: string;
          region: string;
          postal_code: string;
          country_code: string;
          phone: string | null;
          is_default_shipping: boolean;
          is_default_billing: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          label?: string | null;
          first_name: string;
          last_name: string;
          company?: string | null;
          line1: string;
          line2?: string | null;
          city: string;
          region: string;
          postal_code: string;
          country_code: string;
          phone?: string | null;
          is_default_shipping?: boolean;
          is_default_billing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          label?: string | null;
          first_name?: string;
          last_name?: string;
          company?: string | null;
          line1?: string;
          line2?: string | null;
          city?: string;
          region?: string;
          postal_code?: string;
          country_code?: string;
          phone?: string | null;
          is_default_shipping?: boolean;
          is_default_billing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      customer_notification_preferences: {
        Row: {
          customer_id: string;
          order_updates: boolean;
          promotions: boolean;
          product_launches: boolean;
          hair_care_tips: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_id: string;
          order_updates?: boolean;
          promotions?: boolean;
          product_launches?: boolean;
          hair_care_tips?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          customer_id?: string;
          order_updates?: boolean;
          promotions?: boolean;
          product_launches?: boolean;
          hair_care_tips?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          provider: string;
          provider_payment_id: string;
          status: PaymentStatus;
          amount_cents: number;
          currency: string;
          captured_at: string | null;
          refunded_cents: number;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          provider?: string;
          provider_payment_id: string;
          status: PaymentStatus;
          amount_cents: number;
          currency?: string;
          captured_at?: string | null;
          refunded_cents?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          provider?: string;
          provider_payment_id?: string;
          status?: PaymentStatus;
          amount_cents?: number;
          currency?: string;
          captured_at?: string | null;
          refunded_cents?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_status: ProductStatus;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      fulfillment_status: FulfillmentStatus;
      review_status: ReviewStatus;
      subscription_status: SubscriptionStatus;
      ticket_status: TicketStatus;
      notification_channel: NotificationChannel;
      discount_type: DiscountType;
      inventory_movement_type: InventoryMovementType;
      storefront_content_status: StorefrontContentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database["public"];

/** Row type for a public table, e.g. `Tables<"orders">`. */
export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];

/** Insert type for a public table, e.g. `TablesInsert<"orders">`. */
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];

/** Update type for a public table, e.g. `TablesUpdate<"orders">`. */
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];

/** Enum union for a public enum, e.g. `Enums<"order_status">`. */
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];
