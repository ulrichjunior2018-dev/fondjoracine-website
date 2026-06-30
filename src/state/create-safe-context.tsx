"use client";

import { createContext, useContext } from "react";

import { AppError } from "@/lib/errors/app-error";

export function createSafeContext<T>(name: string) {
  const Context = createContext<T | null>(null);

  function useSafeContext() {
    const value = useContext(Context);

    if (!value) {
      throw new AppError("INTERNAL", `${name} must be used within its provider.`, {
        expose: false,
      });
    }

    return value;
  }

  return [Context.Provider, useSafeContext] as const;
}
