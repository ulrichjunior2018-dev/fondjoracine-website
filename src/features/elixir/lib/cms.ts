import { createClient } from "@supabase/supabase-js";

import { env } from "@/config/env";
import { elixirContentSchema } from "@/features/elixir/data/content-schema";
import { defaultElixirContent, type ElixirContent } from "@/features/elixir/data/content";
import { buildWaLink, config, formatXaf } from "@/lib/config";
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
    return applyRuntimeOverrides(parseElixirContent(defaultElixirContent));
  }

  let data: StorefrontContentRow | null = null;

  try {
    const result = await supabase
      .from("storefront_content")
      .select("content")
      .eq("key", STOREFRONT_CONTENT_KEY)
      .eq("status", "published")
      .maybeSingle<StorefrontContentRow>();

    if (result.error) {
      // Table missing (migrations not applied) or transient error: the site ships
      // complete bundled content, so fall back instead of crashing the storefront.
      logger.warn("Storefront CMS query failed; using bundled default content.", {
        message: result.error.message,
      });
    } else {
      data = result.data;
    }
  } catch (error) {
    logger.warn("Storefront CMS unreachable; using bundled default content.", {
      message: error instanceof Error ? error.message : String(error),
    });
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

  logger.warn(
    `Invalid storefront CMS content; using bundled defaults. Issues: ${parsedContent.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ")}`,
  );

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

export function getWhatsAppUrl(content: ElixirContent, locale: "en" | "fr") {
  void content;

  return buildWaLink("order", "", locale);
}
