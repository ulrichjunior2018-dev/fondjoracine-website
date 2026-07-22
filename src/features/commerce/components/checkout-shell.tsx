"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import { PaymentMethodMark } from "@/components/payment-method-marks";
import { Field, Input, Textarea } from "@/components/ui/input";
import {
  createOneProductOrderSchema,
  type OneProductPaymentMethod,
} from "@/domain/commerce/schemas";
import type { Locale } from "@/features/elixir/data/content";
import { getDictionary } from "@/i18n/dictionaries";
import { buildWaLink, formatXaf } from "@/lib/config";
import type { PaymentMethodOption } from "@/lib/payments/types";
import { siteImages } from "@/lib/site-images";
import { cn } from "@/lib/utils/cn";

type CheckoutShellProps = {
  locale: Locale;
  paymentMethods: PaymentMethodOption[];
  productName: string;
  productPriceXaf: number;
  productImageSrc: string;
  productImageAlt: string;
  /** Prefill from Account → Addresses / profile when signed in. */
  accountPrefill?: {
    city: string;
    deliveryAddress: string;
    email: string;
    name: string;
    phone: string;
  } | null;
};

type OrderFormValues = z.input<typeof createOneProductOrderSchema>;

type ApiOrderResponse = {
  data?: {
    checkoutUrl?: string;
    confirmationUrl: string;
  };
  error?: { message: string };
};

const CHECKOUT_METHODS: OneProductPaymentMethod[] = ["stripe", "mtn_momo", "orange_money"];

function methodHint(
  method: OneProductPaymentMethod,
  _kind: PaymentMethodOption["kind"],
  copy: ReturnType<typeof getDictionary>["checkoutPage"],
) {
  if (method === "stripe") return copy.cardSecureHint;
  if (method === "mtn_momo") return copy.mtnHint;
  return copy.orangeHint;
}

function methodLabel(
  method: OneProductPaymentMethod,
  copy: ReturnType<typeof getDictionary>["checkoutPage"],
) {
  if (method === "stripe") return copy.tabCard;
  if (method === "mtn_momo") return copy.tabMtn;
  return copy.tabOrange;
}

function ProductThumb({ alt, src, className }: { alt: string; src: string; className?: string }) {
  // Prefer the requested studio shot; cream mat keeps dark photos readable on the dark panel.
  const fallbacks = [
    src,
    siteImages.studioBottle,
    siteImages.frontLabel,
    siteImages.volcanicBottle,
  ].filter((value, index, list) => Boolean(value) && list.indexOf(value) === index);

  const [index, setIndex] = useState(0);
  const current = fallbacks[Math.min(index, fallbacks.length - 1)] ?? siteImages.frontLabel;
  const showFallbackMark = index >= fallbacks.length;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md border border-[#B8935A]/40 bg-[#F7F2E8]",
        className,
      )}
    >
      {!showFallbackMark ? (
        // Native img with static size — avoid absolute fill (collapses under global max-width rules on some mobile browsers)
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={alt}
          className="h-full w-full max-w-none object-cover object-center"
          src={current}
          onError={() => setIndex((value) => value + 1)}
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-[#F7F2E8]">
          <span className="font-serif text-2xl text-[#B8935A]">SR</span>
        </div>
      )}
    </div>
  );
}

export function CheckoutShell({
  locale,
  paymentMethods,
  productName,
  productPriceXaf,
  productImageSrc,
  productImageAlt,
  accountPrefill = null,
}: CheckoutShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copy = getDictionary(locale).checkoutPage;
  const orderCopy = getDictionary(locale).orderFlow;
  const cancelled = searchParams.get("status") === "cancelled";

  const available = useMemo(
    () =>
      paymentMethods.filter((method) =>
        CHECKOUT_METHODS.includes(method.method as OneProductPaymentMethod),
      ),
    [paymentMethods],
  );

  const defaultMethod =
    available.find((method) => method.method === "stripe" && method.configured)?.method ??
    available.find((method) => method.configured)?.method ??
    available[0]?.method ??
    "stripe";
  const [agreed, setAgreed] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OrderFormValues>({
    defaultValues: {
      city: accountPrefill?.city ?? "",
      company: "",
      delivery_address: accountPrefill?.deliveryAddress ?? "",
      email: accountPrefill?.email ?? "",
      locale,
      name: accountPrefill?.name ?? "",
      payment_method: defaultMethod,
      phone: accountPrefill?.phone ?? "",
      quantity: 1,
      transaction_reference: "",
    },
    resolver: zodResolver(createOneProductOrderSchema),
  });

  const quantity = useWatch({ control: form.control, name: "quantity" }) || 1;
  const paymentMethod = useWatch({ control: form.control, name: "payment_method" });
  const selected = available.find((method) => method.method === paymentMethod) ?? available[0];
  const subtotal = productPriceXaf * quantity;
  const whatsappUrl = buildWaLink("order", "", locale);
  const anyConfigured = available.some((method) => method.configured);
  const submitLabel =
    selected?.kind === "redirect" && selected.configured ? copy.continueToPay : copy.submitPayment;

  const fieldClass =
    "h-11 rounded-md border-0 bg-[#0B0B0B]/[0.04] px-3 text-[16px] text-[#0B0B0B] shadow-none caret-[#0B0B0B] placeholder:text-[#0B0B0B]/35 hover:border-0 hover:bg-[#0B0B0B]/[0.06] focus:border-0 focus:bg-[#0B0B0B]/[0.06] focus:outline-none focus:ring-0 focus:ring-offset-0 sm:text-sm";
  const areaClass =
    "rounded-md border-0 bg-[#0B0B0B]/[0.04] px-3 py-2.5 text-[16px] text-[#0B0B0B] shadow-none caret-[#0B0B0B] placeholder:text-[#0B0B0B]/35 hover:border-0 hover:bg-[#0B0B0B]/[0.06] focus:border-0 focus:bg-[#0B0B0B]/[0.06] focus:outline-none focus:ring-0 focus:ring-offset-0 sm:text-sm";
  const labelClass = "text-[#0B0B0B]";

  async function onSubmit(values: OrderFormValues) {
    if (!agreed) {
      setServerError(
        locale === "fr"
          ? "Acceptez les conditions pour continuer."
          : "Please accept the terms to continue.",
      );
      return;
    }

    if (!selected?.configured) {
      setServerError(copy.methodNotReady);
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/elixir/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as ApiOrderResponse;

      if (!response.ok || !payload.data) {
        throw new Error(payload.error?.message || orderCopy.errorCreateOrder);
      }

      if (payload.data.checkoutUrl) {
        window.location.assign(payload.data.checkoutUrl);
        return;
      }

      router.push(payload.data.confirmationUrl as never);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : orderCopy.errorCreateOrder);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-svh max-h-svh flex-col overflow-hidden bg-[#0B0B0B] text-[#F5EFE3] lg:grid lg:grid-cols-2">
      {/* ===== Product summary — stuck at top on mobile, left pane on desktop ===== */}
      <section className="relative z-20 shrink-0 border-b border-white/10 bg-[#0B0B0B] px-4 pb-3 pt-3 sm:px-6 lg:flex lg:h-full lg:flex-col lg:overflow-y-auto lg:overscroll-contain lg:border-b-0 lg:px-10 lg:pb-10 lg:pt-7 xl:px-14">
        <div className="mb-3 flex items-center justify-between gap-3 lg:mb-8">
          <Link
            aria-label={copy.closeAria}
            className="grid size-9 place-items-center rounded-full border border-white/15 text-[#F5EFE3]/80 sm:size-10"
            href={"/products/seve-racine" as never}
          >
            <X className="size-4" aria-hidden="true" />
          </Link>
          <span className="rounded-full border border-[#B8935A]/35 px-2.5 py-0.5 font-mono text-[0.65rem] tracking-[0.14em] text-[#B8935A] sm:text-xs">
            {copy.currency}
          </span>
        </div>

        <h1 className="font-serif text-[1.45rem] font-light leading-tight sm:text-4xl lg:text-5xl">
          {copy.title}
        </h1>

        {cancelled ? (
          <p className="mt-3 rounded-md border border-[#B8935A]/30 bg-[#B8935A]/10 px-3 py-2 text-xs text-[#F5EFE3]/85 sm:text-sm">
            {copy.cancelledNotice}
          </p>
        ) : null}

        {/* Product row — light image mat so dark studio shots stay visible on mobile */}
        <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-lg border border-[#B8935A]/25 bg-white/[0.04] p-3 sm:mt-7 sm:gap-4 sm:p-4">
          <ProductThumb
            alt={productImageAlt}
            className="h-[4.5rem] w-[4.5rem] sm:h-28 sm:w-28 lg:h-32 lg:w-32"
            src={productImageSrc || siteImages.studioBottle}
          />
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[0.95rem] font-semibold leading-snug text-[#F5EFE3] sm:text-base">
                  {productName}
                </p>
                <p className="mt-1 text-xs text-[#F5EFE3]/70 sm:text-sm">{copy.productSize}</p>
              </div>
              <p className="shrink-0 font-mono text-sm text-[#B8935A] sm:text-base">
                {formatXaf(productPriceXaf)}
              </p>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              <span className="text-[0.7rem] uppercase tracking-[0.12em] text-[#F5EFE3]/70">
                {copy.quantity}
              </span>
              <div className="inline-flex items-center rounded-full border border-[#B8935A]/55 bg-[#1a1814] p-1">
                <button
                  aria-label="Decrease quantity"
                  className="grid size-9 place-items-center rounded-full text-[#F5EFE3] hover:bg-white/10 active:scale-95 sm:size-10"
                  onClick={() =>
                    form.setValue("quantity", Math.max(1, quantity - 1), { shouldValidate: true })
                  }
                  type="button"
                >
                  <Minus aria-hidden="true" className="size-5 text-[#F5EFE3]" strokeWidth={2.5} />
                </button>
                <span className="min-w-9 text-center text-base font-semibold tabular-nums text-[#F5EFE3]">
                  {quantity}
                </span>
                <button
                  aria-label="Increase quantity"
                  className="grid size-9 place-items-center rounded-full text-[#F5EFE3] hover:bg-white/10 active:scale-95 sm:size-10"
                  onClick={() =>
                    form.setValue("quantity", Math.min(6, quantity + 1), { shouldValidate: true })
                  }
                  type="button"
                >
                  <Plus aria-hidden="true" className="size-5 text-[#F5EFE3]" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-3 hidden space-y-2 text-xs sm:mt-5 sm:block sm:text-sm lg:mt-auto lg:space-y-3 lg:pt-8">
          <div className="flex justify-between text-[#F5EFE3]/70">
            <dt>{copy.subtotal}</dt>
            <dd className="font-mono text-[#F5EFE3]">{formatXaf(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-[#F5EFE3]/70">
            <dt>{copy.shipping}</dt>
            <dd className="max-w-[60%] truncate text-right">{copy.shippingNote}</dd>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-sm sm:text-base">
            <dt className="font-medium">{copy.total}</dt>
            <dd className="font-mono text-lg text-[#B8935A]">{formatXaf(subtotal)}</dd>
          </div>
        </dl>
      </section>

      {/* ===== Info / payment — scrolls under the sticky product on mobile ===== */}
      <section className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#F7F2E8] text-[#0B0B0B] lg:h-full">
        <div className="mx-auto w-full max-w-lg px-4 pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-5 sm:max-w-xl sm:px-6 sm:pb-10 lg:mx-0 lg:max-w-none lg:px-10 lg:pb-10 lg:pt-8 xl:px-14">
          <form
            className="grid gap-4 sm:gap-5"
            id="maison-fondjo-checkout"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Payment methods FIRST in the cream panel — easy to find on mobile */}
            <div>
              <div className="mb-4">
                <h2 className="font-serif text-2xl font-light tracking-tight text-[#0B0B0B] sm:text-[1.75rem]">
                  {copy.paymentMethodsHeading}
                </h2>
                <p className="mt-2 max-w-prose text-sm leading-6 text-[#0B0B0B]/65">
                  {copy.paymentMethodsIntro}
                </p>
              </div>

              <div
                className="flex w-full border-b border-[#0B0B0B]/12"
                role="tablist"
                aria-label={orderCopy.choosePayment}
              >
                {available.map((method) => {
                  const active = method.method === paymentMethod;
                  const soon = method.configured === false;
                  return (
                    <button
                      aria-label={methodLabel(method.method as OneProductPaymentMethod, copy)}
                      aria-pressed={active}
                      aria-selected={active}
                      className={cn(
                        "relative flex h-12 flex-1 items-center justify-center gap-1.5 px-2 transition-opacity",
                        active ? "opacity-100" : "opacity-40 hover:opacity-70",
                        soon && "opacity-50",
                      )}
                      key={method.method}
                      onClick={() =>
                        form.setValue("payment_method", method.method, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      role="tab"
                      type="button"
                    >
                      <PaymentMethodMark method={method.method} />
                      {soon ? (
                        <span className="absolute right-1 top-1 rounded-sm bg-[#0B0B0B]/08 px-1 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-[#7b622d]">
                          {copy.soonBadge}
                        </span>
                      ) : null}
                      <span
                        className={cn(
                          "absolute inset-x-0 bottom-0 h-[2px] rounded-full",
                          active ? "bg-[#B8935A]" : "bg-transparent",
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {selected ? (
                <p className="mt-3 text-xs leading-5 text-[#0B0B0B]/62 sm:text-sm sm:leading-6">
                  {methodHint(selected.method as OneProductPaymentMethod, selected.kind, copy)}
                </p>
              ) : null}

              {!anyConfigured ? (
                <p className="mt-2 text-xs leading-5 text-[#0B0B0B]/55">{copy.previewNotice}</p>
              ) : null}
            </div>

            <div className="border-t border-[#0B0B0B]/10 pt-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#7b622d]">
                {copy.paymentDetails}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <Field
                className={labelClass}
                error={form.formState.errors.name?.message}
                label={orderCopy.fullName}
                required
              >
                <Input autoComplete="name" className={fieldClass} {...form.register("name")} />
              </Field>
              <Field
                className={labelClass}
                error={form.formState.errors.phone?.message}
                label={orderCopy.phone}
                required
              >
                <Input
                  autoComplete="tel"
                  className={fieldClass}
                  inputMode="tel"
                  {...form.register("phone")}
                />
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <Field
                className={labelClass}
                error={form.formState.errors.city?.message}
                label={orderCopy.city}
                required
              >
                <Input
                  autoComplete="address-level2"
                  className={fieldClass}
                  {...form.register("city")}
                />
              </Field>
              <Field
                className={labelClass}
                error={form.formState.errors.email?.message}
                label="Email"
              >
                <Input
                  autoComplete="email"
                  className={fieldClass}
                  inputMode="email"
                  type="email"
                  {...form.register("email")}
                />
              </Field>
            </div>

            <Field
              className={labelClass}
              error={form.formState.errors.delivery_address?.message}
              label={orderCopy.shortAddress}
              required
            >
              <Textarea
                autoComplete="street-address"
                className={cn(areaClass, "min-h-[4.25rem] sm:min-h-[5rem]")}
                placeholder={orderCopy.addressPlaceholder}
                {...form.register("delivery_address")}
              />
            </Field>

            <Field className={labelClass} label={copy.deliveryNotes}>
              <Textarea
                className={cn(areaClass, "min-h-14")}
                name="delivery_notes"
                placeholder={copy.deliveryNotesPlaceholder}
                rows={2}
              />
            </Field>

            <input className="hidden" tabIndex={-1} {...form.register("company")} />

            <label className="flex items-start gap-2.5 text-xs leading-5 text-[#0B0B0B]/75 sm:text-sm sm:leading-6">
              <input
                checked={agreed}
                className="mt-0.5 size-4 shrink-0 accent-[#B8935A]"
                onChange={(event) => setAgreed(event.target.checked)}
                type="checkbox"
              />
              <span>
                {copy.agreePrefix}{" "}
                <Link
                  className="font-medium text-[#7b622d] underline"
                  href={"/policies/terms" as never}
                >
                  {copy.agreeLink}
                </Link>{" "}
                {copy.agreeSuffix}
              </span>
            </label>

            {serverError ? (
              <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2.5 text-xs text-red-800 sm:text-sm">
                {serverError}
              </p>
            ) : null}

            <div className="hidden gap-3 sm:flex sm:flex-wrap sm:items-center">
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B8935A] px-6 text-sm font-semibold text-[#0B0B0B] disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="size-4 rounded-full border-2 border-[#0B0B0B]/35 border-t-[#0B0B0B] motion-safe:animate-spin"
                    />
                    {locale === "fr" ? "Traitement…" : "Processing…"}
                  </>
                ) : (
                  submitLabel
                )}
              </button>
              <a
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white"
                href={whatsappUrl}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                {copy.whatsappFallback}
              </a>
            </div>
          </form>
        </div>

        {/* Sticky mobile pay bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#0B0B0B]/10 bg-[#F7F2E8]/98 px-4 pt-3 shadow-[0_-8px_24px_rgb(0_0_0/.08)] backdrop-blur-md sm:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div className="min-w-0 shrink-0">
              <p className="text-[0.65rem] uppercase tracking-[0.12em] text-[#0B0B0B]/45">
                {copy.total}
              </p>
              <p className="font-mono text-base font-semibold leading-none text-[#7b622d]">
                {formatXaf(subtotal)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                aria-label={copy.whatsappFallback}
                className="grid size-11 place-items-center rounded-full bg-[#25D366] text-white"
                href={whatsappUrl}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle aria-hidden="true" className="size-5" />
              </a>
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#B8935A] px-5 text-sm font-semibold text-[#0B0B0B] disabled:opacity-60"
                disabled={isSubmitting}
                form="maison-fondjo-checkout"
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="size-3.5 rounded-full border-2 border-[#0B0B0B]/35 border-t-[#0B0B0B] motion-safe:animate-spin"
                    />
                    {locale === "fr" ? "…" : "…"}
                  </>
                ) : (
                  <span className="max-w-[9.5rem] truncate">{submitLabel}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
