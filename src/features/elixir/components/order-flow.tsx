"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, CreditCard, MessageCircle, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

import {
  createOneProductOrderSchema,
  type OneProductPaymentMethod,
} from "@/domain/commerce/schemas";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";

type OrderFlowProps = {
  content: ElixirContent;
  locale: Locale;
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

const paymentOptions: Array<{
  description: Record<Locale, string>;
  icon: "whatsapp" | "mobile" | "stripe";
  label: string;
  value: OneProductPaymentMethod;
}> = [
  {
    description: {
      en: "Create the order and continue the diagnosis with FONDJO on WhatsApp.",
      fr: "Creez la commande et continuez le diagnostic avec FONDJO sur WhatsApp.",
    },
    icon: "whatsapp",
    label: "WhatsApp",
    value: "whatsapp",
  },
  {
    description: {
      en: "Send payment through MTN MoMo, then submit your transaction reference.",
      fr: "Payez par MTN MoMo, puis envoyez la reference de transaction.",
    },
    icon: "mobile",
    label: "MTN MoMo",
    value: "mtn_momo",
  },
  {
    description: {
      en: "Send payment through Orange Money, then submit your transaction reference.",
      fr: "Payez par Orange Money, puis envoyez la reference de transaction.",
    },
    icon: "mobile",
    label: "Orange Money",
    value: "orange_money",
  },
  {
    description: {
      en: "Pay internationally through secure Stripe Checkout. USD now, EUR-ready later.",
      fr: "Payez a l international via Stripe Checkout securise. USD maintenant, EUR ensuite.",
    },
    icon: "stripe",
    label: "Stripe",
    value: "stripe",
  },
];

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
  if (method !== "mtn_momo" && method !== "orange_money") {
    return null;
  }

  return content.manualPayments.methods.find((item) =>
    item.label.toLowerCase().includes(method === "mtn_momo" ? "mtn" : "orange"),
  );
}

export function OrderFlow({ content, locale }: OrderFlowProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<ApiOrderResponse["data"] | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [referenceMessage, setReferenceMessage] = useState<string | null>(null);
  const [isSubmittingReference, setIsSubmittingReference] = useState(false);
  const form = useForm<OrderFormValues>({
    defaultValues: {
      city: "",
      company: "",
      delivery_address: "",
      email: "",
      locale,
      name: "",
      payment_method: "whatsapp",
      phone: "",
      quantity: 1,
    },
    resolver: zodResolver(createOneProductOrderSchema),
  });
  const paymentMethod =
    useWatch({
      control: form.control,
      name: "payment_method",
    }) ?? "whatsapp";
  const selectedManualMethod = useMemo(
    () => getManualMethod(content, paymentMethod),
    [content, paymentMethod],
  );
  const isManualPayment = paymentMethod === "mtn_momo" || paymentMethod === "orange_money";

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
      setServerError(
        payload.error?.message ??
          (locale === "fr"
            ? "Impossible de creer la commande pour le moment."
            : "Unable to create the order right now."),
      );
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
      setServerError(
        locale === "fr"
          ? "Ajoutez une reference de transaction valide."
          : "Enter a valid transaction reference.",
      );
      return;
    }

    setServerError(null);
    setReferenceMessage(null);
    setIsSubmittingReference(true);

    const token = new URL(createdOrder.confirmationUrl).searchParams.get("token");

    if (!token) {
      setServerError(
        locale === "fr" ? "Lien de confirmation invalide." : "Invalid confirmation link.",
      );
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
      setServerError(
        payload.error?.message ??
          (locale === "fr"
            ? "Impossible d enregistrer la reference."
            : "Unable to save the reference."),
      );
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
    setReferenceMessage(
      locale === "fr"
        ? "Reference recue. Votre commande attend maintenant la verification admin."
        : "Reference received. Your order is now waiting for admin verification.",
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <div className="rounded-lg border border-border bg-surface p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {locale === "fr" ? "Produit" : "Product"}
          </p>
          <h3 className="mt-3 text-2xl font-semibold">{t(content.product.name, locale)}</h3>
          <p className="mt-3 text-sm leading-6 text-foreground/68">
            {t(content.product.description, locale)}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-md bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {locale === "fr" ? "Prix local" : "Local price"}
              </p>
              <p className="mt-2 font-mono font-semibold">{content.product.priceXaf}</p>
            </div>
            <div className="rounded-md bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {locale === "fr" ? "Carte" : "Card"}
              </p>
              <p className="mt-2 font-mono font-semibold">
                ${(content.priceCents / 100).toFixed(2)} {content.currency}
              </p>
            </div>
          </div>
        </div>

        {selectedManualMethod ? (
          <div className="mt-4 rounded-lg border border-accent/28 bg-[#fff8e4] p-5">
            <p className="text-sm font-semibold text-[#1C1C1C]">{selectedManualMethod.label}</p>
            {selectedManualMethod.number ? (
              <>
                <p className="mt-3 font-mono text-lg text-[#1C1C1C]">
                  {selectedManualMethod.number}
                </p>
                <p className="mt-1 text-sm text-[#1C1C1C]/68">{selectedManualMethod.accountName}</p>
                <p className="mt-4 text-sm leading-6 text-[#1C1C1C]/72">
                  {t(selectedManualMethod.instructions, locale)}
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm leading-6 text-[#1C1C1C]/80">
                  {locale === "fr"
                    ? "Numéro fourni via WhatsApp — contactez-nous pour recevoir les détails de paiement"
                    : "Number provided via WhatsApp — message us to receive payment details"}
                </p>
                <a
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#25d366] px-4 py-2.5 text-sm font-semibold text-white"
                  href={`https://wa.me/${content.whatsapp.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    locale === "fr"
                      ? `Bonjour, je voudrais payer par ${selectedManualMethod.label} — merci de m'envoyer le numéro de paiement`
                      : `Hi, I'd like to pay via ${selectedManualMethod.label} — please send me the payment number`,
                  )}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </>
            )}
          </div>
        ) : null}

        {createdOrder ? (
          <div className="mt-4 rounded-lg border border-success/30 bg-success-muted p-5 text-success">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">
                  {locale === "fr" ? "Commande creee" : "Order created"}{" "}
                  {createdOrder.order.order_number}
                </p>
                <p className="mt-2 text-sm leading-6">
                  {locale === "fr"
                    ? "Votre commande est en attente de verification de paiement."
                    : createdOrder.order.status === "payment_submitted"
                      ? "Your reference was submitted and is waiting for admin verification."
                      : "Your order is pending payment. Send payment, then submit your transaction reference below."}
                </p>
                {isManualPayment && createdOrder.order.status !== "payment_submitted" ? (
                  <div className="mt-4 grid gap-3 rounded-md border border-success/30 bg-background/10 p-4">
                    <Field
                      className="text-success"
                      label={locale === "fr" ? "Reference de transaction" : "Transaction reference"}
                      required
                    >
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
                      {locale === "fr" ? "Soumettre la reference" : "Submit reference"}
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
                    {locale === "fr" ? "Voir la confirmation" : "View confirmation"}
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

      <form className="grid gap-5" onSubmit={form.handleSubmit(submitOrder)}>
        <div className="grid gap-4 rounded-lg border border-border bg-surface p-5 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              error={form.formState.errors.name?.message}
              label={locale === "fr" ? "Nom complet" : "Full name"}
              required
            >
              <Input autoComplete="name" {...form.register("name")} />
            </Field>
            <Field
              error={form.formState.errors.phone?.message}
              label={locale === "fr" ? "Telephone" : "Phone"}
              required
            >
              <Input autoComplete="tel" inputMode="tel" {...form.register("phone")} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              error={form.formState.errors.city?.message}
              label={locale === "fr" ? "Ville" : "City"}
              required
            >
              <Input autoComplete="address-level2" {...form.register("city")} />
            </Field>
            <Field error={form.formState.errors.email?.message} label="Email">
              <Input
                autoComplete="email"
                inputMode="email"
                type="email"
                {...form.register("email")}
              />
            </Field>
          </div>
          <Field
            error={form.formState.errors.delivery_address?.message}
            label={locale === "fr" ? "Adresse de livraison" : "Delivery address"}
            required
          >
            <Textarea autoComplete="street-address" {...form.register("delivery_address")} />
          </Field>
          <input
            aria-hidden="true"
            className="hidden"
            tabIndex={-1}
            {...form.register("company")}
          />
        </div>

        <div className="grid gap-4 rounded-lg border border-border bg-surface p-5 shadow-soft">
          <p className="text-sm font-semibold">{locale === "fr" ? "Paiement" : "Payment"}</p>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) =>
              form.setValue("payment_method", value as OneProductPaymentMethod, {
                shouldValidate: true,
              })
            }
          >
            {paymentOptions.map((option) => (
              <RadioItem
                description={locale === "fr" ? option.description.fr : option.description.en}
                key={option.value}
                label={
                  <span className="inline-flex items-center gap-2">
                    {getPaymentIcon(option.icon)}
                    {option.label}
                  </span>
                }
                value={option.value}
              />
            ))}
          </RadioGroup>
          {isManualPayment ? (
            <p className="text-xs leading-5 text-foreground/60">
              {locale === "fr"
                ? "Vous creerez d abord la commande, puis vous recevrez les instructions exactes pour envoyer le paiement et soumettre la reference."
                : "You will create the order first, then receive exact instructions to send payment and submit the transaction reference."}
            </p>
          ) : null}
        </div>

        {serverError ? (
          <p className="rounded-md border border-destructive/30 bg-destructive-muted p-3 text-sm text-destructive">
            {serverError}
          </p>
        ) : null}

        <Button
          className="w-full"
          isLoading={form.formState.isSubmitting}
          size="lg"
          trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          type="submit"
        >
          {paymentMethod === "stripe"
            ? locale === "fr"
              ? "Continuer vers Stripe"
              : "Continue to Stripe"
            : locale === "fr"
              ? "Creer la commande"
              : "Create order"}
        </Button>
      </form>
    </div>
  );
}
