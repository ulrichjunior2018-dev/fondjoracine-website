export type AuthRole = "customer" | "admin";

export type AuthSessionUser = {
  id: string;
  email: string;
  role: AuthRole;
};
