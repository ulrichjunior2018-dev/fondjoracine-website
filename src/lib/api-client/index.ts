import { ApiClient } from "./client";

export { ApiClient } from "./client";
export { ApiClientError } from "./errors";
export type {
  ApiClientConfig,
  ApiEnvelope,
  ApiFailureEnvelope,
  ApiSuccessEnvelope,
  HttpMethod,
  QueryValue,
  RequestOptions,
} from "./types";
export * from "./resources/health";
export * from "./resources/catalog";
export * from "./resources/payments";
export * from "./resources/identity";
export * from "./resources/account";

/**
 * Default same-origin client for use inside the website (browser and Route
 * Handlers on the same deployment). Mobile / external consumers instantiate
 * their own `ApiClient` with a `baseUrl` and `getAuthToken`.
 */
export const apiClient = new ApiClient();
