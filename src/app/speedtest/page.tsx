import { Metadata } from 'next'
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

export default function SpeedTestPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Network Speed Test</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
        Test your internet connection speed with our free online tool. Get accurate measurements of your download and upload speeds.
      </p>
      <SpeedTest />
    </main>
  )
}
