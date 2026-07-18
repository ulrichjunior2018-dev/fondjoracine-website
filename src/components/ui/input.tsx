import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

/** Shared field chrome — min-w-0 / max-w-full keeps long input from blowing out mobile layouts. */
const fieldClassName =
  "box-border w-full min-w-0 max-w-full rounded-md border border-border bg-surface px-3.5 text-base text-foreground shadow-sm transition-colors placeholder:text-foreground/42 hover:border-border-strong focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground/45 sm:text-sm";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  isInvalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, isInvalid = false, ...props },
  ref,
) {
  return (
    <input
      aria-invalid={isInvalid || undefined}
      className={cn(
        "h-11",
        fieldClassName,
        isInvalid && "border-destructive focus:border-destructive",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  isInvalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, isInvalid = false, ...props },
  ref,
) {
  return (
    <textarea
      aria-invalid={isInvalid || undefined}
      className={cn(
        "min-h-28 resize-y py-3",
        fieldClassName,
        isInvalid && "border-destructive focus:border-destructive",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

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
    <label className={cn("grid min-w-0 gap-2 text-sm font-medium text-foreground", className)}>
      <span className="min-w-0 break-words">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>
      <span className="min-w-0">{children}</span>
      {description ? (
        <span className="min-w-0 break-words text-xs leading-5 text-foreground/58">
          {description}
        </span>
      ) : null}
      {error ? (
        <span className="min-w-0 break-words text-xs leading-5 text-destructive">{error}</span>
      ) : null}
    </label>
  );
}
