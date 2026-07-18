import type { ShippingZoneDescriptor } from "../types";

export const northAmericaZone: ShippingZoneDescriptor = {
  id: "north_america",
  label: "North America",
  countryCodes: ["US", "CA"],
  blurbEn: "Ships to the US and Canada. Duties may apply.",
  blurbFr: "Expedie vers les Etats-Unis et le Canada. Des droits de douane peuvent s'appliquer.",
  isConfigured: () => true,
};
