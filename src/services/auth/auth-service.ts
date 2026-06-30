import type { AuthSessionUser } from "@/domain/auth/types";

export interface AuthService {
  getCurrentUser(): Promise<AuthSessionUser | null>;
}
