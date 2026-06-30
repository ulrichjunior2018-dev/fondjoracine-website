"use client";

import { Download, ImageIcon, MessageCircle, Save, Users } from "lucide-react";
import type { ComponentProps } from "react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ElixirContent } from "@/features/elixir/data/content";
import { AdminOrdersTable } from "@/features/admin/components/admin-orders-table";
import type { HairConsultationRecommendation } from "@/services/commerce/hair-consultation-service";

type AdminDashboardProps = {
  analytics: {
    customersCount: number;
    hairConsultationsCount: number;
    highRiskConsultationsCount: number;
    ordersCount: number;
    paymentPendingCount: number;
    stockCount: number;
  };
  content: ElixirContent;
  consultations: Array<{
    created_at: string;
    customer_name: string;
    email: string | null;
    id: string;
    phone: string;
    recommendation: HairConsultationRecommendation;
    risk_level: "low" | "medium" | "high";
    whatsapp_followup_status: string;
  }>;
  innerCircle: Array<{
    city: string | null;
    email: string | null;
    full_name: string;
    id: string;
    notes: string | null;
    phone: string;
    started_at: string;
    status: string;
  }>;
  newsletter: Array<{
    created_at: string;
    email: string;
    source: string | null;
  }>;
  orders: ComponentProps<typeof AdminOrdersTable>["orders"];
};

type ApiResponse<T> = {
  data?: T;
  error?: {
    message: string;
  };
};

function getJson(content: ElixirContent) {
  return JSON.stringify(content, null, 2);
}

export function AdminDashboard({
  analytics,
  consultations,
  content,
  innerCircle,
  newsletter,
  orders,
}: AdminDashboardProps) {
  const [cmsContent, setCmsContent] = useState(content);
  const [contentJson, setContentJson] = useState(getJson(content));
  const [stockCount, setStockCount] = useState(String(content.inventory.stockCount));
  const [lowStockThreshold, setLowStockThreshold] = useState(
    String(content.inventory.lowStockThreshold),
  );
  const [members, setMembers] = useState(innerCircle);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const approvedTestimonials = useMemo(
    () => cmsContent.testimonials.items.filter((item) => item.approved).length,
    [cmsContent.testimonials.items],
  );

  async function request<T>(url: string, init: RequestInit) {
    setErrorMessage(null);
    setStatusMessage(null);
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
    const payload = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !payload.data) {
      setErrorMessage(payload.error?.message ?? "Admin action failed.");
      return null;
    }

    setStatusMessage("Changes saved.");
    return payload.data;
  }

  async function saveJsonContent() {
    let parsed: ElixirContent;

    try {
      parsed = JSON.parse(contentJson) as ElixirContent;
    } catch {
      setErrorMessage("Content JSON is invalid.");
      return;
    }

    const payload = await request<{ content: ElixirContent }>("/api/admin/content", {
      body: JSON.stringify({ content: parsed }),
      method: "PATCH",
    });

    if (payload) {
      setCmsContent(payload.content);
      setContentJson(getJson(payload.content));
    }
  }

  async function saveStock() {
    const payload = await request<{ content: ElixirContent }>("/api/admin/content/stock", {
      body: JSON.stringify({
        lowStockThreshold: Number(lowStockThreshold),
        stockCount: Number(stockCount),
      }),
      method: "PATCH",
    });

    if (payload) {
      setCmsContent(payload.content);
      setContentJson(getJson(payload.content));
    }
  }

  async function toggleTestimonial(index: number, approved: boolean) {
    const payload = await request<{ content: ElixirContent }>("/api/admin/content/testimonials", {
      body: JSON.stringify({ approved, index }),
      method: "PATCH",
    });

    if (payload) {
      setCmsContent(payload.content);
      setContentJson(getJson(payload.content));
    }
  }

  async function saveImage(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const response = await request<{ content: ElixirContent }>("/api/admin/content/images", {
      body: JSON.stringify({
        altEn: payload.altEn,
        altFr: payload.altFr,
        height: Number(payload.height),
        index: Number(payload.index),
        kind: payload.kind,
        pairIndex: payload.pairIndex === "" ? undefined : Number(payload.pairIndex),
        src: payload.src,
        width: Number(payload.width),
      }),
      method: "PATCH",
    });

    if (response) {
      setCmsContent(response.content);
      setContentJson(getJson(response.content));
    }
  }

  async function addMember(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const response = await request<{
      member: AdminDashboardProps["innerCircle"][number];
    }>("/api/admin/inner-circle", {
      body: JSON.stringify(payload),
      method: "POST",
    });

    if (response) {
      setMembers((current) => [response.member, ...current]);
    }
  }

  async function updateMemberStatus(id: string, status: "active" | "paused" | "cancelled") {
    const response = await request<{
      member: AdminDashboardProps["innerCircle"][number];
    }>(`/api/admin/inner-circle/${id}`, {
      body: JSON.stringify({ status }),
      method: "PATCH",
    });

    if (response) {
      setMembers((current) =>
        current.map((member) => (member.id === id ? response.member : member)),
      );
    }
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Orders", value: analytics.ordersCount },
          { label: "Payment pending", value: analytics.paymentPendingCount },
          { label: "Consultations", value: analytics.hairConsultationsCount },
          { label: "High risk", value: analytics.highRiskConsultationsCount },
          { label: "Stock", value: analytics.stockCount },
        ].map((item) => (
          <Card key={item.label} variant="elevated">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {item.label}
            </p>
            <p className="mt-4 font-mono text-3xl">{item.value}</p>
          </Card>
        ))}
      </div>

      {statusMessage ? (
        <p className="rounded-md border border-success/30 bg-success-muted p-3 text-sm text-success">
          {statusMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="rounded-md border border-destructive/30 bg-destructive-muted p-3 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}

      <Tabs defaultValue="content">
        <TabsList className="flex w-full flex-wrap justify-start">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="inner-circle">Inner Circle</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card variant="elevated">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Website content</h2>
                <p className="mt-2 text-sm text-foreground/62">
                  Edit the CMS JSON for hero copy, price, FAQ, guarantee, founder story, Mobile
                  Money, launch announcement, and social links.
                </p>
              </div>
              <Button
                leadingIcon={<Save className="h-4 w-4" />}
                onClick={() => void saveJsonContent()}
              >
                Save content
              </Button>
            </div>
            <Textarea
              className="mt-5 min-h-[32rem] font-mono text-xs"
              value={contentJson}
              onChange={(event) => setContentJson(event.target.value)}
            />
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
            <Card variant="elevated">
              <h2 className="text-xl font-semibold">Product images</h2>
              <div className="mt-5 grid gap-3">
                {cmsContent.images.map((image, index) => (
                  <div
                    className="rounded-md border border-border p-4"
                    key={`${image.src}-${index}`}
                  >
                    <p className="font-semibold">Image {index + 1}</p>
                    <p className="mt-1 break-all text-xs text-foreground/58">{image.src}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card variant="elevated">
              <h2 className="text-xl font-semibold">Update image URL</h2>
              <form action={(formData) => void saveImage(formData)} className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Kind" required>
                    <select
                      className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
                      name="kind"
                    >
                      <option value="product">Product</option>
                      <option value="before">Before photo</option>
                      <option value="after">After photo</option>
                      <option value="founder">Founder</option>
                    </select>
                  </Field>
                  <Field label="Index" required>
                    <Input defaultValue="0" inputMode="numeric" name="index" />
                  </Field>
                  <Field label="Pair index">
                    <Input defaultValue="0" inputMode="numeric" name="pairIndex" />
                  </Field>
                </div>
                <Field label="Image URL" required>
                  <Input name="src" type="url" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Alt EN" required>
                    <Input name="altEn" />
                  </Field>
                  <Field label="Alt FR" required>
                    <Input name="altFr" />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Width" required>
                    <Input defaultValue="1200" inputMode="numeric" name="width" />
                  </Field>
                  <Field label="Height" required>
                    <Input defaultValue="1600" inputMode="numeric" name="height" />
                  </Field>
                </div>
                <Button leadingIcon={<ImageIcon className="h-4 w-4" />} type="submit">
                  Save image
                </Button>
              </form>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <AdminOrdersTable orders={orders} />
        </TabsContent>

        <TabsContent value="consultations">
          <Card variant="elevated">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-accent" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-semibold">Hair consultations</h2>
                <p className="mt-1 text-sm text-foreground/62">
                  AI-guided diagnosis leads, risk level, and WhatsApp follow-up status.
                </p>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-foreground/52">
                  <tr>
                    <th className="py-3 pr-4 font-semibold">Customer</th>
                    <th className="py-3 pr-4 font-semibold">Main issue</th>
                    <th className="py-3 pr-4 font-semibold">Risk</th>
                    <th className="py-3 pr-4 font-semibold">WhatsApp</th>
                    <th className="py-3 pr-4 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {consultations.map((consultation) => (
                    <tr key={consultation.id}>
                      <td className="py-4 pr-4">
                        <p className="font-semibold">{consultation.customer_name}</p>
                        <p className="mt-1 text-xs text-foreground/58">{consultation.phone}</p>
                        {consultation.email ? (
                          <p className="mt-1 text-xs text-foreground/58">{consultation.email}</p>
                        ) : null}
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-medium">{consultation.recommendation.mainIssue}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-foreground/58">
                          {consultation.recommendation.hairProfile}
                        </p>
                      </td>
                      <td className="py-4 pr-4">
                        <Badge
                          tone={
                            consultation.risk_level === "high"
                              ? "danger"
                              : consultation.risk_level === "medium"
                                ? "warning"
                                : "success"
                          }
                        >
                          {consultation.risk_level}
                        </Badge>
                      </td>
                      <td className="py-4 pr-4">
                        <Badge
                          tone={
                            consultation.whatsapp_followup_status === "clicked"
                              ? "success"
                              : "neutral"
                          }
                        >
                          {consultation.whatsapp_followup_status}
                        </Badge>
                      </td>
                      <td className="py-4 pr-4 text-xs text-foreground/58">
                        {new Date(consultation.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials">
          <div className="grid gap-4 lg:grid-cols-3">
            {cmsContent.testimonials.items.map((testimonial, index) => (
              <Card key={`${testimonial.name}-${index}`} variant="elevated">
                <Badge tone={testimonial.approved ? "success" : "warning"}>
                  {testimonial.approved ? "Approved" : "Hidden"}
                </Badge>
                <p className="mt-5 font-semibold">{testimonial.name}</p>
                <p className="mt-3 text-sm leading-6 text-foreground/68">{testimonial.quote.en}</p>
                <Button
                  className="mt-5"
                  onClick={() => void toggleTestimonial(index, !testimonial.approved)}
                  size="sm"
                  variant="secondary"
                >
                  {testimonial.approved ? "Hide" : "Approve"}
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stock">
          <Card className="max-w-xl" variant="elevated">
            <h2 className="text-xl font-semibold">Stock count</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Stock count" required>
                <Input
                  inputMode="numeric"
                  value={stockCount}
                  onChange={(event) => setStockCount(event.target.value)}
                />
              </Field>
              <Field label="Low-stock threshold" required>
                <Input
                  inputMode="numeric"
                  value={lowStockThreshold}
                  onChange={(event) => setLowStockThreshold(event.target.value)}
                />
              </Field>
            </div>
            <Button className="mt-5" onClick={() => void saveStock()}>
              Update stock
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="inner-circle">
          <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <Card variant="elevated">
              <h2 className="text-xl font-semibold">Add member</h2>
              <form action={(formData) => void addMember(formData)} className="mt-5 grid gap-4">
                <Field label="Full name" required>
                  <Input name="full_name" />
                </Field>
                <Field label="Phone" required>
                  <Input name="phone" />
                </Field>
                <Field label="Email">
                  <Input name="email" type="email" />
                </Field>
                <Field label="City">
                  <Input name="city" />
                </Field>
                <Field label="Notes">
                  <Textarea name="notes" />
                </Field>
                <Button type="submit">Add member</Button>
              </form>
            </Card>
            <Card variant="elevated">
              <h2 className="text-xl font-semibold">Members</h2>
              <div className="mt-5 grid gap-3">
                {members.map((member) => (
                  <div className="rounded-md border border-border p-4" key={member.id}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold">{member.full_name}</p>
                        <p className="mt-1 text-sm text-foreground/58">{member.phone}</p>
                        <p className="mt-1 text-sm text-foreground/58">{member.email}</p>
                      </div>
                      <Badge tone={member.status === "active" ? "success" : "warning"}>
                        {member.status}
                      </Badge>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(["active", "paused", "cancelled"] as const).map((status) => (
                        <Button
                          key={status}
                          onClick={() => void updateMemberStatus(member.id, status)}
                          size="sm"
                          variant="secondary"
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <Card variant="elevated">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Customer export</h2>
                <p className="mt-2 text-sm text-foreground/62">
                  Export order customers and Inner Circle members as a CSV.
                </p>
              </div>
              <a
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-semibold text-background"
                href="/api/admin/customers/export"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Export CSV
              </a>
            </div>
            <div className="mt-6 grid gap-3">
              {newsletter.map((signup) => (
                <div className="rounded-md border border-border p-3" key={signup.email}>
                  <p className="font-medium">{signup.email}</p>
                  <p className="mt-1 text-xs text-foreground/56">
                    {signup.source ?? "newsletter"} · {new Date(signup.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card variant="elevated">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="text-xl font-semibold">Basic analytics</h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md bg-surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Approved testimonials
                </p>
                <p className="mt-3 font-mono text-2xl">{approvedTestimonials}</p>
              </div>
              <div className="rounded-md bg-surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Newsletter leads
                </p>
                <p className="mt-3 font-mono text-2xl">{newsletter.length}</p>
              </div>
              <div className="rounded-md bg-surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Inner Circle
                </p>
                <p className="mt-3 font-mono text-2xl">{members.length}</p>
              </div>
              <div className="rounded-md bg-surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Product images
                </p>
                <p className="mt-3 font-mono text-2xl">{cmsContent.images.length}</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
