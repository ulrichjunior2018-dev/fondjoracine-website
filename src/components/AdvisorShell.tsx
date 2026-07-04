import Image from "next/image";
import Link from "next/link";

import { advisorFooterLinks, advisorImages, advisorNav } from "@/lib/advisor-site";

type AdvisorShellProps = {
  children: React.ReactNode;
};

export function AdvisorShell({ children }: AdvisorShellProps) {
  return (
    <main className="min-h-screen bg-[#080706] text-[#f6f0e4]">
      <header className="sticky top-0 z-50 border-b border-[#d6b75b]/14 bg-[#080706]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/" aria-label="FONDJO RACINE accueil">
            <span className="relative size-10 overflow-hidden rounded-full border border-[#d6b75b]/35">
              <Image
                alt="FONDJO RACINE"
                className="object-cover"
                fill
                sizes="40px"
                src={advisorImages.logo}
              />
            </span>
            <span>
              <span className="block font-serif text-2xl leading-none text-[#d6b75b]">FONDJO</span>
              <span className="block text-[0.56rem] font-semibold uppercase tracking-[0.4em] text-[#f6f0e4]/58">
                Racine
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.16em] text-[#f6f0e4]/62 md:flex">
            {advisorNav.map(([label, href]) => (
              <a className="transition-colors hover:text-[#d6b75b]" href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#d6b75b] px-4 text-sm font-semibold text-[#080706] transition-transform duration-100 active:scale-[0.98]"
            href="/diagnostic"
          >
            Diagnostic
          </a>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-[#d6b75b]/10 px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#f6f0e4]/62 md:hidden">
          {advisorNav.map(([label, href]) => (
            <a className="shrink-0" href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
      </header>
      {children}
      <footer className="border-t border-[#d6b75b]/14 bg-[#050504] px-4 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-[#f6f0e4]/58 md:flex-row md:items-center md:justify-between">
          <p>FONDJO RACINE · Buea, Cameroun</p>
          <nav className="flex flex-wrap gap-5">
            {advisorFooterLinks.map(([label, href]) => (
              <a className="transition-colors hover:text-[#d6b75b]" href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}
