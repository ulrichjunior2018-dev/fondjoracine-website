import Script from "next/script";

type JsonLdProps = {
  data: unknown;
  id: string;
};

/**
 * JSON-LD via next/script so client navigations under AppProviders
 * do not warn about inert React `<script>` children.
 */
export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
