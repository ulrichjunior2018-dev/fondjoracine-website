import { AppError } from "@/lib/errors/app-error";

import { mtnMomoProvider } from "./providers/mtn-momo";
import { orangeMoneyProvider } from "./providers/orange-money";
import { stripeProvider } from "./providers/stripe-provider";
import { whatsappProvider } from "./providers/whatsapp";
import type { PaymentMethod, PaymentMethodOption, PaymentProviderDescriptor } from "./types";

/**
 * Single source of truth for payment providers. Checkout and order code resolve
 * a provider here and read its capability descriptor — they never hardcode a
 * provider name. To add a provider: create a descriptor module and register it.
 */
const providers: readonly PaymentProviderDescriptor[] = [
  whatsappProvider,
  mtnMomoProvider,
  orangeMoneyProvider,
  stripeProvider,
];

export function getPaymentProvider(method: PaymentMethod): PaymentProviderDescriptor {
  const provider = providers.find((candidate) => candidate.method === method);

  if (!provider) {
    throw new AppError("BAD_REQUEST", `Unsupported payment method: ${method}.`);
  }

  return provider;
}

export function listPaymentProviders(): readonly PaymentProviderDescriptor[] {
  return providers;
}

/** Client-safe list of currently configured payment methods. */
export function listAvailablePaymentMethods(): PaymentMethodOption[] {
  return providers
    .filter((provider) => provider.isConfigured())
    .map((provider) => ({
      method: provider.method,
      kind: provider.kind,
      label: provider.defaultLabel,
      requiresTransactionReference: provider.requiresTransactionReference,
      configured: true,
    }));
}

const checkoutPreviewMethods: PaymentMethod[] = ["stripe", "mtn_momo", "orange_money"];

/**
 * Checkout UI methods — always returns Card + MTN + Orange so the page is
 * viewable before env keys are set. MTN/Orange stay `configured: false`
 * (Soon) until a Mobile Money adapter sets `isConfigured` to true.
 */
export function listCheckoutPaymentMethods(): PaymentMethodOption[] {
  return checkoutPreviewMethods.map((method) => {
    const provider = getPaymentProvider(method);
    const configured = provider.isConfigured();

    return {
      method: provider.method,
      kind: provider.kind,
      label: provider.defaultLabel,
      requiresTransactionReference: provider.requiresTransactionReference,
      configured,
    };
  });
}
