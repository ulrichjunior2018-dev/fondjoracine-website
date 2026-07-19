export type AccountTheme = "light" | "dark";

/**
 * Resolve the dashboard palette from `next-themes`.
 * Prefer the user's explicit choice (`light` / `dark`) over `resolvedTheme`, which
 * can lag on mobile WebKit after `setTheme`.
 */
export function resolveAccountTheme(
  theme: string | undefined,
  systemTheme: string | undefined,
  resolvedTheme: string | undefined,
): AccountTheme {
  if (theme === "light") {
    return "light";
  }

  if (theme === "dark") {
    return "dark";
  }

  if (theme === "system") {
    return systemTheme === "dark" ? "dark" : "light";
  }

  return resolvedTheme === "dark" ? "dark" : "light";
}
