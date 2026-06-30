import type { Product } from "@/domain/catalog/types";

export interface ProductRepository {
  findBySlug(slug: string): Promise<Product | null>;
  listActive(): Promise<Product[]>;
}
