"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AdminOrder = {
  admin_payment_verified_at: string | null;
  created_at: string;
  currency: string;
  customer_name: string | null;
  customer_phone: string | null;
  delivery_city: string | null;
  id: string;
  manual_payment_reference: string | null;
  order_number: string;
  payment_method: string | null;
  status: string;
  total_cents: number;
};

type AdminOrdersTableProps = {
  orders: AdminOrder[];
};

const orderStatuses = [
  "pending_payment",
  "payment_submitted",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

type AdminOrderStatus = (typeof orderStatuses)[number];

function formatAmount(amount: number, currency: string) {
  if (currency === "XAF") {
    return `${amount.toLocaleString("en-US")} XAF`;
  }

  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(amount / 100);
}

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const [rows, setRows] = useState(orders);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(orderId: string, status: AdminOrderStatus) {
    setError(null);
    setPendingId(orderId);

    const response = await fetch(`/api/admin/orders/${orderId}`, {
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
    const payload = (await response.json()) as {
      data?: {
        order: {
          admin_payment_verified_at: string | null;
          id: string;
          status: string;
        };
      };
      error?: {
        message: string;
      };
    };

    if (!response.ok || !payload.data) {
      setError(payload.error?.message ?? "Unable to update order.");
      setPendingId(null);
      return;
    }

    setRows((current) =>
      current.map((row) =>
        row.id === orderId
          ? {
              ...row,
              admin_payment_verified_at: payload.data?.order.admin_payment_verified_at ?? null,
              status: payload.data?.order.status ?? row.status,
            }
          : row,
      ),
    );
    setPendingId(null);
  }

  return (
    <div className="grid gap-4">
      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive-muted p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <p className="font-semibold">{order.order_number}</p>
                <p className="mt-1 text-xs text-foreground/56">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </TableCell>
              <TableCell>
                <p>{order.customer_name ?? "Guest"}</p>
                <p className="mt-1 text-xs text-foreground/56">{order.customer_phone}</p>
                <p className="mt-1 text-xs text-foreground/56">{order.delivery_city}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium">{order.payment_method}</p>
                <p className="mt-1 text-xs text-foreground/56">
                  {order.manual_payment_reference ?? "No reference"}
                </p>
              </TableCell>
              <TableCell>{formatAmount(order.total_cents, order.currency)}</TableCell>
              <TableCell>
                <span className="rounded-md bg-surface-muted px-2.5 py-1 text-xs font-semibold">
                  {order.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    disabled={order.status === "confirmed"}
                    isLoading={pendingId === order.id}
                    onClick={() => void updateStatus(order.id, "confirmed")}
                    size="sm"
                  >
                    Verify
                  </Button>
                  <select
                    aria-label={`Update status for ${order.order_number}`}
                    className="h-9 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-foreground"
                    disabled={pendingId === order.id}
                    value={order.status}
                    onChange={(event) =>
                      void updateStatus(order.id, event.target.value as AdminOrderStatus)
                    }
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
