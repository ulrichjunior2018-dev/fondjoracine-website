import type { ShippingZoneDescriptor } from "../types";

/** Fallback when no country-specific zone matches. */
export const restOfWorldZone: ShippingZoneDescriptor = {
  id: "rest_of_world",
  label: "Rest of world",
  countryCodes: [],
  blurbEn: "International shipping available. Confirm destination on WhatsApp.",
  blurbFr: "Livraison internationale disponible. Confirmez la destination sur WhatsApp.",
  isConfigured: () => true,
};
