/**
 * Shipping zone abstraction.
 *
 * Checkout / trust UI must not hardcode country lists. Resolve a zone from the
 * registry and read messaging capabilities. Add a zone = new module + registry line.
 */

export type ShippingZoneId = "cameroon" | "north_america" | "europe" | "rest_of_world";

export type ShippingZoneOption = {
  id: ShippingZoneId;
  label: string;
  /** Short customer-facing delivery note (EN). */
  blurbEn: string;
  /** Short customer-facing delivery note (FR). */
  blurbFr: string;
};

export interface ShippingZoneDescriptor {
  id: ShippingZoneId;
  label: string;
  /** ISO country codes this zone matches (uppercase). Empty = fallback zone. */
  countryCodes: readonly string[];
  blurbEn: string;
  blurbFr: string;
  /** Whether this zone is active for messaging / rates. */
  isConfigured: () => boolean;
}
