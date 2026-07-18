import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type CardVariant = "default" | "elevated" | "muted";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

function getCardVariantClassName(variant: CardVariant) {
  switch (variant) {
    case "elevated":
      return "border-border bg-surface-elevated shadow-soft";
    case "muted":
      return "border-transparent bg-surface-muted";
    case "default":
      return "border-border bg-surface";
  }
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <section
      className={cn(
        "min-w-0 max-w-full rounded-lg border p-5 sm:p-6",
        getCardVariantClassName(variant),
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-5 flex flex-col gap-1.5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold leading-7 text-foreground", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-6 text-foreground/68", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm leading-6 text-foreground", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex flex-wrap items-center gap-3", className)} {...props} />;
}
