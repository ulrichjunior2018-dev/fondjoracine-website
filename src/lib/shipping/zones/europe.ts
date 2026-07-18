import type { ShippingZoneDescriptor } from "../types";

/** EU member states commonly targeted for Fondjo messaging (extend as needed). */
const EU_CODES = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
] as const;

export const europeZone: ShippingZoneDescriptor = {
  id: "europe",
  label: "Europe",
  countryCodes: EU_CODES,
  blurbEn: "Ships across Europe. Delivery windows confirmed at checkout.",
  blurbFr: "Expedie en Europe. Delais confirmes au paiement.",
  isConfigured: () => true,
};
