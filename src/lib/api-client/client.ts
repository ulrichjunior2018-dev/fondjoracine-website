import { ApiClientError } from "./errors";
import type {
  ApiClientConfig,
  ApiFailureEnvelope,
  ApiSuccessEnvelope,
  RequestOptions,
} from "./types";

/**
 * Framework-free HTTP client for the Maison Fondjo `/api/v{n}` contract.
 *
 * The website, admin, and any future iOS/Android client all talk to the backend
 * exclusively through an instance of this class. It centralizes URL building,
 * the response envelope, bearer-token auth, and error normalization so the same
 * behavior is guaranteed on every platform.
 */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly version: string;
  private readonly getAuthToken: ApiClientConfig["getAuthToken"];
  private readonly fetchImpl: typeof fetch;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? "";
    this.version = config.version ?? "v1";
    this.getAuthToken = config.getAuthToken;
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  private buildUrl(path: string, query?: RequestOptions["query"]): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const base = `${this.baseUrl}/api/${this.version}${cleanPath}`;

    if (!query) {
      return base;
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    }

    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...options.headers,
    };

    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const token = this.getAuthToken ? await this.getAuthToken() : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const init: RequestInit = {
      method: options.method ?? "GET",
      headers,
    };

    if (options.body !== undefined) {
      init.body = JSON.stringify(options.body);
    }

    if (options.signal) {
      init.signal = options.signal;
    }

    let response: Response;
    try {
      response = await this.fetchImpl(this.buildUrl(path, options.query), init);
    } catch {
      throw new ApiClientError("NETWORK_ERROR", "Network request failed.", 0);
    }

    const rawBody = await response.text();
    let payload: unknown = null;
    if (rawBody.length > 0) {
      try {
        payload = JSON.parse(rawBody);
      } catch {
        payload = null;
      }
    }

    if (!response.ok) {
      const failure = payload as ApiFailureEnvelope | null;
      throw new ApiClientError(
        failure?.error?.code ?? "INTERNAL",
        failure?.error?.message ?? "Request failed.",
        response.status,
      );
    }

    return (payload as ApiSuccessEnvelope<T>).data;
  }

  get<T>(path: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...options, method: "POST", body });
  }

  patch<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...options, method: "PATCH", body });
  }

  put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...options, method: "PUT", body });
  }

  delete<T>(path: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}
