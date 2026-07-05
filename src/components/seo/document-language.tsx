"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function DocumentLanguage() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = "fr";
  }, [pathname]);

  return null;
}
