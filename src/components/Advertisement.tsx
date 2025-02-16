'use client';

import { useEffect, useRef } from 'react';
import { AdPlaceholder } from './AdPlaceholder';

interface AdvertisementProps {
  slot: string;
  width: string;
  height: string;
}

// 设置为 false 来暂时禁用广告
const SHOW_ADS = false;

interface Window {
  adsbygoogle: unknown[];
}

declare global {
  interface WindowWithAds extends Window {
    adsbygoogle: unknown[];
  }
}

export function Advertisement({ slot, width, height }: AdvertisementProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 只在生产环境中加载广告
    if (!SHOW_ADS) return;

    if (process.env.NODE_ENV === 'production' && adRef.current) {
      try {
        const win = window as unknown as WindowWithAds;
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
      } catch (error) {
        console.error('Error loading advertisement:', error);
      }
    }
  }, []);

  if (!SHOW_ADS) {
    return null;
  }

  if (process.env.NODE_ENV === 'development') {
    return <AdPlaceholder width={width} height={height} />;
  }

  return (
    <div ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width, height }}
        data-ad-client="ca-pub-4921416661260152"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
