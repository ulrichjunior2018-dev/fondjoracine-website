export type {
  Database,
  Enums,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database/types.generated";

/**
 * Every table in the `public` schema (source of truth:
 * `supabase/migrations/000001`–`000009`). Useful for typing `.from(table)`
 * arguments. Column-level typing comes from `types.generated.ts`.
 */
export type CommerceTable =
  | "addresses"
  | "admin_roles"
  | "admin_user_roles"
  | "analytics_events"
  | "audit_logs"
  | "cart_items"
  | "carts"
  | "categories"
  | "collection_products"
  | "collections"
  | "coupons"
  | "customer_notification_preferences"
  | "customers"
  | "discounts"
  | "hair_consultations"
  | "inner_circle_members"
  | "inventory_items"
  | "inventory_locations"
  | "inventory_movements"
  | "newsletter_signups"
  | "notifications"
  | "order_items"
  | "orders"
  | "payments"
  | "product_categories"
  | "product_images"
  | "product_variants"
  | "products"
  | "profiles"
  | "referrals"
  | "reviews"
  | "shipments"
  | "shipping_rates"
  | "storefront_content"
  | "subscription_items"
  | "subscriptions"
  | "support_ticket_messages"
  | "support_tickets"
  | "tax_rates"
  | "wishlist_items"
  | "wishlists";

export const adminPermissions = {
  analyticsRead: "analytics.read",
  auditRead: "audit.read",
  catalogRead: "catalog.read",
  catalogWrite: "catalog.write",
  contentRead: "content.read",
  contentWrite: "content.write",
  customersRead: "customers.read",
  customersWrite: "customers.write",
  inventoryRead: "inventory.read",
  inventoryWrite: "inventory.write",
  ordersRead: "orders.read",
  ordersWrite: "orders.write",
  paymentsRead: "payments.read",
  paymentsWrite: "payments.write",
  promotionsRead: "promotions.read",
  promotionsWrite: "promotions.write",
  reviewsRead: "reviews.read",
  reviewsWrite: "reviews.write",
  shippingRead: "shipping.read",
  shippingWrite: "shipping.write",
  subscriptionsRead: "subscriptions.read",
  subscriptionsWrite: "subscriptions.write",
  supportRead: "support.read",
  supportWrite: "support.write",
  taxesRead: "taxes.read",
  taxesWrite: "taxes.write",
} as const;

export type AdminPermission = (typeof adminPermissions)[keyof typeof adminPermissions];
