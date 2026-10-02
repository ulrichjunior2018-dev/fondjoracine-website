"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listOrderStatusOptions } from "@/lib/order-status/registry";

type AdminOrder = {
  admin_notes: string | null;
  admin_payment_verified_at: string | null;
  created_at: string;
  currency: string;
  customer_name: string | null;
  customer_phone: string | null;
  delivery_address: string | null;
  delivery_city: string | null;
  email: string | null;
  estimated_delivery_end: string | null;
  estimated_delivery_start: string | null;
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

const statusOptions = listOrderStatusOptions();

function formatAmount(amount: number, currency: string) {
  if (currency === "XAF") {
    return `${amount.toLocaleString("en-US")} XAF`;
  }

  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(amount / 100);
}

function statusLabel(id: string) {
  return statusOptions.find((option) => option.id === id)?.labelEn ?? id.replace(/_/g, " ");
}

type OrderOverride = Partial<AdminOrder>;

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const router = useRouter();
  const [overrides, setOverrides] = useState<Record<string, OrderOverride>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [isRefreshing, startRefresh] = useTransition();

  const rows = orders.map((order) => ({
    ...order,
    ...overrides[order.id],
  }));

  const cities = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((order) => {
      if (order.delivery_city?.trim()) set.add(order.delivery_city.trim());
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (cityFilter !== "all" && (order.delivery_city ?? "") !== cityFilter) return false;
      if (!q) return true;
      const haystack = [
        order.order_number,
        order.customer_name,
        order.customer_phone,
        order.email,
        order.delivery_city,
        order.manual_payment_reference,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, query, statusFilter, cityFilter]);

  function refreshOrders() {
    startRefresh(() => {
      router.refresh();
    });
  }

  async function updateStatus(orderId: string, status: string, note?: string) {
    setError(null);
    setPendingId(orderId);

    const response = await fetch(`/api/admin/orders/${orderId}`, {
      body: JSON.stringify({
        status,
        ...(note?.trim() ? { note: note.trim() } : {}),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });
    const payload = (await response.json()) as {
      data?: {
        order: {
          admin_notes: string | null;
          admin_payment_verified_at: string | null;
          estimated_delivery_end: string | null;
          estimated_delivery_start: string | null;
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

    setOverrides((current) => ({
      ...current,
      [orderId]: {
        admin_notes: payload.data?.order.admin_notes ?? null,
        admin_payment_verified_at: payload.data?.order.admin_payment_verified_at ?? null,
        estimated_delivery_end: payload.data?.order.estimated_delivery_end ?? null,
        estimated_delivery_start: payload.data?.order.estimated_delivery_start ?? null,
        status: payload.data?.order.status ?? status,
      },
    }));
    setNoteDrafts((current) => ({ ...current, [orderId]: "" }));
    setPendingId(null);
    refreshOrders();
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid w-full gap-3 sm:max-w-3xl sm:grid-cols-3">
          <label className="grid gap-1 text-xs font-semibold text-foreground/70">
            Search
            <input
              className="h-10 rounded-md border border-border bg-surface px-3 text-sm font-normal text-foreground"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Order #, name, phone, city…"
              type="search"
              value={query}
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-foreground/70">
            Status
            <select
              className="h-10 rounded-md border border-border bg-surface px-3 text-sm font-normal text-foreground"
              onChange={(event) => setStatusFilter(event.target.value)}
              value={statusFilter}
            >
              <option value="all">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.labelEn}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-semibold text-foreground/70">
            City
            <select
              className="h-10 rounded-md border border-border bg-surface px-3 text-sm font-normal text-foreground"
              onChange={(event) => setCityFilter(event.target.value)}
              value={cityFilter}
            >
              <option value="all">All cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Button
          isLoading={isRefreshing}
          onClick={refreshOrders}
          size="sm"
          type="button"
          variant="secondary"
        >
          Refresh orders
        </Button>
      </div>

      <p className="text-sm text-foreground/68">
        {filtered.length === 0
          ? "No orders match these filters."
          : `${filtered.length} order${filtered.length === 1 ? "" : "s"}`}
      </p>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive-muted p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {orders.length === 0 ? (
        <p className="rounded-md border border-border bg-surface-muted p-6 text-sm text-foreground/68">
          Waiting for the first storefront order. When a customer pays or places an order, it will
          show in this list and you will get an email at ADMIN_EMAIL.
        </p>
      ) : (
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
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="mt-1 text-xs text-foreground/56">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  {order.estimated_delivery_start && order.estimated_delivery_end ? (
                    <p className="mt-1 text-xs text-foreground/56">
                      ETA {order.estimated_delivery_start} → {order.estimated_delivery_end}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <p>{order.customer_name ?? "Guest"}</p>
                  <p className="mt-1 text-xs text-foreground/56">{order.customer_phone}</p>
                  <p className="mt-1 text-xs text-foreground/56">{order.email}</p>
                  <p className="mt-1 text-xs text-foreground/56">{order.delivery_city}</p>
                  {order.delivery_address ? (
                    <p className="mt-1 max-w-[16rem] text-xs text-foreground/56">
                      {order.delivery_address}
                    </p>
                  ) : null}
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
                    {statusLabel(order.status)}
                  </span>
                  {order.admin_notes ? (
                    <p className="mt-2 max-w-[14rem] whitespace-pre-wrap text-xs text-foreground/56">
                      {order.admin_notes}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <div className="flex min-w-[14rem] flex-col gap-2">
                    <Button
                      disabled={order.status === "confirmed" || pendingId === order.id}
                      isLoading={pendingId === order.id}
                      onClick={() => void updateStatus(order.id, "confirmed")}
                      size="sm"
                    >
                      Verify payment
                    </Button>
                    <select
                      aria-label={`Update status for ${order.order_number}`}
                      className="h-9 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-foreground"
                      disabled={pendingId === order.id}
                      value={order.status}
                      onChange={(event) =>
                        void updateStatus(order.id, event.target.value, noteDrafts[order.id])
                      }
                    >
                      {!statusOptions.some((status) => status.id === order.status) ? (
                        <option value={order.status}>{statusLabel(order.status)}</option>
                      ) : null}
                      {statusOptions.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.labelEn}
                        </option>
                      ))}
                    </select>
                    <textarea
                      aria-label={`Internal note for ${order.order_number}`}
                      className="min-h-[64px] rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground"
                      onChange={(event) =>
                        setNoteDrafts((current) => ({
                          ...current,
                          [order.id]: event.target.value,
                        }))
                      }
                      placeholder="Internal note (saved with next status change)"
                      value={noteDrafts[order.id] ?? ""}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
