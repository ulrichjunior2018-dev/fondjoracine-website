import { ChevronRight } from "lucide-react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export function Breadcrumb({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex min-w-0 items-center text-sm text-foreground/62", className)}
      {...props}
    />
  );
}

export function BreadcrumbList({ className, ...props }: HTMLAttributes<HTMLOListElement>) {
  return <ol className={cn("flex min-w-0 flex-wrap items-center gap-1.5", className)} {...props} />;
}

type BreadcrumbItemProps = HTMLAttributes<HTMLLIElement> & {
  separator?: ReactNode;
};

export function BreadcrumbItem({ children, className, separator, ...props }: BreadcrumbItemProps) {
  return (
    <li className={cn("flex min-w-0 items-center gap-1.5", className)} {...props}>
      {children}
      {separator ?? (
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-foreground/35" />
      )}
    </li>
  );
}

export function BreadcrumbLink({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "truncate rounded-xs transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbCurrent({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span aria-current="page" className={cn("truncate text-foreground", className)} {...props} />
  );
}
