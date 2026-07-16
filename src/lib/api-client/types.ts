/**
 * Transport-level contract shared by every Maison Fondjo client.
 *
 * The server responds with either `{ data }` (success) or `{ error }` (failure).
 * These types are intentionally framework-free so they can be reused verbatim by
 * a React Native / native mobile client or an external SDK consumer.
 */

export type ApiSuccessEnvelope<T> = {
  data: T;
};

export type ApiFailureEnvelope = {
  error: {
    code: string;
    message: string;
  };
};

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiFailureEnvelope;

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type QueryValue = string | number | boolean | undefined;

export type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, QueryValue>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export type ApiClientConfig = {
  /** Origin to prefix requests with. Empty string = same-origin (browser default). */
  baseUrl?: string;
  /** API version segment. Defaults to `v1`. */
  version?: string;
  /** Optional async provider for a bearer token (mobile / authenticated calls). */
  getAuthToken?: () => string | null | Promise<string | null>;
  /** Injectable fetch implementation for tests or non-browser runtimes. */
  fetchImpl?: typeof fetch;
};
