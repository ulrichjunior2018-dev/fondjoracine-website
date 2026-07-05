import { config, formatXaf } from "@/lib/config";

export const fondjoProductPricing = {
  originalDisplay: formatXaf(config.pricing.seveRacine),
  originalXaf: config.pricing.seveRacine,
  preorderDisplay: formatXaf(config.pricing.seveRacine),
  preorderLocalDisplay: formatXaf(config.pricing.seveRacine),
  preorderUsd: 0,
  preorderXaf: config.pricing.seveRacine,
  usdCents: config.pricing.seveRacine,
} as const;

/** Compatibility export. Prefer importing from "@/lib/config" for new code. */
export const PRICE_LABEL = fondjoProductPricing.preorderDisplay;
export const PRICE_LABEL_USD = fondjoProductPricing.preorderDisplay;
