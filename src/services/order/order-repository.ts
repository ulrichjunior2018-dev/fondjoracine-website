import type { Order } from "@/domain/order/types";

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
}
