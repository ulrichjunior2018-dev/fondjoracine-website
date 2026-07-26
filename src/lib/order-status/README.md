# `src/lib/order-status` — Order status presentation registry

**Pattern:** descriptor + registry (see `docs/EXTENSIBILITY.md`)

Customer account, confirmation pages, and admin tables should call
`getOrderStatus` / `getOrderStatusLabel` / `buildOrderTimeline` instead of local
`switch (status)` trees.

## Lifecycle (happy path)

Pending Payment → Payment Submitted (MoMo) → Payment Confirmed → Order Received →
Preparing Order → Ready for Shipment → Shipped → Out for Delivery → Delivered

Exceptional: Cancelled, Refunded, Failed, Returned

## Add a status

1. Add a descriptor in `statuses.ts`
2. Register it in `registry.ts` (+ lifecycle rank if progressive)
3. Add the DB enum value in a Supabase migration
4. Allow it in `adminOrderStatusUpdateSchema`
