import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils/cn";

type PageLoaderProps = {
  className?: string;
  label?: string;
  /** Spinner color: gold on dark pages, deeper gold on light panels. */
  tone?: "dark" | "light";
};

export function PageLoader({ className, label = "Loading", tone = "dark" }: PageLoaderProps) {
  const isDark = tone === "dark";

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "grid min-h-[40svh] w-full place-items-center bg-transparent px-6 py-16",
        className,
      )}
      role="status"
    >
      <Loader className={isDark ? "text-[#B8935A]" : "text-[#7b622d]"} label={label} size="lg" />
    </div>
  );
}
