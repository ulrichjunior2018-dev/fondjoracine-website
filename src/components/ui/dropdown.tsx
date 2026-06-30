"use client";

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

export const Dropdown = DropdownPrimitive.Root;
export const DropdownTrigger = DropdownPrimitive.Trigger;
export const DropdownGroup = DropdownPrimitive.Group;
export const DropdownPortal = DropdownPrimitive.Portal;
export const DropdownRadioGroup = DropdownPrimitive.RadioGroup;

export function DropdownContent({
  align = "end",
  className,
  sideOffset = 8,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        align={align}
        className={cn(
          "z-50 min-w-52 rounded-lg border border-border bg-surface-elevated p-1.5 text-sm text-foreground shadow-lifted outline-none",
          "data-[state=open]:animate-enter data-[state=closed]:animate-exit",
          className,
        )}
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownPrimitive.Portal>
  );
}

export function DropdownItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownPrimitive.Item>) {
  return (
    <DropdownPrimitive.Item
      className={cn(
        "relative flex h-9 cursor-default select-none items-center gap-2 rounded-md px-2.5 outline-none transition-colors",
        "focus:bg-surface-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownCheckboxItem({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownPrimitive.CheckboxItem>) {
  return (
    <DropdownPrimitive.CheckboxItem
      className={cn(
        "relative flex h-9 cursor-default select-none items-center gap-2 rounded-md py-2 pl-8 pr-2.5 outline-none transition-colors",
        "focus:bg-surface-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <DropdownPrimitive.ItemIndicator>
          <Check aria-hidden="true" className="h-3.5 w-3.5" />
        </DropdownPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownPrimitive.CheckboxItem>
  );
}

export function DropdownRadioItem({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownPrimitive.RadioItem>) {
  return (
    <DropdownPrimitive.RadioItem
      className={cn(
        "relative flex h-9 cursor-default select-none items-center rounded-md py-2 pl-8 pr-2.5 outline-none transition-colors",
        "focus:bg-surface-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        <DropdownPrimitive.ItemIndicator>
          <span className="h-2 w-2 rounded-full bg-accent" />
        </DropdownPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownPrimitive.RadioItem>
  );
}

export function DropdownSubTrigger({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownPrimitive.SubTrigger>) {
  return (
    <DropdownPrimitive.SubTrigger
      className={cn(
        "flex h-9 cursor-default select-none items-center gap-2 rounded-md px-2.5 outline-none transition-colors focus:bg-surface-muted",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight aria-hidden="true" className="ml-auto h-4 w-4" />
    </DropdownPrimitive.SubTrigger>
  );
}

export const DropdownSub = DropdownPrimitive.Sub;

export function DropdownSubContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownPrimitive.SubContent>) {
  return (
    <DropdownPrimitive.SubContent
      className={cn(
        "z-50 min-w-48 rounded-lg border border-border bg-surface-elevated p-1.5 text-sm text-foreground shadow-lifted outline-none",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownPrimitive.Separator>) {
  return (
    <DropdownPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export function DropdownLabel({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownPrimitive.Label>) {
  return (
    <DropdownPrimitive.Label
      className={cn("px-2.5 py-1.5 text-xs font-medium text-foreground/58", className)}
      {...props}
    />
  );
}
