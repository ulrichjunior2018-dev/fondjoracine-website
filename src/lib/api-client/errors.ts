/**
 * Error thrown by the shared API client when a request fails. Mirrors the
 * server-side error envelope (`{ error: { code, message } }`) so every client
 * platform can branch on a stable `code` regardless of transport.
 */
export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
  }
}
