'use client';

import Script from 'next/script';

export function GoogleAdsense() {
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4921416661260152"
      crossOrigin="anonymous"
    />
  );
}
