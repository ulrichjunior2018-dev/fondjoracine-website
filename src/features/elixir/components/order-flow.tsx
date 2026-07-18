"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, CreditCard, MessageCircle, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { fondjoProductPricing } from "@/config/product-pricing";
import {
  createOneProductOrderSchema,
  type OneProductPaymentMethod,
} from "@/domain/commerce/schemas";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";
import { getDictionary } from "@/i18n/dictionaries";
import { buildWaLink } from "@/lib/config";
import type { PaymentMethodOption } from "@/lib/payments/types";

type OrderFlowProps = {
  content: ElixirContent;
  locale: Locale;
  /** From `listAvailablePaymentMethods()` — never hardcode methods in this UI. */
  paymentMethods: PaymentMethodOption[];
};

type OrderFormValues = z.input<typeof createOneProductOrderSchema>;

type ApiOrderResponse = {
  data?: {
    checkoutUrl?: string;
    confirmationUrl: string;
    order: {
      order_number: string;
      status: string;
    };
    paymentInstructions: {
      accountName?: string;
      heading: string;
      instructions: string;
      label: string;
      number: string;
    };
    whatsappUrl: string;
  };
  error?: {
    message: string;
  };
};

function localized(english: string, french: string): Record<Locale, string> {
  return { ["en"]: english, ["fr"]: french };
}

const paymentKindCopy: Record<
  PaymentMethodOption["kind"],
  { description: Record<Locale, string>; icon: "whatsapp" | "mobile" | "stripe" }
> = {
  external_handoff: {
    description: localized(
      "Create the order and continue with Maison Fondjo on WhatsApp.",
      "Creez la commande et continuez le diagnostic avec Maison Fondjo sur WhatsApp.",
    ),
    icon: "whatsapp",
  },
  manual_reference: {
    description: localized(
      "Pay by mobile money, then submit your transaction reference.",
      "Payez par mobile money, puis envoyez votre reference de transaction.",
    ),
    icon: "mobile",
  },
  redirect: {
    description: localized(
      "Pay by card through a secure checkout when available.",
      "Payez par carte via un paiement securise si disponible.",
    ),
    icon: "stripe",
  },
};

function getPaymentIcon(icon: "whatsapp" | "mobile" | "stripe") {
  switch (icon) {
    case "mobile":
      return <Smartphone className="h-4 w-4 text-accent" aria-hidden="true" />;
    case "stripe":
      return <CreditCard className="h-4 w-4 text-accent" aria-hidden="true" />;
    case "whatsapp":
      return <MessageCircle className="h-4 w-4 text-accent" aria-hidden="true" />;
  }
}

function getManualMethod(content: ElixirContent, method: OneProductPaymentMethod) {
  const match = method === "mtn_momo" ? "mtn" : method === "orange_money" ? "orange" : null;
  if (!match) {
    return null;
  }
  return content.manualPayments.methods.find((item) => item.label.toLowerCase().includes(match));
}

export function OrderFlow({ content, locale, paymentMethods }: OrderFlowProps) {
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<ApiOrderResponse["data"] | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [referenceMessage, setReferenceMessage] = useState<string | null>(null);
  const [isSubmittingReference, setIsSubmittingReference] = useState(false);
  const defaultMethod = paymentMethods[0]?.method ?? "whatsapp";
  const form = useForm<OrderFormValues>({
    defaultValues: {
      city: "",
      company: "",
      delivery_address: "",
      email: "",
      locale,
      name: "",
      payment_method: defaultMethod,
      phone: "",
      quantity: 1,
    },
    resolver: zodResolver(createOneProductOrderSchema),
  });
  const paymentMethod =
    useWatch({
      control: form.control,
      name: "payment_method",
    }) ?? defaultMethod;
  const selectedOption = paymentMethods.find((item) => item.method === paymentMethod);
  const selectedManualMethod = useMemo(
    () => getManualMethod(content, paymentMethod),
    [content, paymentMethod],
  );
  const isManualPayment = Boolean(selectedOption?.requiresTransactionReference);
  const displayedPrix = fondjoProductPricing.preorderDisplay;
  const o = getDictionary(locale).orderFlow;

  async function submitOrder(values: OrderFormValues) {
    setServerError(null);
    setCreatedOrder(null);

    const input = createOneProductOrderSchema.parse(values);

    const response = await fetch("/api/elixir/orders", {
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const payload = (await response.json()) as ApiOrderResponse;

    if (!response.ok || !payload.data) {
      setServerError(payload.error?.message ?? o.errorCreateOrder);
      return;
    }

    if (payload.data.checkoutUrl) {
      window.location.assign(payload.data.checkoutUrl);
      return;
    }

    setCreatedOrder(payload.data);
  }

  async function submitReference() {
    if (!createdOrder || paymentReference.trim().length < 4) {
      setServerError(o.errorValidReference);
      return;
    }

    setServerError(null);
    setReferenceMessage(null);
    setIsSubmittingReference(true);

    const token = new URL(createdOrder.confirmationUrl).searchParams.get("token");

    if (!token) {
      setServerError(o.errorInvalidLink);
      setIsSubmittingReference(false);
      return;
    }

    const response = await fetch(`/api/elixir/orders/${token}/payment-reference`, {
      body: JSON.stringify({ transaction_reference: paymentReference.trim() }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
    const payload = (await response.json()) as {
      data?: { order: { status: string } };
      error?: { message: string };
    };

    setIsSubmittingReference(false);

    if (!response.ok || !payload.data) {
      setServerError(payload.error?.message ?? o.errorSaveReference);
      return;
    }

    setCreatedOrder((current) =>
      current
        ? {
            ...current,
            order: {
              ...current.order,
              status: payload.data?.order.status ?? current.order.status,
            },
          }
        : current,
    );
    setReferenceMessage(o.referenceReceived);
  }

  return (
    <div className="grid gap-5">
      <div className="h-1 overflow-hidden rounded-full bg-[#0B0B0B]/10">
        <div
          className="h-full rounded-full bg-[#7b622d] transition-all duration-300"
          style={{ width: checkoutStep === 1 ? "50%" : "100%" }}
        />
      </div>

      <form className="grid gap-5" onSubmit={form.handleSubmit(submitOrder)}>
        {checkoutStep === 1 ? (
          <div className="grid gap-5 rounded-md border border-[#7b622d]/16 bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b622d]">
                  {o.step1}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-[#0B0B0B]">
                  {t(content.product.name, locale)}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#0B0B0B]/68">
                  {t(content.product.description, locale)}
                </p>
              </div>
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#7b622d]" aria-hidden="true" />
            </div>

            <div className="rounded-md bg-[#E4D2B4] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b622d]">
                {o.price}
              </p>
              <p className="mt-2 font-serif text-5xl font-light leading-none text-[#0B0B0B]">
                {displayedPrix}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#0B0B0B]/64">{o.priceHint}</p>
            </div>

            <div className="grid gap-3 text-sm leading-6 text-[#0B0B0B]/70 sm:grid-cols-3">
              <p className="rounded-md border border-[#7b622d]/12 p-3">{o.botanicalRitual}</p>
              <p className="rounded-md border border-[#7b622d]/12 p-3">100ml</p>
              <p className="rounded-md border border-[#7b622d]/12 p-3">{o.deliveryCameroon}</p>
            </div>

            <Button
              className="min-h-14 w-full bg-[#0B0B0B] text-[#E4D2B4] hover:bg-[#2a2113]"
              onClick={() => setCheckoutStep(2)}
              size="lg"
              trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              type="button"
            >
              {o.confirmProduct}
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 rounded-md border border-[#7b622d]/16 bg-white p-5 sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b622d]">
                {o.step2}
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[#0B0B0B]">{o.contactPayment}</h3>
              <p className="mt-2 text-sm leading-6 text-[#0B0B0B]/64">{o.contactHint}</p>
            </div>

            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <Field error={form.formState.errors.name?.message} label={o.fullName} required>
                <Input aria-label={o.fullName} autoComplete="name" {...form.register("name")} />
              </Field>
              <Field error={form.formState.errors.phone?.message} label={o.phone} required>
                <Input
                  aria-label={o.phone}
                  autoComplete="tel"
                  inputMode="tel"
                  {...form.register("phone")}
                />
              </Field>
            </div>

            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <Field error={form.formState.errors.city?.message} label={o.city} required>
                <Input
                  aria-label={o.city}
                  autoComplete="address-level2"
                  {...form.register("city")}
                />
              </Field>
              <Field error={form.formState.errors.email?.message} label="Email">
                <Input
                  aria-label="Email"
                  autoComplete="email"
                  inputMode="email"
                  type="email"
                  {...form.register("email")}
                />
              </Field>
            </div>

            <Field
              error={form.formState.errors.delivery_address?.message}
              label={o.shortAddress}
              required
            >
              <Textarea
                aria-label={o.shortAddress}
                autoComplete="street-address"
                className="min-h-24"
                placeholder={o.addressPlaceholder}
                {...form.register("delivery_address")}
              />
            </Field>
            <input
              aria-hidden="true"
              className="hidden"
              tabIndex={-1}
              {...form.register("company")}
            />

            <div className="grid gap-3">
              <p className="text-sm font-semibold text-[#0B0B0B]">{o.choosePayment}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {paymentMethods.map((option) => {
                  const selected = option.method === paymentMethod;
                  const kindUi = paymentKindCopy[option.kind];

                  return (
                    <button
                      aria-pressed={selected}
                      className={`min-h-28 rounded-md border p-4 text-left transition-colors ${
                        selected
                          ? "border-[#7b622d] bg-[#E4D2B4] text-[#0B0B0B]"
                          : "border-[#7b622d]/14 bg-white text-[#0B0B0B] hover:bg-[#f9f3e6]"
                      }`}
                      key={option.method}
                      onClick={() =>
                        form.setValue("payment_method", option.method, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      type="button"
                    >
                      <span className="flex items-center gap-2 text-base font-semibold">
                        {getPaymentIcon(kindUi.icon)}
                        {option.label}
                      </span>
                      <span className="mt-3 block text-xs leading-5 text-[#0B0B0B]/64">
                        {t(kindUi.description, locale)}
                      </span>
                    </button>
                  );
                })}
              </div>
              {isManualPayment ? (
                <p className="rounded-md bg-[#E4D2B4] p-3 text-xs leading-5 text-[#0B0B0B]/70">
                  {o.manualPayTip}
                </p>
              ) : null}
            </div>

            {serverError ? (
              <p className="rounded-md border border-destructive/30 bg-destructive-muted p-3 text-sm text-destructive">
                {serverError}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="border-[#7b622d]/20 bg-transparent text-[#0B0B0B] hover:bg-[#E4D2B4]"
                onClick={() => setCheckoutStep(1)}
                type="button"
                variant="secondary"
              >
                {o.back}
              </Button>
              <Button
                className="min-h-14 flex-1 bg-[#0B0B0B] text-[#E4D2B4] hover:bg-[#2a2113]"
                isLoading={form.formState.isSubmitting}
                size="lg"
                trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                type="submit"
              >
                {paymentMethod === "stripe" ? o.continueStripe : o.createOrder}
              </Button>
            </div>
          </div>
        )}
      </form>

      {selectedManualMethod ? (
        <div className="rounded-md border border-[#7b622d]/18 bg-[#fff8e4] p-5">
          <p className="text-sm font-semibold text-[#1C1C1C]">Mobile Money</p>
          <p className="mt-3 text-sm leading-6 text-[#1C1C1C]/80">{o.mobileMoneyNumber}</p>
          <a
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#25d366] px-4 text-sm font-semibold text-white"
            href={buildWaLink("order", "", locale)}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      ) : null}

      {createdOrder ? (
        <div className="rounded-md border border-success/30 bg-success-muted p-5 text-success">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">
                {o.orderCreated} {createdOrder.order.order_number}
              </p>
              <p className="mt-2 text-sm leading-6">
                {createdOrder.order.status === "payment_submitted"
                  ? o.orderReferenceSubmitted
                  : o.orderPendingPayment}
              </p>
              {isManualPayment && createdOrder.order.status !== "payment_submitted" ? (
                <div className="mt-4 grid gap-3 rounded-md border border-success/30 bg-background/10 p-4">
                  <Field className="text-success" label={o.transactionReference} required>
                    <Input
                      className="border-success/30 bg-background/20 text-success"
                      value={paymentReference}
                      onChange={(event) => setPaymentReference(event.target.value)}
                    />
                  </Field>
                  <Button
                    className="bg-success text-white hover:bg-success/90"
                    isLoading={isSubmittingReference}
                    onClick={() => void submitReference()}
                  >
                    {o.submitReference}
                  </Button>
                </div>
              ) : null}
              {referenceMessage ? (
                <p className="mt-3 rounded-md border border-success/30 bg-background/10 p-3 text-sm">
                  {referenceMessage}
                </p>
              ) : null}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a
                  className="inline-flex h-10 items-center justify-center rounded-md bg-success px-4 text-sm font-semibold text-white"
                  href={createdOrder.confirmationUrl}
                >
                  {o.viewConfirmation}
                </a>
                <a
                  className="inline-flex h-10 items-center justify-center rounded-md border border-success/30 px-4 text-sm font-semibold"
                  href={createdOrder.whatsappUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
