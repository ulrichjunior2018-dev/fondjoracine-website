import type { CustomerProfile } from "@/domain/customer/types";

export interface CustomerRepository {
  findByUserId(userId: string): Promise<CustomerProfile | null>;
}
