# `src/lib/order-status` — Order status presentation registry

**Pattern:** descriptor + registry (see `docs/EXTENSIBILITY.md`)

Customer account, confirmation pages, and admin tables should call
`getOrderStatus` / `getOrderStatusLabel` instead of local `switch (status)` trees.

## Add a status

1. Add a descriptor in `statuses.ts` (or `statuses/<id>.ts` if the set grows large)
2. Register it in `registry.ts`
3. Ensure the DB/domain enum allows the value if it is persisted
