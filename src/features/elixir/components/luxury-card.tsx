import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type LuxuryCardProps = {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string;
  tone?: "cream" | "forest" | "gold";
};

export function LuxuryCard({
  children,
  className,
  eyebrow,
  title,
  tone = "cream",
}: LuxuryCardProps) {
  return (
    <Card
      className={cn(
        "h-full overflow-hidden p-5 shadow-soft transition-transform duration-300 ease-[var(--ease-luxury)] hover:-translate-y-1 sm:p-6",
        tone === "forest" && "border-[#2E6B3E]/40 bg-[#132316] text-background",
        tone === "gold" && "border-[#B8860B]/30 bg-[#fff8e4]",
        className,
      )}
      variant={tone === "cream" ? "elevated" : "default"}
    >
      {eyebrow ? (
        <Badge className={cn(tone === "forest" && "bg-white/12 text-[#f3dfae]")} tone="accent">
          {eyebrow}
        </Badge>
      ) : null}
      {title ? <h3 className="mt-5 text-lg font-semibold leading-7">{title}</h3> : null}
      <div
        className={cn(
          "mt-3 text-sm leading-6 text-foreground/68",
          tone === "forest" && "text-background/72",
        )}
      >
        {children}
      </div>
    </Card>
  );
}
