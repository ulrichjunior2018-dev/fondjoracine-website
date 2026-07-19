import { cookies, headers } from "next/headers";

import type { Locale } from "@/content/copy";
import { detectLocaleFromLanguageTags, isLocale, localeCookieKey } from "@/lib/locale";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(localeCookieKey)?.value;

  if (isLocale(cookieValue)) {
    return cookieValue;
  }

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language");

  if (acceptLanguage) {
    return detectLocaleFromLanguageTags(acceptLanguage);
  }

  return "en";
}
