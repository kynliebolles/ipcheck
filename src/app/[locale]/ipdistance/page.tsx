'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreateSessionResponse } from '@/types/ipdistance';
import Script from 'next/script';
import { useTranslations } from 'next-intl';

function generateIPDistanceStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'IP Distance Calculator',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    description: 'Calculate the geographical distance between two IP addresses in real-time.',
    browserRequirements: 'Requires JavaScript. Desktop and mobile compatible.',
    genre: 'utility'
  };
}

export default function IPDistancePage() {
  const t = useTranslations('ipdistance');
  const [sessionInfo, setSessionInfo] = useState<CreateSessionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const createNewSession = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/ipdistance/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      
      const data = await response.json();
      setSessionInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!sessionInfo) return;
    
    navigator.clipboard.writeText(sessionInfo.shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const formatExpirationTime = (expiresAt: Date) => {
    const expiry = new Date(expiresAt);
    return expiry.toLocaleTimeString();
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <Script
        id="ip-distance-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateIPDistanceStructuredData())
        }}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
        <Link 
          href="/"
          className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>{t('back_home')}</span>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t('calculate_distance')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('generate_instructions')}
          </p>

          {!sessionInfo ? (
            <button
              onClick={createNewSession}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md transition-all ${
                loading
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? t('creating_link') : t('generate_link')}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-green-800 dark:text-green-200 font-medium">{t('link_created')}</p>
                <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                  {t('link_expires_at')} {formatExpirationTime(sessionInfo.expiresAt)}
                </p>
              </div>
              
              <div className="border border-gray-300 dark:border-gray-700 rounded-md flex overflow-hidden">
                <input
                  type="text"
                  value={sessionInfo.shareUrl}
                  readOnly
                  className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 border-none outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 font-medium ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                  }`}
                >
                  {copied ? t('copied') : t('copy')}
                </button>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">{t('instructions')}:</p>
                <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>{t('instruction1')}</li>
                  <li>{t('instruction2')}</li>
                  <li>{t('instruction3')}</li>
                  <li>{t('instruction4')}</li>
                </ol>
              </div>
              
              <button
                onClick={createNewSession}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('generate_new_link')}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-md">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium mb-2">{t('about_title')}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('about_description')}
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-md p-4">
            <h4 className="text-blue-800 dark:text-blue-300 font-medium mb-2">{t('privacy_title')}</h4>
            <p className="text-blue-700 dark:text-blue-400 text-sm">
              {t('privacy_description')}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 