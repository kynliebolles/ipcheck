'use client';

import { useState, useEffect } from 'react';

import type { IPInfo } from '@/types/ip';
import { Advertisement } from '@/components/Advertisement';

// JSON-LD 结构化数据
function generateStructuredData() {
  return {
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
      'Upload Speed Measurement'
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
      }
    ]
  };
}

export default function Home() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchIp, setSearchIp] = useState('');



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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData())
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">IP Information</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Check any IP address details</p>
            
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 flex gap-2">
              <input
                type="text"
                value={searchIp}
                onChange={(e) => setSearchIp(e.target.value)}
                placeholder="Enter IP address"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Reset
              </button>
            </form>
          </div>

          {loading && (
            <div className="mt-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Fetching IP information...</p>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4">
              <p className="text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          {ipInfo && (
            <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">IP Details</h3>
              </div>
              <div className="px-6 py-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">IP Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.query}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Country/Region</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.country} ({ipInfo.countryCode})</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">City</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.city}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Region</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.regionName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">ISP</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.isp}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Timezone</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.timezone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Coordinates</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.lat}, {ipInfo.lon}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ipInfo.org}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">User Agent</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white break-all">{ipInfo.userAgent}</dd>
                </div>
              </div>
            </div>
          )}
          <div className="mt-12 mb-12">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Free Network Testing Tools</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">Comprehensive network analysis tools including speed testing and IP information lookup. All tools are free to use and no registration required.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <a
                href="/speedtest"
                className="flex items-center justify-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
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
                <span className="text-gray-700 dark:text-gray-200 font-medium" title="Test your network speed">Network Speed Test - Check Download & Upload Speed</span>
              </a>
              {/* 预留位置以后添加更多工具 */}
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
