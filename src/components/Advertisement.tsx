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

export function Advertisement({ slot, width, height }: AdvertisementProps) {
  // 如果广告被禁用，直接返回 null
  if (!SHOW_ADS) {
    return null;
  }

  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 只在生产环境中加载广告
    if (process.env.NODE_ENV === 'production' && adRef.current) {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (error) {
        console.error('Error loading advertisement:', error);
      }
    }
  }, []);

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
