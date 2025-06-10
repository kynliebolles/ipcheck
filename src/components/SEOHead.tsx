interface SEOHeadProps {
  locale: string;
  path?: string;
  canonical?: string;
}

export default function SEOHead({ locale, path = '', canonical }: SEOHeadProps) {
  const baseUrl = 'https://ipcheck.tools';
  const locales = ['en', 'zh', 'zh-Hant'];
  
  // 如果没有提供canonical，则使用当前语言版本
  const canonicalUrl = canonical || `${baseUrl}/${locale}${path ? `/${path}` : ''}`;
  
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      {/* hreflang links */}
      {locales.map((loc) => (
        <link
          key={loc}
          rel="alternate"
          href={`${baseUrl}/${loc}${path ? `/${path}` : ''}`}
          hrefLang={loc}
        />
      ))}
      <link
        rel="alternate"
        href={`${baseUrl}/en${path ? `/${path}` : ''}`}
        hrefLang="x-default"
      />
    </>
  );
} 