'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import SpeedTest from './SpeedTest';

export default function SpeedTestContent() {
  const t = useTranslations('speedtest')
  
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{t('page_title')}</h1>
        <Link 
          href={`/${useLocale()}`}
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
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
        {t('page_description')}
      </p>
      <SpeedTest />
    </>
  )
} 