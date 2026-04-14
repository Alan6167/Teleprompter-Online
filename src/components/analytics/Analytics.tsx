import Script from 'next/script';

/**
 * Third-party analytics injected on every page.
 *
 *  - Google Analytics 4 (gtag.js) — property G-8W0LZYG5VX
 *  - Pageview.app                 — domain teleprompteronline.net
 *
 * Loaded with `afterInteractive` so they don't block first paint.
 */
export function Analytics() {
  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-8W0LZYG5VX"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-8W0LZYG5VX');`}
      </Script>

      {/* Pageview.app */}
      <Script
        src="https://app.pageview.app/js/script.js"
        data-domain="teleprompteronline.net"
        strategy="afterInteractive"
      />
    </>
  );
}
