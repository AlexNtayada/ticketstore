"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { hasAnalyticsConsent } from "@/lib/analytics";

/**
 * Loads GA4 only when the feature is enabled in config AND the visitor has
 * consented (set via setAnalyticsConsent from your consent banner).
 */
export function AnalyticsLoader({ measurementId }: { measurementId?: string }) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    window.__DEP_ANALYTICS_ENABLED__ = true;
    setConsented(hasAnalyticsConsent());
    const onConsent = (e: Event) => setConsented(!!(e as CustomEvent<{ granted: boolean }>).detail?.granted);
    window.addEventListener("dep:consent", onConsent);
    return () => window.removeEventListener("dep:consent", onConsent);
  }, []);

  if (!consented || !measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
