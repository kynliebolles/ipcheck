import { Metadata } from 'next'
import Link from 'next/link'
import SpeedTest from '../../components/SpeedTest'

export const metadata: Metadata = {
  title: 'Free Network Speed Test - Check Your Internet Speed | IP Lookup',
  description: 'Test your internet connection speed with our free online speed test tool. Measure download and upload speeds instantly. No registration required.',
  keywords: 'speed test, network speed test, internet speed test, bandwidth test, download speed, upload speed, free speed test',
  openGraph: {
    title: 'Free Network Speed Test - Check Your Internet Speed',
    description: 'Test your internet connection speed with our free online speed test tool. Measure download and upload speeds instantly.',
    type: 'website',
    url: 'https://ipcheck.tools/speedtest',
  },
  alternates: {
    canonical: 'https://ipcheck.tools/speedtest'
  }
}

// 定义结构化数据
function generateSpeedTestStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Network Speed Test Tool',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    description: 'Free online speed test tool to measure your internet connection speed. Check your download and upload speeds instantly.',
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
      name: 'Internet Speed Test',
      applicationCategory: 'UtilityApplication'
    }
  };
}

export default function SpeedTestPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSpeedTestStructuredData())
        }}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Network Speed Test</h1>
        <Link 
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
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
          <span>Back to Home</span>
        </Link>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
        Test your internet connection speed with our free online tool. Get accurate measurements of your download and upload speeds.
      </p>
      <SpeedTest />
    </main>
  )
}
