import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils/cn";

type PageLoaderProps = {
  className?: string;
  label?: string;
  /** Dark storefront vs cream checkout panel. */
  tone?: "dark" | "light";
};

export function PageLoader({ className, label = "Loading", tone = "dark" }: PageLoaderProps) {
  const isDark = tone === "dark";

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "grid min-h-[50svh] w-full place-items-center px-6 py-16",
        isDark ? "bg-[#0B0B0B] text-[#B8935A]" : "bg-[#F7F2E8] text-[#7b622d]",
        className,
      )}
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        <Loader className={isDark ? "text-[#B8935A]" : "text-[#7b622d]"} label={label} size="lg" />
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.22em]",
            isDark ? "text-[#F5EFE3]/55" : "text-[#0B0B0B]/45",
          )}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
