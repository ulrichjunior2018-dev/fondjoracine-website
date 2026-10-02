"use client";

import Script from "next/script";

import { getGaMeasurementId, getGtmId, isClientAnalyticsEnabled } from "@/lib/analytics/config";
import { pushDataLayer } from "@/lib/analytics/events";

/**
 * Google Tag Manager + optional standalone gtag bootstrap.
 * Prefer GTM in production; load GA config tag inside GTM for social/ads tags.
 */
export function GoogleTagManager() {
  if (!isClientAnalyticsEnabled()) {
    return null;
  }

  const gtmId = getGtmId();
  const gaId = getGaMeasurementId();

  return (
    <>
      {/* dataLayer must exist before GTM/gtag scripts */}
      <Script id="mf-dataLayer-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`}
      </Script>

      {gtmId ? (
        <>
          <Script id="mf-gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              height="0"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
              width="0"
            />
          </noscript>
        </>
      ) : null}

      {/* Direct gtag only when GTM is not used and a measurement ID is set */}
      {!gtmId && gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="mf-gtag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());gtag('config','${gaId}',{send_page_view:true});`}
          </Script>
        </>
      ) : null}
    </>
  );
}

/** Call after capturing UTMs so GTM can read first-party attribution if needed. */
export function pushUtmBootstrap(utm: Record<string, string>): void {
  if (Object.keys(utm).length === 0) {
    return;
  }
  pushDataLayer({ event: "utm_captured", ...utm });
}
