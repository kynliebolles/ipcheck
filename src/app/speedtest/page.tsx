import { Metadata } from 'next'
import SpeedTest from '../../components/SpeedTest'

export const metadata: Metadata = {
  title: 'Speed Test - IP Lookup',
  description: 'Online speed test tool to measure your download and upload speeds',
}

export default function SpeedTestPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Speed Test</h1>
      <SpeedTest />
    </main>
  )
}
