import type { ShippingZoneDescriptor } from "../types";

export const cameroonZone: ShippingZoneDescriptor = {
  id: "cameroon",
  label: "Cameroon",
  countryCodes: ["CM"],
  blurbEn: "Local delivery across Cameroon. Confirm timing on WhatsApp.",
  blurbFr: "Livraison locale au Cameroun. Confirmez le delai sur WhatsApp.",
  isConfigured: () => true,
};
