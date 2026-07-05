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
import { buildWaLink } from "@/lib/config";

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

function localized(english: string, french: string): Record<Locale, string> {
  return { ["en"]: english, ["fr"]: french };
}

const paymentOptions: Array<{
  description: Record<Locale, string>;
  icon: "whatsapp" | "mobile" | "stripe";
  label: string;
  value: OneProductPaymentMethod;
}> = [
  {
    description: localized(
      "Create the order and continue with Maison Fondjo on WhatsApp.",
      "Creez la commande et continuez le diagnostic avec Maison Fondjo sur WhatsApp.",
    ),
    icon: "whatsapp",
    label: "WhatsApp",
    value: "whatsapp",
  },
  {
    description: localized(
      "Use MTN MoMo or Orange Money. The number is confirmed on WhatsApp.",
      "Utilisez MTN MoMo ou Orange Money. Le numero est confirme sur WhatsApp.",
    ),
    icon: "mobile",
    label: "Mobile Money",
    value: "mtn_momo",
  },
  {
    description: localized(
      "Pay by card through Stripe Checkout when available.",
      "Payez par carte via Stripe Checkout si disponible.",
    ),
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
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
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
  const displayedPrix = fondjoProductPricing.preorderDisplay;

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
          (locale.startsWith("fr")
            ? "Impossible de creer la commande pour le moment."
            : "Impossible de creer la commande pour le moment."),
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
        locale.startsWith("fr")
          ? "Ajoutez une reference de transaction valide."
          : "Ajoutez une reference de transaction valide.",
      );
      return;
    }

    setServerError(null);
    setReferenceMessage(null);
    setIsSubmittingReference(true);

    const token = new URL(createdOrder.confirmationUrl).searchParams.get("token");

    if (!token) {
      setServerError(
        locale.startsWith("fr")
          ? "Lien de confirmation invalide."
          : "Lien de confirmation invalide.",
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
          (locale.startsWith("fr")
            ? "Impossible d enregistrer la reference."
            : "Impossible d enregistrer la reference."),
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
      locale.startsWith("fr")
        ? "Reference recue. Votre commande attend maintenant la verification admin."
        : "Reference recue. Votre commande attend la verification admin.",
    );
  }

  return (
    <div className="grid gap-5">
      <div className="h-1 overflow-hidden rounded-full bg-[#14110b]/10">
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
                  {locale.startsWith("fr") ? "Etape 1" : "Etape 1"}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-[#14110b]">
                  {t(content.product.name, locale)}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#14110b]/68">
                  {t(content.product.description, locale)}
                </p>
              </div>
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#7b622d]" aria-hidden="true" />
            </div>

            <div className="rounded-md bg-[#f4eddf] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b622d]">
                {locale.startsWith("fr") ? "Prix" : "Prix"}
              </p>
              <p className="mt-2 font-serif text-5xl font-light leading-none text-[#14110b]">
                {displayedPrix}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#14110b]/64">
                {locale.startsWith("fr")
                  ? "Prix unique en XAF. Les details de livraison sont confirmes avant paiement."
                  : "Prix unique en XAF. Les details de livraison sont confirmes avant paiement."}
              </p>
            </div>

            <div className="grid gap-3 text-sm leading-6 text-[#14110b]/70 sm:grid-cols-3">
              <p className="rounded-md border border-[#7b622d]/12 p-3">Rituel botanique</p>
              <p className="rounded-md border border-[#7b622d]/12 p-3">100ml</p>
              <p className="rounded-md border border-[#7b622d]/12 p-3">
                {locale.startsWith("fr") ? "Livraison au Cameroun" : "Livraison au Cameroun"}
              </p>
            </div>

            <Button
              className="min-h-14 w-full bg-[#14110b] text-[#f4eddf] hover:bg-[#2a2113]"
              onClick={() => setCheckoutStep(2)}
              size="lg"
              trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              type="button"
            >
              {locale.startsWith("fr") ? "Confirmer le produit" : "Confirmer le produit"}
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 rounded-md border border-[#7b622d]/16 bg-white p-5 sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b622d]">
                {locale.startsWith("fr") ? "Etape 2" : "Etape 2"}
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[#14110b]">
                {locale.startsWith("fr") ? "Contact et paiement" : "Contact et paiement"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#14110b]/64">
                {locale.startsWith("fr")
                  ? "Gardez simple. Les details de livraison peuvent etre confirmes sur WhatsApp."
                  : "Gardez simple. Les details de livraison peuvent etre confirmes sur WhatsApp."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                error={form.formState.errors.name?.message}
                label={locale.startsWith("fr") ? "Nom complet" : "Nom complet"}
                required
              >
                <Input
                  aria-label={locale.startsWith("fr") ? "Nom complet" : "Nom complet"}
                  autoComplete="name"
                  {...form.register("name")}
                />
              </Field>
              <Field
                error={form.formState.errors.phone?.message}
                label={locale.startsWith("fr") ? "Telephone" : "Telephone"}
                required
              >
                <Input
                  aria-label={locale.startsWith("fr") ? "Telephone" : "Telephone"}
                  autoComplete="tel"
                  inputMode="tel"
                  {...form.register("phone")}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                error={form.formState.errors.city?.message}
                label={locale.startsWith("fr") ? "Ville" : "Ville"}
                required
              >
                <Input
                  aria-label={locale.startsWith("fr") ? "Ville" : "Ville"}
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
              label={locale.startsWith("fr") ? "Adresse courte" : "Adresse courte"}
              required
            >
              <Textarea
                aria-label={locale.startsWith("fr") ? "Adresse courte" : "Adresse courte"}
                autoComplete="street-address"
                className="min-h-24"
                placeholder={
                  locale.startsWith("fr")
                    ? "Quartier, repere, ville..."
                    : "Quartier, repere, ville..."
                }
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
              <p className="text-sm font-semibold text-[#14110b]">
                {locale.startsWith("fr") ? "Choisir le paiement" : "Choisir le paiement"}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {paymentOptions.map((option) => {
                  const selected = option.value === paymentMethod;

                  return (
                    <button
                      aria-pressed={selected}
                      className={`min-h-28 rounded-md border p-4 text-left transition-colors ${
                        selected
                          ? "border-[#7b622d] bg-[#f4eddf] text-[#14110b]"
                          : "border-[#7b622d]/14 bg-white text-[#14110b] hover:bg-[#f9f3e6]"
                      }`}
                      key={option.value}
                      onClick={() =>
                        form.setValue("payment_method", option.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      type="button"
                    >
                      <span className="flex items-center gap-2 text-base font-semibold">
                        {getPaymentIcon(option.icon)}
                        {option.label}
                      </span>
                      <span className="mt-3 block text-xs leading-5 text-[#14110b]/64">
                        {t(option.description, locale)}
                      </span>
                    </button>
                  );
                })}
              </div>
              {isManualPayment ? (
                <p className="rounded-md bg-[#f4eddf] p-3 text-xs leading-5 text-[#14110b]/70">
                  {locale.startsWith("fr")
                    ? "Mobile Money couvre MTN MoMo et Orange Money. Le numero de paiement est confirme sur WhatsApp."
                    : "Mobile Money couvre MTN MoMo et Orange Money. Le numero est confirme sur WhatsApp."}
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
                className="border-[#7b622d]/20 bg-transparent text-[#14110b] hover:bg-[#f4eddf]"
                onClick={() => setCheckoutStep(1)}
                type="button"
                variant="secondary"
              >
                {locale.startsWith("fr") ? "Retour" : "Retour"}
              </Button>
              <Button
                className="min-h-14 flex-1 bg-[#14110b] text-[#f4eddf] hover:bg-[#2a2113]"
                isLoading={form.formState.isSubmitting}
                size="lg"
                trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                type="submit"
              >
                {paymentMethod === "stripe"
                  ? locale.startsWith("fr")
                    ? "Continuer vers Stripe"
                    : "Continuer vers Stripe"
                  : locale.startsWith("fr")
                    ? "Creer la commande"
                    : "Creer la commande"}
              </Button>
            </div>
          </div>
        )}
      </form>

      {selectedManualMethod ? (
        <div className="rounded-md border border-[#7b622d]/18 bg-[#fff8e4] p-5">
          <p className="text-sm font-semibold text-[#1C1C1C]">Mobile Money</p>
          <p className="mt-3 text-sm leading-6 text-[#1C1C1C]/80">
            {locale.startsWith("fr")
              ? "Numero fourni via WhatsApp pour eviter les erreurs de paiement."
              : "Numero fourni via WhatsApp pour eviter les erreurs de paiement."}
          </p>
          <a
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#25d366] px-4 text-sm font-semibold text-white"
            href={buildWaLink("order")}
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
                {locale.startsWith("fr") ? "Commande creee" : "Commande creee"}{" "}
                {createdOrder.order.order_number}
              </p>
              <p className="mt-2 text-sm leading-6">
                {locale.startsWith("fr")
                  ? "Votre commande est en attente de verification de paiement."
                  : createdOrder.order.status === "payment_submitted"
                    ? "Votre reference a ete soumise et attend la verification admin."
                    : "Votre commande attend le paiement. Envoyez le paiement, puis ajoutez la reference de transaction."}
              </p>
              {isManualPayment && createdOrder.order.status !== "payment_submitted" ? (
                <div className="mt-4 grid gap-3 rounded-md border border-success/30 bg-background/10 p-4">
                  <Field
                    className="text-success"
                    label={
                      locale.startsWith("fr")
                        ? "Reference de transaction"
                        : "Reference de transaction"
                    }
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
                    {locale.startsWith("fr") ? "Soumettre la reference" : "Soumettre la reference"}
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
                  {locale.startsWith("fr") ? "Voir la confirmation" : "Voir la confirmation"}
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
