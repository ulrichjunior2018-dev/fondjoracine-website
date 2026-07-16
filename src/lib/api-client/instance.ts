import { ApiClient } from "./client";

/**
 * Shared browser `ApiClient` singleton for client components. Same-origin
 * requests automatically carry the Supabase session cookie, so no
 * `getAuthToken` is needed here — that hook exists in `ApiClientConfig` for a
 * future bearer-token consumer (React Native / external SDK usage).
 */
let browserClient: ApiClient | null = null;

export function getApiClient(): ApiClient {
  browserClient ??= new ApiClient();

  return browserClient;
}
