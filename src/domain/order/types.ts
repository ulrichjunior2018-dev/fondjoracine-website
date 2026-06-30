import type { AuditedEntity } from "@/domain/shared/entity";

export type OrderStatus =
  | "pending_payment"
  | "payment_submitted"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type Order = AuditedEntity & {
  customerId: string;
  status: OrderStatus;
  totalCents: number;
  currency: "usd";
};
