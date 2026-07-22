import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";

export type PolicySection = {
  heading: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  rows?: readonly { label: string; value: string }[];
};

type PolicyDocumentProps = {
  kicker: string;
  title: string;
  sections: readonly PolicySection[];
  backHome: string;
};

export function PolicyDocument({ kicker, title, sections, backHome }: PolicyDocumentProps) {
  return (
    <main className="bg-background py-16">
      <Container size="lg">
        <Kicker>{kicker}</Kicker>
        <Heading as="h1" className="mt-3" level="h2">
          {title}
        </Heading>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-xl font-light text-foreground sm:text-2xl">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <Text className="mt-4" key={paragraph} tone="muted">
                  {paragraph}
                </Text>
              ))}
              {section.bullets && section.bullets.length > 0 ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-foreground/68">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.rows && section.rows.length > 0 ? (
                <div className="mt-4 overflow-hidden rounded-md border border-border">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {section.rows.map((row) => (
                        <tr className="border-b border-border last:border-b-0" key={row.label}>
                          <th className="bg-surface-muted px-4 py-3 align-top font-medium text-foreground">
                            {row.label}
                          </th>
                          <td className="px-4 py-3 text-foreground/68">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          ))}
        </div>

        <Link className="mt-10 inline-flex text-sm font-semibold text-accent" href="/">
          {backHome}
        </Link>
      </Container>
    </main>
  );
}
