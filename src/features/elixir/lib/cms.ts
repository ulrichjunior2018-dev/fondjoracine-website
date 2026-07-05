import { createClient } from "@supabase/supabase-js";

import { env } from "@/config/env";
import { elixirContentSchema } from "@/features/elixir/data/content-schema";
import {
  defaultElixirContent,
  type ElixirContent,
  type LocalizedText,
} from "@/features/elixir/data/content";
import { buildWaLink, config, formatXaf } from "@/lib/config";
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
    return prepareFrenchContent(applyRuntimeOverrides(parseElixirContent(defaultElixirContent)));
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

  return prepareFrenchContent(applyRuntimeOverrides(parseElixirContent(content)));
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

  logger.error("Invalid Maison Fondjo storefront CMS content. Falling back to bundled content.", {
    issues: parsedContent.error.issues.map((issue) => ({
      message: issue.message,
      path: issue.path.join("."),
    })),
  });

  const parsedFallback = elixirContentSchema.parse(defaultElixirContent);

  return applyRuntimeOverrides(parsedFallback);
}

function applyRuntimeOverrides(content: ElixirContent): ElixirContent {
  const runtimeContent = {
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
    innerCircle: {
      ...content.innerCircle,
      priceXaf: `${formatXaf(config.pricing.seveRacine)} local equivalent`,
    },
    currency: "XAF",
    priceCents: config.pricing.seveRacine,
    priceXaf: formatXaf(config.pricing.seveRacine),
    product: {
      ...content.product,
      priceXaf: formatXaf(config.pricing.seveRacine),
    },
    whatsapp: {
      ...content.whatsapp,
      phone: env.NEXT_PUBLIC_WHATSAPP_NUMBER || content.whatsapp.phone,
    },
  };

  return runtimeContent;
}

function isLocalizedText(value: unknown): value is LocalizedText {
  return (
    isRecord(value) &&
    typeof value.fr === "string" &&
    typeof value.en === "string" &&
    Object.keys(value).every((key) => key === "fr" || key === "en")
  );
}

function forceFrenchLocalizedText<T>(value: T): T {
  if (isLocalizedText(value)) {
    return {
      en: value.fr,
      fr: value.fr,
    } as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => forceFrenchLocalizedText(item)) as T;
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        forceFrenchLocalizedText(nestedValue),
      ]),
    ) as T;
  }

  return value;
}

function prepareFrenchContent(content: ElixirContent): ElixirContent {
  return forceFrenchLocalizedText(content);
}

export function getWhatsAppUrl(content: ElixirContent, locale: "en" | "fr") {
  void content;

  return buildWaLink("order", "", locale);
}
