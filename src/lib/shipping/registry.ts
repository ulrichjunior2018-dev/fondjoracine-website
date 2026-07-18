import { cameroonZone } from "./zones/cameroon";
import { europeZone } from "./zones/europe";
import { northAmericaZone } from "./zones/north-america";
import { restOfWorldZone } from "./zones/rest-of-world";
import type { ShippingZoneDescriptor, ShippingZoneId, ShippingZoneOption } from "./types";

/**
 * Shipping / delivery messaging zones. Checkout and trust UI resolve a zone
 * here instead of hardcoding country lists. Add a zone = new module + line below.
 */
const zones: readonly ShippingZoneDescriptor[] = [
  cameroonZone,
  northAmericaZone,
  europeZone,
  restOfWorldZone,
];

export function listShippingZones(): readonly ShippingZoneDescriptor[] {
  return zones;
}

export function getShippingZone(id: ShippingZoneId): ShippingZoneDescriptor {
  const zone = zones.find((candidate) => candidate.id === id);
  if (!zone) {
    throw new Error(`Unknown shipping zone: ${id}`);
  }
  return zone;
}

/** Resolve zone for an ISO country code (e.g. from address or geo hint). */
export function resolveShippingZone(
  countryCode: string | null | undefined,
): ShippingZoneDescriptor {
  const code = (countryCode ?? "").trim().toUpperCase();
  if (!code) {
    return restOfWorldZone;
  }

  const match = zones.find(
    (zone) =>
      zone.id !== "rest_of_world" && zone.isConfigured() && zone.countryCodes.includes(code),
  );

  return match ?? restOfWorldZone;
}

export function listConfiguredShippingZones(): ShippingZoneOption[] {
  return zones
    .filter((zone) => zone.isConfigured())
    .map((zone) => ({
      id: zone.id,
      label: zone.label,
      blurbEn: zone.blurbEn,
      blurbFr: zone.blurbFr,
    }));
}
