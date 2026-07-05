"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { isLocale, localeStorageKey } from "@/lib/locale";

export function DocumentLanguage() {
  const pathname = usePathname();

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(localeStorageKey);
    document.documentElement.lang = isLocale(storedLocale) ? storedLocale : "en";
  }, [pathname]);

  return null;
}
