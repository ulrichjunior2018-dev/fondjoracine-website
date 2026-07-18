import { cookies } from "next/headers";

import type { Locale } from "@/content/copy";
import { isLocale, localeCookieKey } from "@/lib/locale";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(localeCookieKey)?.value;
  return isLocale(value) ? value : "en";
}
