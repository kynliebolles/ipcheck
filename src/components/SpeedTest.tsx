'use client'

import { useState } from 'react'

export default function SpeedTest() {
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null)
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null)
  const [testing, setTesting] = useState(false)
  const [progress, setProgress] = useState(0)

  const formatSpeed = (speed: number | null) => {
    if (speed === null) return '- Mbps'
    if (speed < 1) return `${(speed * 1000).toFixed(1)} Kbps`
    return `${speed.toFixed(1)} Mbps`
  }

  const testDownloadSpeed = async () => {
    const startTime = performance.now()
    const fileSize = 5 * 1024 * 1024 // 5MB test file
    try {
      const response = await fetch(`/api/speedtest/download?size=${fileSize}`)
      await response.blob()
      const endTime = performance.now()
      const durationInSeconds = (endTime - startTime) / 1000
      const speedMbps = (fileSize / durationInSeconds / (1024 * 1024)) * 8
      return speedMbps
    } catch (error) {
      console.error('Download test failed:', error)
      return 0
    }
  }

  const testUploadSpeed = async () => {
    const startTime = performance.now()
    const fileSize = 2 * 1024 * 1024 // 2MB test file
    const testData = new Blob([new ArrayBuffer(fileSize)])
    
    try {
      const formData = new FormData()
      formData.append('file', testData)
      
      await fetch('/api/speedtest/upload', {
        method: 'POST',
        body: formData,
      })
      
      const endTime = performance.now()
      const durationInSeconds = (endTime - startTime) / 1000
      const speedMbps = (fileSize / durationInSeconds / (1024 * 1024)) * 8
      return speedMbps
    } catch (error) {
      console.error('Upload test failed:', error)
      return 0
    }
  }

  const startTest = async () => {
    setTesting(true)
    setProgress(0)
    setDownloadSpeed(null)
    setUploadSpeed(null)

    // Test download speed
    setProgress(10)
    const downloadResult = await testDownloadSpeed()
    setDownloadSpeed(downloadResult)
    
    setProgress(50)
    
    // Test upload speed
    const uploadResult = await testUploadSpeed()
    setUploadSpeed(uploadResult)
    
    setProgress(100)
    setTesting(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border border-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 border border-gray-800 rounded-lg">
            <div className="text-gray-400 mb-2">Download Speed</div>
            <div className="text-3xl font-bold">{formatSpeed(downloadSpeed)}</div>
          </div>
          <div className="text-center p-4 border border-gray-800 rounded-lg">
            <div className="text-gray-400 mb-2">Upload Speed</div>
            <div className="text-3xl font-bold">{formatSpeed(uploadSpeed)}</div>
          </div>
        </div>
        
        {testing && (
          <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
            <div 
              className="bg-white h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button
          onClick={startTest}
          disabled={testing}
          className={`w-full py-3 px-4 rounded-md transition-all ${
            testing
              ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {testing ? 'Testing...' : 'Start Test'}
        </button>
      </div>

      <div className="text-gray-400 text-sm">
        <h2 className="font-bold mb-2">About Speed Test</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>The test will generate some data traffic. We recommend using a WiFi connection.</li>
          <li>Results may vary depending on network conditions and server load.</li>
          <li>For more accurate results, try running multiple tests and take the average.</li>
        </ul>
      </div>
    </div>
  )
}
