"use client";

import Link from "next/link";
import type { Route } from "next";
import { MapPin, MessageCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { NewsletterForm } from "@/features/home/components/newsletter-form";
import { buildWaLink } from "@/lib/config";
import { useCopy, useI18n } from "@/lib/i18n-context";

type FooterLink = readonly [string, string];

function FooterLinkList({
  links,
  soon = [],
}: {
  links: readonly FooterLink[];
  soon?: readonly FooterLink[];
}) {
  return (
    <ul className="grid gap-2.5">
      {links.map(([label, href]) => (
        <li key={href + label}>
          <Link
            className="text-sm text-[#F5EFE3]/68 transition-colors hover:text-[#B8935A]"
            href={href as Route}
          >
            {label}
          </Link>
        </li>
      ))}
      {soon.map(([label]) => (
        <li key={label}>
          <span
            className="inline-flex items-center gap-2 text-sm text-[#F5EFE3]/38"
            title="Coming soon"
          >
            {label}
            <span className="rounded-full border border-[#B8935A]/25 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#B8935A]/80">
              Soon
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function SocialLinks({ label }: { label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        aria-label="Instagram"
        className="inline-flex size-10 items-center justify-center rounded-full border border-[#B8935A]/28 text-[#F5EFE3]/78 transition-colors hover:border-[#B8935A]/50 hover:text-[#B8935A]"
        href={siteConfig.social.instagram}
        rel="noreferrer"
        target="_blank"
      >
        <InstagramIcon className="size-4" />
      </a>
      <span className="sr-only">{label}</span>
      {/* Future: Facebook, TikTok, YouTube, LinkedIn — add only when accounts are active. */}
    </div>
  );
}

/**
 * Shared Maison Fondjo site footer.
 * Desktop: Brand | Shop | Company | Support.
 * Mobile: brand + newsletter + collapsible Shop/Company/Support/Follow Us + bottom bar.
 * Anticipated (not speculative): Track Order, Help Center, more products, more socials.
 */
export function SiteFooter() {
  const { locale } = useI18n();
  const copy = useCopy().home.footer;
  const supportWhatsApp = buildWaLink("support", "", locale);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050504] text-[#F5EFE3]">
      <Container className="border-t border-[#B8935A]/16 px-5 pb-28 pt-14 md:pb-12 md:pt-16">
        {/* Desktop 4-column */}
        <div className="hidden gap-10 lg:grid lg:grid-cols-4">
          <div className="max-w-xs">
            <p className="font-serif text-3xl text-[#B8935A]">Maison Fondjo</p>
            <p className="mt-4 text-sm leading-6 text-[#F5EFE3]/62">{copy.brandBlurb}</p>
            <p className="mt-5 flex items-start gap-2 text-sm text-[#F5EFE3]/55">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#B8935A]" />
              {copy.brandLocation}
            </p>
            <p className="mt-6 text-[0.68rem] leading-5 text-[#F5EFE3]/42">
              © {year} Maison Fondjo
              <br />
              {copy.brandRights}
            </p>
          </div>

          <div>
            <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#B8935A]">
              {copy.shopTitle}
            </h2>
            <div className="mt-4">
              <FooterLinkList links={copy.shopLinks} soon={copy.shopSoon} />
            </div>
            {/* Later products: Conditioner, Shampoo, Hair Cream — add rows in copy.shopLinks. */}
          </div>

          <div>
            <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#B8935A]">
              {copy.companyTitle}
            </h2>
            <div className="mt-4">
              <FooterLinkList links={copy.companyLinks} />
            </div>
            {/* Later: Careers, Press, Wholesale, Become a Distributor. */}
          </div>

          <div>
            <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#B8935A]">
              {copy.supportTitle}
            </h2>
            <div className="mt-4">
              <FooterLinkList links={copy.supportLinks} soon={copy.supportSoon} />
            </div>
            <div className="mt-5 rounded-lg border border-[#B8935A]/18 bg-[#0B0B0B]/60 p-4">
              <p className="text-sm font-medium text-[#F5EFE3]/78">{copy.supportHelp}</p>
              <a
                className="mt-2 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#B8935A] transition-colors hover:text-[#F5EFE3]"
                href={supportWhatsApp}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                {copy.whatsapp}
              </a>
            </div>
            <div className="mt-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#B8935A]">
                {copy.socialTitle}
              </p>
              <div className="mt-3">
                <SocialLinks label={copy.socialTitle} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: brand + collapsible sections */}
        <div className="lg:hidden">
          <div>
            <p className="font-serif text-3xl text-[#B8935A]">Maison Fondjo</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#F5EFE3]/62">{copy.brandBlurb}</p>
            <p className="mt-4 flex items-start gap-2 text-sm text-[#F5EFE3]/55">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#B8935A]" />
              {copy.brandLocation}
            </p>
          </div>

          <Accordion className="mt-8 border-t border-[#B8935A]/14" collapsible type="single">
            <AccordionItem className="border-[#B8935A]/14" value="shop">
              <AccordionTrigger className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#F5EFE3]">
                {copy.shopTitle}
              </AccordionTrigger>
              <AccordionContent>
                <FooterLinkList links={copy.shopLinks} soon={copy.shopSoon} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="border-[#B8935A]/14" value="company">
              <AccordionTrigger className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#F5EFE3]">
                {copy.companyTitle}
              </AccordionTrigger>
              <AccordionContent>
                <FooterLinkList links={copy.companyLinks} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="border-[#B8935A]/14" value="support">
              <AccordionTrigger className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#F5EFE3]">
                {copy.supportTitle}
              </AccordionTrigger>
              <AccordionContent>
                <FooterLinkList links={copy.supportLinks} soon={copy.supportSoon} />
                <div className="mt-4 rounded-lg border border-[#B8935A]/18 bg-[#0B0B0B]/60 p-4">
                  <p className="text-sm font-medium text-[#F5EFE3]/78">{copy.supportHelp}</p>
                  <a
                    className="mt-2 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#B8935A]"
                    href={supportWhatsApp}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <MessageCircle aria-hidden="true" className="size-4" />
                    {copy.whatsapp}
                  </a>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="border-[#B8935A]/14" value="social">
              <AccordionTrigger className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#F5EFE3]">
                {copy.socialTitle}
              </AccordionTrigger>
              <AccordionContent>
                <SocialLinks label={copy.socialTitle} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Newsletter */}
        <div className="mt-12 grid gap-4 border-t border-[#B8935A]/14 pt-10 md:grid-cols-[1fr_minmax(0,28rem)] md:items-end md:gap-10">
          <div>
            <h2 className="font-serif text-2xl text-[#B8935A]">{copy.newsletterTitle}</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#F5EFE3]/58">
              {copy.newsletterBody}
            </p>
          </div>
          <NewsletterForm
            idleHint=""
            placeholder={copy.newsletterPlaceholder}
            source="footer"
            submitLabel={copy.newsletterSubmit}
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-[#B8935A]/14 pt-6 text-[0.72rem] text-[#F5EFE3]/48 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Maison Fondjo</p>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link className="transition-colors hover:text-[#B8935A]" href="/policies/privacy">
              {copy.privacy}
            </Link>
            <Link className="transition-colors hover:text-[#B8935A]" href="/policies/terms">
              {copy.terms}
            </Link>
            {/* Cookies page can split out later; privacy covers consent for now. */}
            <Link className="transition-colors hover:text-[#B8935A]" href="/policies/privacy">
              {copy.cookies}
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
