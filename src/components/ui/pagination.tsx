import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function Pagination({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    />
  );
}

type PaginationButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isCurrent?: boolean;
  label: ReactNode;
};

export function PaginationButton({
  className,
  isCurrent = false,
  label,
  ...props
}: PaginationButtonProps) {
  return (
    <Button
      aria-current={isCurrent ? "page" : undefined}
      className={cn(isCurrent && "bg-accent text-accent-foreground hover:bg-accent/90", className)}
      size="icon"
      variant={isCurrent ? "primary" : "secondary"}
      {...props}
    >
      {label}
    </Button>
  );
}
