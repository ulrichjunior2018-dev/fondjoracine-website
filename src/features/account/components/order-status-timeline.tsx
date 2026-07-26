import { cn } from "@/lib/utils/cn";

type TimelineStep = {
  id: string;
  label: string;
  state: "complete" | "current" | "upcoming";
};

type OrderStatusTimelineProps = {
  steps: TimelineStep[];
  className?: string;
};

export function OrderStatusTimeline({ steps, className }: OrderStatusTimelineProps) {
  if (steps.length === 0) return null;

  return (
    <ol className={cn("grid gap-0", className)} aria-label="Order status timeline">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const done = step.state === "complete";
        const current = step.state === "current";

        return (
          <li className="relative flex gap-3 pb-5 last:pb-0" key={step.id}>
            {!isLast ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[9px] top-5 h-[calc(100%-12px)] w-px",
                  done || current ? "bg-accent/50" : "bg-border",
                )}
              />
            ) : null}
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                done && "border-sage bg-sage text-background",
                current && "border-accent bg-accent text-background",
                step.state === "upcoming" && "border-border bg-surface text-foreground/40",
              )}
            >
              {done ? "✓" : current ? "●" : ""}
            </span>
            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  current && "text-foreground",
                  done && "text-foreground/80",
                  step.state === "upcoming" && "text-foreground/45",
                )}
              >
                {step.label}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
