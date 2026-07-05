import { cn } from "@/lib/utils/cn";

type LoaderSize = "sm" | "md" | "lg";

type LoaderProps = {
  className?: string;
  label?: string;
  size?: LoaderSize;
};

function getLoaderSizeClassName(size: LoaderSize) {
  switch (size) {
    case "sm":
      return "h-4 w-4";
    case "lg":
      return "h-8 w-8";
    case "md":
      return "h-6 w-6";
  }
}

export function Loader({ className, label = "Chargement", size = "md" }: LoaderProps) {
  return (
    <span className={cn("inline-flex items-center gap-3 text-sm text-foreground/68", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin",
          getLoaderSizeClassName(size),
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
