"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;

type ModalContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  description?: ReactNode;
  title: ReactNode;
};

export function ModalContent({
  children,
  className,
  description,
  title,
  ...props
}: ModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/38 backdrop-blur-sm data-[state=open]:animate-enter data-[state=closed]:animate-exit" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto rounded-lg border border-border bg-surface-elevated p-5 shadow-lifted outline-none sm:p-6",
          "data-[state=open]:animate-enter data-[state=closed]:animate-exit",
          className,
        )}
        {...props}
      >
        <div className="grid gap-2 pr-10">
          <DialogPrimitive.Title className="text-xl font-semibold leading-7 text-foreground">
            {title}
          </DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description className="text-sm leading-6 text-foreground/68">
              {description}
            </DialogPrimitive.Description>
          ) : null}
        </div>
        {children}
        <DialogPrimitive.Close asChild>
          <Button
            aria-label="Close dialog"
            className="absolute right-4 top-4"
            size="icon"
            variant="ghost"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </Button>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function ModalFooter({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}
