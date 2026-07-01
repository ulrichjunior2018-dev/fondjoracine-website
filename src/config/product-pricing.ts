export const fondjoProductPricing = {
  preorderUsd: 16,
  usdCents: 1600,
  preorderXaf: 8500,
  originalXaf: 9500,
  preorderDisplay: "$16 USD / 8,500 XAF",
  preorderLocalDisplay: "8,500 XAF",
  originalDisplay: "9,500 XAF",
} as const;

/** Single source of truth for CTA price strings. Import this — never hardcode. */
export const PRICE_LABEL = fondjoProductPricing.preorderDisplay; // "$16 USD / 8,500 XAF"
export const PRICE_LABEL_USD = `$${fondjoProductPricing.preorderUsd}`; // "$16"
