import type { AuditedEntity } from "@/domain/shared/entity";

export type CustomerProfile = AuditedEntity & {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};
