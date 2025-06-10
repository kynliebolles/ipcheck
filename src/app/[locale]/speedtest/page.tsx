import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import SpeedTestContent from '../../../components/SpeedTestContent'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 完全等待params解构
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'speedtest' })
  
  return {
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: t('meta_keywords'),
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      type: 'website',
      url: `https://ipcheck.tools/${locale}/speedtest`,
      locale: locale === 'zh' ? 'zh_CN' : locale === 'zh-Hant' ? 'zh_TW' : 'en_US',
    },
    alternates: {
      canonical: `https://ipcheck.tools/${locale}/speedtest`,
      languages: {
        'en': 'https://ipcheck.tools/en/speedtest',
        'zh': 'https://ipcheck.tools/zh/speedtest',
        'zh-Hant': 'https://ipcheck.tools/zh-Hant/speedtest',
        'x-default': 'https://ipcheck.tools/en/speedtest'
      }
    },
    robots: {
      index: true,
      follow: true,
    }
  }
}

// 定义结构化数据
function generateSpeedTestStructuredData(locale: string) {
  // We can't use hooks here, so we load translations programmatically
  let name = 'Network Speed Test Tool';
  let description = 'Free online speed test tool to measure your internet connection speed. Check your download and upload speeds instantly.';
  
  // Set basic translations based on locale
  if (locale === 'zh') {
    name = '网络速度测试工具';
    description = '免费在线速度测试工具，测量您的互联网连接速度。即时检查您的下载和上传速度。';
  } else if (locale === 'zh-Hant') {
    name = '網絡速度測試工具';
    description = '免費在線速度測試工具，測量您的互聯網連接速度。即時檢查您的下載和上傳速度。';
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
    browserRequirements: 'Requires JavaScript. Desktop and mobile compatible.',
    genre: 'utility',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '187',
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
      name: locale === 'zh' ? '互联网速度测试' : locale === 'zh-Hant' ? '互聯網速度測試' : 'Internet Speed Test',
      applicationCategory: 'UtilityApplication'
    }
  };
}

export default async function SpeedTestPage({ params }: Props) {
  // 完全等待params
  const { locale } = await params;
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSpeedTestStructuredData(locale))
        }}
      />
      <SpeedTestContent />
    </main>
  )
}
