import Image from "next/image";

import type { OneProductPaymentMethod } from "@/domain/commerce/schemas";
import { cn } from "@/lib/utils/cn";

/** Checkout payment marks — brand logos from `public/images/payments/`. */

const PAYMENT_LOGOS = {
  stripe: {
    src: "/images/payments/card-visa-mastercard.jpg",
    alt: "Visa and Mastercard",
    width: 120,
    height: 40,
    className: "h-7 w-auto sm:h-8",
  },
  mtn_momo: {
    src: "/images/payments/mtn-momo.jpg",
    alt: "MTN Mobile Money",
    width: 120,
    height: 48,
    className: "h-8 w-auto sm:h-9",
  },
  orange_money: {
    src: "/images/payments/orange-money.jpg",
    alt: "Orange Money",
    width: 120,
    height: 48,
    className: "h-8 w-auto sm:h-9",
  },
} as const;

type PaymentLogoMethod = keyof typeof PAYMENT_LOGOS;

function PaymentLogoMark({ method, className }: { method: PaymentLogoMethod; className?: string }) {
  const logo = PAYMENT_LOGOS[method];

  return (
    <span className={cn("inline-flex items-center justify-center", className)} aria-hidden="true">
      <Image
        alt={logo.alt}
        className={cn("object-contain", logo.className)}
        height={logo.height}
        src={logo.src}
        width={logo.width}
      />
    </span>
  );
}

export function CardBrandsMark({ className }: { className?: string }) {
  return <PaymentLogoMark method="stripe" {...(className ? { className } : {})} />;
}

export function MtnMoMoMark({ className }: { className?: string }) {
  return <PaymentLogoMark method="mtn_momo" {...(className ? { className } : {})} />;
}

export function OrangeMoneyMark({ className }: { className?: string }) {
  return <PaymentLogoMark method="orange_money" {...(className ? { className } : {})} />;
}

export function PaymentMethodMark({
  method,
  className,
}: {
  method: OneProductPaymentMethod | string;
  className?: string;
}) {
  switch (method) {
    case "stripe":
      return <CardBrandsMark {...(className ? { className } : {})} />;
    case "mtn_momo":
      return <MtnMoMoMark {...(className ? { className } : {})} />;
    case "orange_money":
      return <OrangeMoneyMark {...(className ? { className } : {})} />;
    default:
      return null;
  }
}
