import { createClient } from "@supabase/supabase-js";

import { env } from "@/config/env";
import { elixirContentSchema } from "@/features/elixir/data/content-schema";
import { defaultElixirContent, type ElixirContent } from "@/features/elixir/data/content";
import { AppError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger/logger";

type StorefrontContentRow = {
  content: Partial<ElixirContent>;
};

let publicClient: ReturnType<typeof createClient> | null = null;
export const STOREFRONT_CONTENT_KEY = "fondjo-racine-seve";

function getPublicSupabaseClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  publicClient ??= createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
    },
  });

  return publicClient;
}

export async function getElixirContent(): Promise<ElixirContent> {
  const supabase = getPublicSupabaseClient();

  if (!supabase) {
    return parseElixirContent(defaultElixirContent);
  }

  const { data, error } = await supabase
    .from("storefront_content")
    .select("content")
    .eq("key", STOREFRONT_CONTENT_KEY)
    .eq("status", "published")
    .maybeSingle<StorefrontContentRow>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to load storefront content.", { expose: false });
  }

  const content = data?.content
    ? mergeContent(defaultElixirContent, data.content)
    : defaultElixirContent;

  return applyRuntimeOverrides(parseElixirContent(content));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T extends Record<string, unknown>>(base: T, overrides: Partial<T>): T {
  const merged: Record<string, unknown> = { ...base };

  Object.entries(overrides).forEach(([key, value]) => {
    const baseValue = Reflect.get(merged, key);

    if (isRecord(baseValue) && isRecord(value)) {
      Reflect.set(merged, key, deepMerge(baseValue, value));
      return;
    }

    if (value !== undefined) {
      Reflect.set(merged, key, value);
    }
  });

  return merged as T;
}

function mergeContent(base: ElixirContent, overrides: Partial<ElixirContent>): ElixirContent {
  return deepMerge(
    base as unknown as Record<string, unknown>,
    overrides as Record<string, unknown>,
  ) as unknown as ElixirContent;
}

function parseElixirContent(content: ElixirContent): ElixirContent {
  const parsedContent = elixirContentSchema.safeParse(content);

  if (parsedContent.success) {
    return parsedContent.data;
  }

  logger.error("Invalid FONDJO storefront CMS content. Falling back to bundled content.", {
    issues: parsedContent.error.issues.map((issue) => ({
      message: issue.message,
      path: issue.path.join("."),
    })),
  });

  const parsedFallback = elixirContentSchema.parse(defaultElixirContent);

  return parsedFallback;
}

function applyRuntimeOverrides(content: ElixirContent): ElixirContent {
  return {
    ...content,
    manualPayments: {
      ...content.manualPayments,
      methods: content.manualPayments.methods.map((method) => {
        const lowerLabel = method.label.toLowerCase();
        const envNumber = lowerLabel.includes("mtn")
          ? env.MTN_MOMO_NUMBER
          : lowerLabel.includes("orange")
            ? env.ORANGE_MONEY_NUMBER
            : "";

        return envNumber ? { ...method, number: envNumber } : method;
      }),
    },
    whatsapp: {
      ...content.whatsapp,
      phone: env.NEXT_PUBLIC_WHATSAPP_NUMBER || content.whatsapp.phone,
    },
  };
}

export function getWhatsAppUrl(content: ElixirContent, locale: "en" | "fr") {
  const message = encodeURIComponent(
    locale === "fr" ? content.whatsapp.message.fr : content.whatsapp.message.en,
  );
  const phone = content.whatsapp.phone.replace(/\D/g, "");

  return `https://wa.me/${phone}?text=${message}`;
}
