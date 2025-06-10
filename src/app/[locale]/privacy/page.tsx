import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  
  return {
    title: `${t('meta_title')} | IP Check Tools`,
    description: t('meta_description'),
    keywords: 'privacy policy, data protection, IP check privacy, GDPR compliance',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${t('meta_title')} | IP Check Tools`,
      description: t('meta_description'),
      type: 'website',
      url: `https://ipcheck.tools/${locale}/privacy`,
      locale: locale === 'zh' ? 'zh_CN' : locale === 'zh-Hant' ? 'zh_TW' : 'en_US',
    },
    alternates: {
      canonical: `https://ipcheck.tools/${locale}/privacy`,
      languages: {
        'en': 'https://ipcheck.tools/en/privacy',
        'zh': 'https://ipcheck.tools/zh/privacy',
        'zh-Hant': 'https://ipcheck.tools/zh-Hant/privacy',
        'x-default': 'https://ipcheck.tools/en/privacy'
      }
    }
  }
}

// 创建隐私政策页面的结构化数据
function generatePrivacyPolicyStructuredData(locale: string) {
  const baseUrl = 'https://ipcheck.tools'
  
  const titles = {
    en: 'Privacy Policy | IP Check Tools',
    zh: '隐私政策 | IP查询工具',
    'zh-Hant': '隱私政策 | IP查詢工具'
  }
  
  const descriptions = {
    en: 'Privacy policy for IP Check Tools. Learn how we collect, use, and protect your information.',
    zh: 'IP查询工具隐私政策。了解我们如何收集、使用和保护您的信息。',
    'zh-Hant': 'IP查詢工具隱私政策。了解我們如何收集、使用和保護您的資訊。'
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    url: `${baseUrl}/${locale}/privacy`,
    inLanguage: locale,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: locale === 'zh' ? '首页' : locale === 'zh-Hant' ? '首頁' : 'Home',
          item: `${baseUrl}/${locale}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: locale === 'zh' ? '隐私政策' : locale === 'zh-Hant' ? '隱私政策' : 'Privacy Policy',
          item: `${baseUrl}/${locale}/privacy`
        }
      ]
    },
    publisher: {
      '@type': 'Organization',
      name: 'IP Check Tools',
      url: baseUrl
    },
    about: {
      '@type': 'Thing',
      name: locale === 'zh' ? '数据隐私保护' : locale === 'zh-Hant' ? '數據隱私保護' : 'Data Privacy Protection'
    }
  };
}

export default async function PrivacyPolicy({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generatePrivacyPolicyStructuredData(locale))
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            {t('title')}
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              {t('last_updated')}: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                1. {t('section_1_title')}
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{t('section_1_intro')}</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('collect_ip')}</li>
                <li>{t('collect_browser')}</li>
                <li>{t('collect_usage')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                2. {t('section_2_title')}
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{t('section_2_intro')}</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('use_provide_service')}</li>
                <li>{t('use_improve')}</li>
                <li>{t('use_analyze')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                3. {t('section_3_title')}
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{t('section_3_intro')}</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('ads_ip')}</li>
                <li>{t('ads_browser')}</li>
                <li>{t('ads_os')}</li>
                <li>{t('ads_behavior')}</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                {t('google_policy_text')}{' '}
                <a href="https://policies.google.com/technologies/ads" 
                   className="text-blue-600 dark:text-blue-400 hover:underline"
                   target="_blank" 
                   rel="noopener noreferrer">
                  {t('google_policy_link')}
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                4. {t('section_4_title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{t('section_4_content')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                5. {t('section_5_title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{t('section_5_content')}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">
                6. {t('section_6_title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{t('section_6_content')}</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
