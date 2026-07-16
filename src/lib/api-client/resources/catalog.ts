import type { ProductDetail, ProductSummary } from "@/domain/commerce/types";

import type { ApiClient } from "../client";

export type { ProductDetail, ProductSummary } from "@/domain/commerce/types";

export type ListProductsQuery = {
  limit?: number;
  offset?: number;
  category?: string;
  collection?: string;
  q?: string;
};

/** List active products through the versioned contract. */
export function listProducts(
  client: ApiClient,
  query: ListProductsQuery = {},
): Promise<ProductSummary[]> {
  return client.get<ProductSummary[]>("/products", { query });
}

/** Fetch a single active product by slug. */
export function getProduct(client: ApiClient, slug: string): Promise<ProductDetail> {
  return client.get<ProductDetail>(`/products/${encodeURIComponent(slug)}`);
}
