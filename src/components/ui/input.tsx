import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

const fieldClassName =
  "w-full rounded-md border border-border bg-surface px-3.5 text-sm text-foreground shadow-sm transition-colors placeholder:text-foreground/42 hover:border-border-strong focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/45";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  isInvalid?: boolean;
};

export function Input({ className, isInvalid = false, ...props }: InputProps) {
  return (
    <input
      aria-invalid={isInvalid || undefined}
      className={cn(
        "h-11",
        fieldClassName,
        isInvalid && "border-destructive focus:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  isInvalid?: boolean;
};

export function Textarea({ className, isInvalid = false, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={isInvalid || undefined}
      className={cn(
        "min-h-28 resize-y py-3",
        fieldClassName,
        isInvalid && "border-destructive focus:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

type FieldProps = {
  children: React.ReactNode;
  className?: string;
  description?: string | undefined;
  error?: string | undefined;
  label: string;
  required?: boolean;
};

export function Field({
  children,
  className,
  description,
  error,
  label,
  required = false,
}: FieldProps) {
  return (
    <label className={cn("grid gap-2 text-sm font-medium text-foreground", className)}>
      <span>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>
      {children}
      {description ? (
        <span className="text-xs leading-5 text-foreground/58">{description}</span>
      ) : null}
      {error ? <span className="text-xs leading-5 text-destructive">{error}</span> : null}
    </label>
  );
}
