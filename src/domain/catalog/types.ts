import type { AuditedEntity } from "@/domain/shared/entity";

export type ProductStatus = "draft" | "active" | "archived";

export type Product = AuditedEntity & {
  name: string;
  slug: string;
  status: ProductStatus;
};
