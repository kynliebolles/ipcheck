'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IPLocationInfo } from '@/types/ipdistance';
import Script from 'next/script';
import { useTranslations } from 'next-intl';

interface SessionResponse {
  message: string;
  sessionId: string;
  expiresAt: string;
  isFirstVisitor?: boolean;
  isComplete: boolean;
  firstIP?: IPLocationInfo;
  secondIP?: IPLocationInfo;
  distance?: number;
  unit?: string;
}

export default function IPDistanceSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [sessionData, setSessionData] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sessionId = params.sessionId as string;
  const t = useTranslations('ipdistance');

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch(`/api/ipdistance/${sessionId}`);
      
      if (response.status === 404) {
        throw new Error('Session not found or expired');
      }
      
      if (response.status === 403) {
        // This link has already been used by two IPs
        // Redirect to home page after 5 seconds
        const data = await response.json();
        setSessionData(data);
        setTimeout(() => {
          router.push('/');
        }, 5000);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch session data');
      }
      
      const data = await response.json();
      setSessionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [sessionId, router]);
  
  useEffect(() => {
    if (!sessionId) return;
    
    // Initial session check
    checkSession();
  }, [sessionId, checkSession]);
  
  useEffect(() => {
    if (!sessionId || !sessionData?.isFirstVisitor || sessionData?.isComplete) return;
    
    // 仅在是第一位访问者且计算未完成时设置轮询
    const intervalId = setInterval(() => {
      checkSession();
    }, 5000); // 每5秒检查一次状态更新
    
    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, [sessionId, sessionData?.isFirstVisitor, sessionData?.isComplete, checkSession]);

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return '0 km';
    return `${distance.toLocaleString()} km`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading session data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg text-center">
            <h2 className="text-red-700 dark:text-red-300 text-xl font-bold mb-2">Session Error</h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Link 
              href="/ipdistance"
              className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t('back_to_ipdistance')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // IP distance calculation completed
  if (sessionData?.isComplete && sessionData?.firstIP && sessionData?.secondIP) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <Script
          id="ip-distance-results-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Dataset',
              name: 'IP Distance Calculation',
              description: `Distance between IP addresses from ${sessionData.firstIP.city} and ${sessionData.secondIP.city}`,
              keywords: ['IP distance', 'geolocation', 'IP tracking']
            })
          }}
        />
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('results_title')}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t('results_description')}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
              <h2 className="text-white text-xl font-bold text-center">
                {t('distance_label')} {formatDistance(sessionData.distance)}
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <h3 className="font-medium text-lg mb-3 text-gray-900 dark:text-white">{t('ip1_location')}</h3>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p><span className="font-medium">{t('ip_label')}</span> {sessionData.firstIP.ip}</p>
                    <p><span className="font-medium">{t('city_label')}</span> {sessionData.firstIP.city}</p>
                    <p><span className="font-medium">{t('region_label')}</span> {sessionData.firstIP.regionName}</p>
                    <p><span className="font-medium">{t('country_label')}</span> {sessionData.firstIP.country} ({sessionData.firstIP.countryCode})</p>
                    <p><span className="font-medium">{t('coordinates_label')}</span> {sessionData.firstIP.lat}, {sessionData.firstIP.lon}</p>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <h3 className="font-medium text-lg mb-3 text-gray-900 dark:text-white">{t('ip2_location')}</h3>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p><span className="font-medium">{t('ip_label')}</span> {sessionData.secondIP.ip}</p>
                    <p><span className="font-medium">{t('city_label')}</span> {sessionData.secondIP.city}</p>
                    <p><span className="font-medium">{t('region_label')}</span> {sessionData.secondIP.regionName}</p>
                    <p><span className="font-medium">{t('country_label')}</span> {sessionData.secondIP.country} ({sessionData.secondIP.countryCode})</p>
                    <p><span className="font-medium">{t('coordinates_label')}</span> {sessionData.secondIP.lat}, {sessionData.secondIP.lon}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  href="/ipdistance"
                  className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('calculate_another')}
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>{t('session_expires_at')} {formatTime(sessionData.expiresAt)}</p>
            <p className="mt-1">{t('distance_calculated_using')}</p>
          </div>
        </div>
      </div>
    );
  }

  // First visitor waiting for second visitor
  if (sessionData?.isFirstVisitor) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('session_title')}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t('session_description')}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-md mb-6">
              <p className="text-blue-800 dark:text-blue-200 font-medium">{sessionData.message}</p>
              <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                {t('session_expires_at')} {formatTime(sessionData.expiresAt)}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">{t('share_heading')}</h3>
                <div className="border border-gray-300 dark:border-gray-700 rounded-md flex overflow-hidden">
                  <input
                    type="text"
                    value={window.location.href}
                    readOnly
                    className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 border-none outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    className="px-4 font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    {t('copy')}
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">{t('status_heading')}</h3>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>{t('waiting_for_visitor')}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {t('ip_registered')}
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  {t('auto_updates')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href="/ipdistance"
              className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t('back_to_ipdistance')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Second visitor
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('calculating_title')}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t('session_description')}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-md mb-6">
            <p className="text-green-800 dark:text-green-200 font-medium">{sessionData?.message || t('processing_request')}</p>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
          
          <p className="text-center text-gray-600 dark:text-gray-400">
            {t('please_wait')}
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/ipdistance"
            className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {t('back_to_ipdistance')}
          </Link>
        </div>
      </div>
    </div>
  );
} 