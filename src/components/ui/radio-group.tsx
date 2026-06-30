"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useId } from "react";

import { cn } from "@/lib/utils/cn";

export function RadioGroup({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} />;
}

type RadioItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
  description?: string;
  label: ReactNode;
};

export function RadioItem({ className, description, label, ...props }: RadioItemProps) {
  const labelId = useId();

  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-surface p-3 transition-colors hover:bg-surface-muted has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
      <RadioGroupPrimitive.Item
        aria-labelledby={labelId}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-accent shadow-sm",
          "data-[state=checked]:border-accent",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          className,
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="h-2.5 w-2.5 rounded-full bg-accent" />
      </RadioGroupPrimitive.Item>
      <span className="grid gap-0.5">
        <span className="text-sm font-medium leading-6 text-foreground" id={labelId}>
          {label}
        </span>
        {description ? (
          <span className="text-xs leading-5 text-foreground/62">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
