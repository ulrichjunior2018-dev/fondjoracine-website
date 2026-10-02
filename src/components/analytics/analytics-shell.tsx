"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { pushUtmBootstrap } from "@/components/analytics/google-tag-manager";
import { isClientAnalyticsEnabled } from "@/lib/analytics/config";
import { trackPageView } from "@/lib/analytics/events";
import { captureUtmFromLocation } from "@/lib/analytics/utm";
import { publicEnv } from "@/config/public-env";

function RouteAndUtmTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const utm = captureUtmFromLocation();
    if (Object.keys(utm).length > 0) {
      pushUtmBootstrap(utm as Record<string, string>);
    }
  }, []);

  useEffect(() => {
    if (!isClientAnalyticsEnabled()) {
      return;
    }

    const query = searchParams?.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    trackPageView(path);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Client analytics shell: SPA page_view, first-touch UTM, Vercel speed/usage.
 * GTM/gtag scripts live in GoogleTagManager (rendered from root layout).
 */
export function AnalyticsShell() {
  const enableVercel = publicEnv.isProduction || publicEnv.analyticsDebug;

  return (
    <>
      <Suspense fallback={null}>
        <RouteAndUtmTracker />
      </Suspense>
      {enableVercel ? (
        <>
          <VercelAnalytics />
          <SpeedInsights />
        </>
      ) : null}
    </>
  );
}
