# `src/lib/shipping` — Delivery zone registry

**Pattern:** descriptor + registry (see `docs/EXTENSIBILITY.md`)

## Add a zone

1. Create `zones/<id>.ts` implementing `ShippingZoneDescriptor`
2. Register it in `registry.ts`
3. Call `resolveShippingZone(countryCode)` from UI/services — do not hardcode country lists

## Related

- Consumers: trust/checkout messaging, future shipping-rate services
- Payments / identity / notifications use the same extensibility pattern
