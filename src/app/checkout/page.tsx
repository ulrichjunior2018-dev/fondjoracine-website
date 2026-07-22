import type { Metadata } from "next";
import { Suspense } from "react";

import { PageLoader } from "@/components/ui/page-loader";
import { CheckoutShell } from "@/features/commerce/components/checkout-shell";
import { getPrimaryElixirImage, t } from "@/features/elixir/data/content";
import { getElixirContent } from "@/features/elixir/lib/cms";
import { getCurrentUser } from "@/lib/auth/session";
import { config } from "@/lib/config";
import { getServerLocale } from "@/lib/locale-server";
import { listCheckoutPaymentMethods } from "@/lib/payments/registry";
import { buildShareMetadata } from "@/lib/seo/share-metadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCheckoutAccountPrefill } from "@/services/customer/customer-service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const title = locale === "fr" ? "Paiement | Maison Fondjo" : "Checkout | Maison Fondjo";
  const description =
    locale === "fr"
      ? "Finalisez votre commande Sève Racine : carte, MTN MoMo ou Orange Money."
      : "Complete your Sève Racine order with card, MTN MoMo, or Orange Money.";

  return {
    title,
    description,
    ...buildShareMetadata({ description, title }),
  };
}

export default async function CheckoutPage() {
  const locale = await getServerLocale();
  const content = await getElixirContent();
  const image = getPrimaryElixirImage(content);
  const paymentMethods = listCheckoutPaymentMethods();
  const priceXaf =
    Number.parseInt(content.product.priceXaf.replace(/[^\d]/g, ""), 10) ||
    config.pricing.seveRacine;

  let accountPrefill: Awaited<ReturnType<typeof getCheckoutAccountPrefill>> = null;
  const user = await getCurrentUser();
  if (user) {
    try {
      const supabase = await createSupabaseServerClient();
      accountPrefill = await getCheckoutAccountPrefill(supabase, user.id);
    } catch {
      accountPrefill = null;
    }
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-svh lg:grid lg:grid-cols-2">
          <PageLoader className="min-h-[45svh] lg:min-h-svh" label="Checkout" tone="dark" />
          <PageLoader className="min-h-[45svh] lg:min-h-svh" label="Payment" tone="light" />
        </div>
      }
    >
      <CheckoutShell
        accountPrefill={accountPrefill}
        locale={locale}
        paymentMethods={paymentMethods}
        productImageAlt={t(image.alt, locale)}
        productImageSrc={image.src.startsWith("/images/") ? image.src : "/images/studio.png"}
        productName={t(content.product.name, locale)}
        productPriceXaf={priceXaf}
      />
    </Suspense>
  );
}
