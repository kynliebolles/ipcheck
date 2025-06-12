import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import GeolocationContent from '../../../components/GeolocationContent'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'geolocation' })
  
  return {
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: t('meta_keywords'),
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      type: 'website',
      url: `https://ipcheck.tools/${locale}/geolocation`,
      locale: locale === 'zh' ? 'zh_CN' : locale === 'zh-Hant' ? 'zh_TW' : 'en_US',
    },
    alternates: {
      canonical: `https://ipcheck.tools/${locale}/geolocation`,
      languages: {
        'en': 'https://ipcheck.tools/en/geolocation',
        'zh': 'https://ipcheck.tools/zh/geolocation',
        'zh-Hant': 'https://ipcheck.tools/zh-Hant/geolocation',
        'x-default': 'https://ipcheck.tools/en/geolocation'
      }
    },
    robots: {
      index: true,
      follow: true,
    }
  }
}

function generateGeolocationStructuredData(locale: string) {
  let name = 'Geolocation Tool - Get Your Location';
  let description = 'Free geolocation tool to get your precise location information using GPS or network data. Discover your coordinates, address, and location details.';
  
  if (locale === 'zh') {
    name = '地理位置工具 - 获取您的位置';
    description = '免费地理位置工具，使用GPS或网络数据获取您的精确位置信息。发现您的坐标、地址和位置详情。';
  } else if (locale === 'zh-Hant') {
    name = '地理位置工具 - 獲取您的位置';
    description = '免費地理位置工具，使用GPS或網絡數據獲取您的精確位置信息。發現您的坐標、地址和位置詳情。';
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    description,
    browserRequirements: 'Requires JavaScript and geolocation permission. Desktop and mobile compatible.',
    genre: 'utility',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '143',
      bestRating: '5',
      worstRating: '1'
    },
    contributor: {
      '@type': 'Organization',
      name: 'IP Check Tools',
      url: 'https://ipcheck.tools'
    },
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: locale === 'zh' ? '地理位置检测' : locale === 'zh-Hant' ? '地理位置檢測' : 'Geolocation Detection',
      applicationCategory: 'UtilityApplication'
    }
  };
}

export default async function GeolocationPage({ params }: Props) {
  const { locale } = await params;
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateGeolocationStructuredData(locale))
        }}
      />
      <GeolocationContent />
    </main>
  )
} 