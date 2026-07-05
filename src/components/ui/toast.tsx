"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ToastTone = "default" | "success" | "warning" | "danger";

type ToastMessage = {
  id: string;
  description?: string;
  title: string;
  tone: ToastTone;
};

type ToastInput = Omit<ToastMessage, "id" | "tone"> & {
  tone?: ToastTone;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function getToastToneClassName(tone: ToastTone) {
  switch (tone) {
    case "success":
      return "border-success/30 bg-success-muted text-success";
    case "warning":
      return "border-warning/30 bg-warning-muted text-warning";
    case "danger":
      return "border-destructive/30 bg-destructive-muted text-destructive";
    case "default":
      return "border-border bg-surface-elevated text-foreground";
  }
}

function createToastId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}`;
}

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast = useCallback((input: ToastInput) => {
    const message: ToastMessage = {
      id: createToastId(),
      title: input.title,
      tone: input.tone ?? "default",
    };

    if (input.description) {
      message.description = input.description;
    }

    setMessages((current) => [...current, message]);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {messages.map((message) => (
          <ToastPrimitive.Root
            className={cn(
              "grid w-full gap-1 rounded-lg border p-4 shadow-lifted data-[state=open]:animate-slide-up data-[state=closed]:animate-exit",
              getToastToneClassName(message.tone),
            )}
            duration={5_000}
            key={message.id}
            onOpenChange={(open) => {
              if (!open) {
                setMessages((current) => current.filter((item) => item.id !== message.id));
              }
            }}
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <ToastPrimitive.Title className="text-sm font-semibold leading-6">
                  {message.title}
                </ToastPrimitive.Title>
                {message.description ? (
                  <ToastPrimitive.Description className="text-sm leading-6 opacity-80">
                    {message.description}
                  </ToastPrimitive.Description>
                ) : null}
              </div>
              <ToastPrimitive.Close asChild>
                <Button aria-label="Dismiss notification" size="icon" variant="ghost">
                  <X aria-hidden="true" className="h-4 w-4" />
                </Button>
              </ToastPrimitive.Close>
            </div>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
