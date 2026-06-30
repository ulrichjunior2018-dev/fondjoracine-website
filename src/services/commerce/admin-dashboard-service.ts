import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  AdminContentUpdateInput,
  AdminImageUpdateInput,
  AdminStockUpdateInput,
  AdminTestimonialApprovalInput,
  InnerCircleMemberInput,
  InnerCircleStatusUpdateInput,
} from "@/domain/commerce/schemas";
import { elixirContentSchema } from "@/features/elixir/data/content-schema";
import { defaultElixirContent, type ElixirContent } from "@/features/elixir/data/content";
import { STOREFRONT_CONTENT_KEY } from "@/features/elixir/lib/cms";
import { AppError } from "@/lib/errors/app-error";

const CONTENT_KEY = STOREFRONT_CONTENT_KEY;

type StorefrontContentRow = {
  content: ElixirContent;
  id: string;
  published_at: string | null;
  status: string;
  updated_at: string;
};

function mergeContent(base: ElixirContent, overrides: Partial<ElixirContent>): ElixirContent {
  return {
    ...base,
    ...overrides,
  };
}

async function readStorefrontContent(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("storefront_content")
    .select("id, status, published_at, updated_at, content")
    .eq("key", CONTENT_KEY)
    .single<StorefrontContentRow>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to load admin CMS content.", { expose: false });
  }

  const parsed = elixirContentSchema.safeParse(mergeContent(defaultElixirContent, data.content));

  if (!parsed.success) {
    throw new AppError("BAD_REQUEST", "Published CMS content is invalid.");
  }

  return { ...data, content: parsed.data };
}

async function writeStorefrontContent(supabase: SupabaseClient, content: ElixirContent) {
  const parsed = elixirContentSchema.safeParse(content);

  if (!parsed.success) {
    throw new AppError("BAD_REQUEST", parsed.error.issues[0]?.message ?? "CMS content is invalid.");
  }

  const { data, error } = await supabase
    .from("storefront_content")
    .update({
      content: parsed.data,
      published_at: new Date().toISOString(),
      status: "published",
      updated_at: new Date().toISOString(),
    })
    .eq("key", CONTENT_KEY)
    .select("content")
    .single<{ content: ElixirContent }>();

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  return data.content;
}

export async function getAdminDashboardData(supabase: SupabaseClient) {
  const [
    content,
    { data: orders, error: ordersError },
    { data: innerCircle, error: innerCircleError },
    { data: newsletter, error: newsletterError },
    { data: consultations, error: consultationsError },
    { count: orderCount, error: orderCountError },
    { count: customerCount, error: customerCountError },
    { count: pendingOrderCount, error: pendingOrderCountError },
    { count: consultationCount, error: consultationCountError },
    { count: highRiskConsultationCount, error: highRiskConsultationCountError },
  ] = await Promise.all([
    readStorefrontContent(supabase),
    supabase
      .from("orders")
      .select(
        "id, order_number, status, currency, total_cents, customer_name, customer_phone, delivery_city, payment_method, manual_payment_reference, created_at, admin_payment_verified_at",
      )
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("inner_circle_members")
      .select("id, full_name, phone, email, city, status, started_at, notes")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("newsletter_signups")
      .select("email, source, created_at")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("hair_consultations")
      .select(
        "id, customer_name, phone, email, recommendation, risk_level, whatsapp_followup_status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending_payment", "payment_submitted"]),
    supabase.from("hair_consultations").select("id", { count: "exact", head: true }),
    supabase
      .from("hair_consultations")
      .select("id", { count: "exact", head: true })
      .eq("risk_level", "high"),
  ]);

  if (
    ordersError ||
    innerCircleError ||
    newsletterError ||
    consultationsError ||
    orderCountError ||
    customerCountError ||
    pendingOrderCountError ||
    consultationCountError ||
    highRiskConsultationCountError
  ) {
    throw new AppError("INTERNAL", "Unable to load admin dashboard.", { expose: false });
  }

  return {
    analytics: {
      customersCount: customerCount ?? 0,
      hairConsultationsCount: consultationCount ?? 0,
      highRiskConsultationsCount: highRiskConsultationCount ?? 0,
      ordersCount: orderCount ?? 0,
      paymentPendingCount: pendingOrderCount ?? 0,
      stockCount: content.content.inventory.stockCount,
    },
    content,
    consultations: consultations ?? [],
    innerCircle: innerCircle ?? [],
    newsletter: newsletter ?? [],
    orders: orders ?? [],
  };
}

export async function updateAdminContent(supabase: SupabaseClient, input: AdminContentUpdateInput) {
  const parsed = elixirContentSchema.safeParse(input.content);

  if (!parsed.success) {
    throw new AppError("BAD_REQUEST", parsed.error.issues[0]?.message ?? "CMS content is invalid.");
  }

  return writeStorefrontContent(supabase, parsed.data);
}

export async function updateAdminStock(supabase: SupabaseClient, input: AdminStockUpdateInput) {
  const row = await readStorefrontContent(supabase);
  const content = {
    ...row.content,
    inventory: {
      lowStockThreshold: input.lowStockThreshold ?? row.content.inventory.lowStockThreshold,
      stockCount: input.stockCount,
    },
  };

  return writeStorefrontContent(supabase, content);
}

export async function updateAdminImage(supabase: SupabaseClient, input: AdminImageUpdateInput) {
  const row = await readStorefrontContent(supabase);
  const image = {
    alt: {
      en: input.altEn,
      fr: input.altFr,
    },
    height: input.height,
    src: input.src,
    width: input.width,
  };
  const content = structuredClone(row.content);

  if (input.kind === "product") {
    content.images[input.index] = image;
  }

  if (input.kind === "founder") {
    content.founder.image = image;
  }

  if (input.kind === "before" || input.kind === "after") {
    const pairIndex = input.pairIndex ?? 0;
    const pair = content.beforeAfter.items.at(pairIndex);

    if (!pair) {
      throw new AppError("BAD_REQUEST", "Before/after pair does not exist.");
    }

    pair[input.kind] = image;
  }

  return writeStorefrontContent(supabase, content);
}

export async function updateAdminTestimonialApproval(
  supabase: SupabaseClient,
  input: AdminTestimonialApprovalInput,
) {
  const row = await readStorefrontContent(supabase);
  const content = structuredClone(row.content);
  const testimonial = content.testimonials.items.at(input.index);

  if (!testimonial) {
    throw new AppError("BAD_REQUEST", "Testimonial does not exist.");
  }

  testimonial.approved = input.approved;

  return writeStorefrontContent(supabase, content);
}

export async function createInnerCircleMember(
  supabase: SupabaseClient,
  input: InnerCircleMemberInput,
) {
  const { data, error } = await supabase
    .from("inner_circle_members")
    .insert({
      city: input.city || null,
      email: input.email || null,
      full_name: input.full_name,
      notes: input.notes || null,
      phone: input.phone,
      status: input.status,
    })
    .select("id, full_name, phone, email, city, status, started_at, notes")
    .single();

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  return data;
}

export async function updateInnerCircleMemberStatus(
  supabase: SupabaseClient,
  id: string,
  input: InnerCircleStatusUpdateInput,
) {
  const { data, error } = await supabase
    .from("inner_circle_members")
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, full_name, phone, email, city, status, started_at, notes")
    .single();

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  return data;
}

function escapeCsv(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);

  return `"${text.replaceAll('"', '""')}"`;
}

export async function exportCustomersCsv(supabase: SupabaseClient) {
  const [{ data: orders, error: ordersError }, { data: members, error: membersError }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("customer_name, customer_phone, email, delivery_city, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("inner_circle_members")
        .select("full_name, phone, email, city, status, created_at")
        .order("created_at", { ascending: false }),
    ]);

  if (ordersError || membersError) {
    throw new AppError("INTERNAL", "Unable to export customers.", { expose: false });
  }

  const rows = [
    ["source", "name", "phone", "email", "city", "status", "created_at"],
    ...(orders ?? []).map((order) => [
      "order",
      order.customer_name,
      order.customer_phone,
      order.email,
      order.delivery_city,
      "",
      order.created_at,
    ]),
    ...(members ?? []).map((member) => [
      "inner_circle",
      member.full_name,
      member.phone,
      member.email,
      member.city,
      member.status,
      member.created_at,
    ]),
  ];

  return rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
}
