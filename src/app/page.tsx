'use client';

import { useState, useEffect } from 'react';
import type { IPInfo } from '@/types/ip';

// JSON-LD 结构化数据
function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'IP Check Tool',
    applicationCategory: 'UtilityApplication',
    description: 'Free IP address lookup tool providing detailed information about IP addresses including location, ISP, and organization details.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'IP Address Lookup',
      'Geolocation Information',
      'ISP Details',
      'Organization Information',
      'Timezone Data'
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
                <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono break-all">{ipInfo.userAgent}</dd>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
