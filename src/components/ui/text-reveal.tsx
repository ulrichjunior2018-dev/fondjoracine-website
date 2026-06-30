"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils/cn";
import { typography } from "@/lib/design-system/tokens";

type Level = "display" | "h1" | "h2" | "h3" | "h4";
type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";

function getLevelClass(level: Level): string {
  switch (level) {
    case "display":
      return typography.display;
    case "h1":
      return typography.h1;
    case "h2":
      return typography.h2;
    case "h3":
      return typography.h3;
    case "h4":
      return typography.h4;
  }
}

type TextRevealProps = {
  as?: Tag;
  children: string;
  className?: string;
  delay?: number;
  level?: Level;
  stagger?: number;
};

/**
 * Word-by-word mask reveal for section headlines.
 * Each word slides up from clip-bottom into view as the element enters the viewport.
 * Drop-in replacement for <Heading> when reveal animation is desired.
 */
export function TextReveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  level = "h2",
  stagger = 0.055,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });

  const words = children.split(" ");

  return (
    <Tag
      ref={ref as React.Ref<HTMLParagraphElement>}
      className={cn("font-sans tracking-normal", getLevelClass(level), className)}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-flex overflow-hidden pb-[0.06em] align-bottom">
          <motion.span
            animate={inView ? { y: "0%" } : {}}
            className="inline-block"
            initial={{ y: "110%" }}
            transition={{
              delay: delay + i * stagger,
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
