export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type CommerceTable =
  | "admin_roles"
  | "admin_user_roles"
  | "analytics_events"
  | "addresses"
  | "audit_logs"
  | "cart_items"
  | "carts"
  | "categories"
  | "collection_products"
  | "collections"
  | "coupons"
  | "customers"
  | "discounts"
  | "inventory_items"
  | "inventory_locations"
  | "inventory_movements"
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

export type Database = {
  public: {
    Tables: Record<CommerceTable, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
