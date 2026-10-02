# PRD — Order Management & Tracking

**Status:** Implemented (Phase 1)  
**Type:** Commerce / Customer trust  
**Owner:** Platform / Engineering  
**Brand:** Maison Fondjo  
**Constraint:** Extend existing auth, checkout, payments, account, and admin — do not remove features.

---

## 1. Vision

Customers must see where their order is. Admins must manage fulfillment. The same APIs must serve web today and mobile apps later.

## 2. Lifecycle (DB values → customer labels)

| DB status           | Customer / admin label | Phase                               |
| ------------------- | ---------------------- | ----------------------------------- |
| `pending_payment`   | Pending Payment        | Payment                             |
| `payment_submitted` | Payment Submitted      | Payment (MoMo)                      |
| `confirmed`         | Payment Confirmed      | Payment                             |
| `order_received`    | Order Received         | Fulfillment                         |
| `preparing`         | Preparing Order        | Fulfillment                         |
| `packed`            | Ready for Shipment     | Fulfillment _(kept; label updated)_ |
| `shipped`           | Shipped                | Fulfillment                         |
| `out_for_delivery`  | Out for Delivery       | Fulfillment                         |
| `delivered`         | Delivered              | Complete                            |
| `cancelled`         | Cancelled              | Exception                           |
| `refunded`          | Refunded               | Exception                           |
| `failed`            | Failed                 | Exception                           |
| `returned`          | Returned               | Exception                           |

Legacy `processing` maps to the same presentation as Preparing Order.

## 3. Flow

1. Customer checks out → order created (`pending_payment` or `payment_submitted`).
2. Stripe webhook / admin Verify → `confirmed` (Payment Confirmed) + estimated delivery window + notify.
3. Admin advances: Order Received → Preparing → Ready for Shipment → Shipped → Out for Delivery → Delivered.
4. Each change: audit log, status event, customer email (if prefs allow), in-app notification row.
5. Customer account shows timeline + estimated delivery immediately on refresh / next load.

## 4. Non-goals (this phase)

- SMS / WhatsApp / push (channel stubs remain extensible)
- Full shipment carrier integration (tracking URL hook remains)
- Replacing guest checkout or confirmation-token flow
