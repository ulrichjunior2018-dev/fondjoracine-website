import type { ApiClient } from "../client";

export type HealthStatus = {
  status: string;
  service: string;
  version: string;
  timestamp: string;
};

/**
 * First typed resource against the versioned contract. New resources
 * (catalog, cart, orders, ...) follow this same shape: a small function that
 * takes the `ApiClient` and returns typed data.
 */
export function getHealth(client: ApiClient): Promise<HealthStatus> {
  return client.get<HealthStatus>("/health");
}
