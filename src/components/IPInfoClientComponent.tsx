'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from "next-intl";
import type { IPInfo } from '@/types/ip';
import { Advertisement } from '@/components/Advertisement';

// JSON-LD structured data
function generateStructuredData() {
  // Web application structured data
  const webApplication = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'IP Check Tools',
    applicationCategory: 'UtilityApplication',
    description: 'Free IP address lookup and network speed test tools providing detailed information about IP addresses and connection speeds.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    operatingSystem: 'Any',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '256',
      bestRating: '5',
      worstRating: '1'
    },
    featureList: [
      'IP Address Lookup',
      'Geolocation Information',
      'ISP Details',
      'Organization Information',
      'Timezone Data',
      'Network Speed Test',
      'Download Speed Measurement',
      'Upload Speed Measurement',
      'IP Distance Calculator'
    ],
    hasPart: [
      {
        '@type': 'WebApplication',
        'name': 'Network Speed Test',
        'applicationCategory': 'UtilityApplication',
        'description': 'Test your network download and upload speeds with our free speed test tool. No registration required.',
        'url': 'https://ipcheck.tools/speedtest',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      },
      {
        '@type': 'WebApplication',
        'name': 'IP Distance Calculator',
        'applicationCategory': 'UtilityApplication',
        'description': 'Calculate the geographical distance between two IP addresses. Generate a unique link and invite someone to discover the distance between your locations.',
        'url': 'https://ipcheck.tools/ipdistance',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      }
    ]
  };

  // Organization structured data
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IP Check Tools',
    url: 'https://ipcheck.tools',
    logo: 'https://ipcheck.tools/logo.png',
    description: 'Provider of free IP address lookup and network testing tools.',
    sameAs: [
      'https://twitter.com/ipchecktools',
      'https://github.com/kynliebolles/ipcheck'
    ]
  };

  // Breadcrumb navigation structured data
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ipcheck.tools'
      }
    ]
  };

  // FAQ structured data
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the IP Lookup tool work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our IP lookup tool uses geolocation databases to provide detailed information about any IP address, including geographical location, ISP, organization, and timezone.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is the Network Speed Test free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our Network Speed Test is completely free to use. No registration or subscription is required.'
        }
      },
      {
        '@type': 'Question',
        name: 'How accurate is the IP location information?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The location information is generally accurate to the city level. However, exact precision can vary based on how ISPs assign IP addresses and update their information.'
        }
      },
      {
        '@type': 'Question',
        name: 'What factors can affect my speed test results?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Multiple factors can affect speed test results, including your current network traffic, Wi-Fi signal strength, server load, and the device you are using.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does the IP Distance feature work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our IP Distance tool creates a unique link that you share with another person. When both of you visit the link, we calculate the geographical distance between your IP locations using geolocation databases and the Haversine formula.'
        }
      }
    ]
  };

  return [webApplication, organization, breadcrumb, faq];
}

export default function IPInfoClientComponent({ locale }: { locale: string }) {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchIp, setSearchIp] = useState('');
  const [showClearCacheSuccess, setShowClearCacheSuccess] = useState(false);
  const t = useTranslations("common");

  const fetchIpInfo = async (targetIp?: string) => {
    setLoading(true);
    setError('');
    try {
      const url = targetIp ? `/api/ip?ip=${targetIp}` : '/api/ip';
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'fail') {
        throw new Error(data.message || 'Failed to fetch IP information');
      }
      
      setIpInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpInfo();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchIp.trim()) {
      fetchIpInfo(searchIp.trim());
    }
  };

  const handleReset = () => {
    setSearchIp('');
    fetchIpInfo();
  };

  const handleClearCache = () => {
    // Clear different types of browser storage
    try {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear cookies (if possible within same origin)
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      // Show success message
      setShowClearCacheSuccess(true);
      setTimeout(() => setShowClearCacheSuccess(false), 3000);
      
      // Optionally reload the page to clear any in-memory cache
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error clearing cache:', error);
      // Still show success message as some clearing operations might have worked
      setShowClearCacheSuccess(true);
      setTimeout(() => setShowClearCacheSuccess(false), 3000);
    }
  };

  return (
    <>
      {generateStructuredData().map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {showClearCacheSuccess && (
            <div className="mb-4 bg-green-50 dark:bg-green-900/50 border-l-4 border-green-500 p-4 rounded-lg">
              <p className="text-green-700 dark:text-green-200 font-medium">{t("app.clearCacheSuccess")}</p>
            </div>
          )}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">{t("app.title")}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">{t("app.description")}</p>
            
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-6 sm:mb-8 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={searchIp}
                onChange={(e) => setSearchIp(e.target.value)}
                placeholder="Enter IP address"
                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="flex gap-2 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {t("app.search")}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {t("app.reset")}
                </button>
                <button
                  type="button"
                  onClick={handleClearCache}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  title={t("app.clearCacheDescription")}
                >
                  {t("app.clearCache")}
                </button>
              </div>
            </form>
          </div>

          {loading && (
            <div className="mt-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{t("app.fetching")}</p>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4">
              <p className="text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          {ipInfo && (
            <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">{t("app.ipDetails")}</h3>
              </div>
              <div className="px-4 sm:px-6 py-4 sm:py-5 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t("app.ipAddress")}</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white break-words">{ipInfo.query}</dd>
                </div>
                <div>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t("app.countryRegion")}</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white break-words">{ipInfo.country} ({ipInfo.countryCode})</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("app.city")}</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.city}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("app.region")}</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.regionName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("app.isp")}</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.isp}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("app.timezone")}</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.timezone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("app.coordinates")}</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.lat}, {ipInfo.lon}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("app.organization")}</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.org}</dd>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t("app.userAgent")}</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white break-all">{ipInfo.userAgent}</dd>
                </div>
              </div>
            </div>
          )}
          <div className="mt-8 sm:mt-12 mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 sm:mb-4">{t("tools.section_title")}</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">{t("tools.section_description")}</p>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 max-w-2xl mx-auto">
              <Link
                href={`/${locale}/speedtest`}
                className="flex items-center justify-start sm:justify-center gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-200 font-medium" title="Test your network speed">{t("tools.speedtest_title")}</span>
              </Link>
              <Link
                href={`/${locale}/ipdistance`}
                className="flex items-center justify-start sm:justify-center gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <svg
                  className="w-6 h-6 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-200 font-medium" title="Calculate distance between IP addresses">{t("tools.ipdistance_title")}</span>
              </Link>
              {/* Reserved space for more tools in the future */}
            </div>
          </div>

          <div className="mt-8">
            <Advertisement slot="1234567890" width="728px" height="90px" />
          </div>
        </div>
      </div>
    </>
  );
} 