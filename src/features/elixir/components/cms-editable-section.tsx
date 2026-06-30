import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import type { LocalizedText, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";
import { Reveal } from "@/features/home/components/reveal";

type CmsEditableSectionProps = {
  children: ReactNode;
  eyebrow: LocalizedText;
  id: string;
  intro?: LocalizedText;
  title: LocalizedText;
  tone?: "cream" | "forest";
  locale: Locale;
};

export function CmsEditableSection({
  children,
  eyebrow,
  id,
  intro,
  locale,
  title,
  tone = "cream",
}: CmsEditableSectionProps) {
  return (
    <section
      className={
        tone === "forest"
          ? "bg-foreground py-16 text-background sm:py-24"
          : "bg-background py-16 sm:py-24"
      }
      id={id}
    >
      <Container>
        <Reveal className="max-w-2xl">
          <Kicker className={tone === "forest" ? "text-accent-muted" : undefined}>
            {t(eyebrow, locale)}
          </Kicker>
          <Heading
            as="h2"
            className={tone === "forest" ? "mt-3 text-background" : "mt-3"}
            level="h2"
          >
            {t(title, locale)}
          </Heading>
          {intro ? (
            <Text className={tone === "forest" ? "mt-4 text-background/72" : "mt-4"} tone="muted">
              {t(intro, locale)}
            </Text>
          ) : null}
        </Reveal>
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}
