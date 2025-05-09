'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

// Default speed test server
const DEFAULT_SERVER = { id: 'default', name: 'Default Server', url: '/api/speedtest' }

export default function SpeedTest() {
  const t = useTranslations('speedtest')
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null)
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null)
  const [testing, setTesting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [pingResult, setPingResult] = useState<number | null>(null)
  const [latestResults, setLatestResults] = useState<{download: number[], upload: number[]}>({
    download: [],
    upload: []
  })

  const formatSpeed = (speed: number | null) => {
    if (speed === null) return '- Mbps'
    if (speed < 1) return `${(speed * 1000).toFixed(1)} Kbps`
    return `${speed.toFixed(1)} Mbps`
  }

  const getBroadbandEquivalent = (speed: number | null) => {
    if (speed === null) return ''
    
    if (speed < 1) return t('slower_than_basic')
    if (speed < 5) return t('basic_dsl')
    if (speed < 25) return t('standard_broadband')
    if (speed < 100) return t('fast_broadband')
    if (speed < 250) return t('fiber_broadband')
    if (speed < 500) return t('high_speed_fiber')
    if (speed < 1000) return t('premium_fiber')
    return t('gigabit_plus')
  }

  // Test latency
  const testPing = async () => {
    try {
      const startTime = performance.now()
      await fetch(`${DEFAULT_SERVER.url}/download?size=10240`)
      const endTime = performance.now()
      return endTime - startTime
    } catch (error) {
      console.error('Ping test failed:', error)
      return 999
    }
  }

  const testDownloadSpeed = async () => {
    // Use different file sizes for more accurate results
    const fileSizes = [5, 10, 20].map(mb => mb * 1024 * 1024) // 5MB, 10MB, 20MB
    const results: number[] = []
    
    try {
      // Perform a small file test as warm-up
      await fetch(`${DEFAULT_SERVER.url}/download?size=512000`)
      
      // Test different file sizes in sequence
      for (let i = 0; i < fileSizes.length; i++) {
        setProgress(10 + (i * 10))
        const fileSize = fileSizes[i]
        
        const startTime = performance.now()
        
        // Use parallel connections
        const connections = 3 // Number of parallel connections
        const promises = []
        const chunkSize = Math.floor(fileSize / connections)
        
        for (let j = 0; j < connections; j++) {
          const promise = fetch(`${DEFAULT_SERVER.url}/download?size=${chunkSize}&cache=${Date.now()}-${j}`)
            .then(res => res.blob())
          promises.push(promise)
        }
        
        await Promise.all(promises)
        const endTime = performance.now()
        
        const durationInSeconds = (endTime - startTime) / 1000
        const speedMbps = (fileSize / durationInSeconds / (1024 * 1024)) * 8
        results.push(speedMbps)
      }
      
      // Calculate the average of the last two measurements (excluding the warm-up)
      const validResults = results.slice(1)
      const averageSpeed = validResults.reduce((sum, speed) => sum + speed, 0) / validResults.length
      
      // Update history
      setLatestResults(prev => ({
        ...prev,
        download: [...prev.download, averageSpeed].slice(-5) // Keep last 5 results
      }))
      
      return averageSpeed
    } catch (error) {
      console.error('Download test failed:', error)
      return 0
    }
  }

  const testUploadSpeed = async () => {
    // Use different file sizes for more accurate results
    const fileSizes = [2, 5, 10].map(mb => mb * 1024 * 1024) // 2MB, 5MB, 10MB
    const results: number[] = []
    
    try {
      // Warm-up
      const warmupData = new Blob([new ArrayBuffer(256 * 1024)])
      const warmupForm = new FormData()
      warmupForm.append('file', warmupData)
      await fetch(`${DEFAULT_SERVER.url}/upload`, {
        method: 'POST',
        body: warmupForm,
      })
      
      // Test different file sizes in sequence
      for (let i = 0; i < fileSizes.length; i++) {
        setProgress(50 + (i * 10))
        const fileSize = fileSizes[i]
        
        // Use parallel connections
        const connections = 2 // 2 parallel connections for upload
        const chunkSize = Math.floor(fileSize / connections)
        const promises = []
        
        const startTime = performance.now()
        
        for (let j = 0; j < connections; j++) {
          const testData = new Blob([new ArrayBuffer(chunkSize)])
          const formData = new FormData()
          formData.append('file', testData)
          
          const promise = fetch(`${DEFAULT_SERVER.url}/upload`, {
            method: 'POST',
            body: formData,
          })
          promises.push(promise)
        }
        
        await Promise.all(promises)
        const endTime = performance.now()
        
        const durationInSeconds = (endTime - startTime) / 1000
        const speedMbps = (fileSize / durationInSeconds / (1024 * 1024)) * 8
        results.push(speedMbps)
      }
      
      // Calculate the average of the last two measurements
      const validResults = results.slice(1)
      const averageSpeed = validResults.reduce((sum, speed) => sum + speed, 0) / validResults.length
      
      // Update history
      setLatestResults(prev => ({
        ...prev,
        upload: [...prev.upload, averageSpeed].slice(-5) // Keep last 5 results
      }))
      
      return averageSpeed
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
    setPingResult(null)
    
    // Test network latency
    setProgress(5)
    const pingResult = await testPing()
    setPingResult(pingResult)

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

  // Calculate average results (if history exists)
  const getAverageResult = (type: 'download' | 'upload') => {
    const results = latestResults[type]
    if (results.length === 0) return null
    
    const sum = results.reduce((acc, val) => acc + val, 0)
    return sum / results.length
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border border-gray-800 rounded-lg p-4 sm:p-6 mb-6">
        {/* Latency display */}
        {pingResult !== null && (
          <div className="text-center mb-4 p-3 border border-gray-800 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">{t('latency')}</div>
            <div className="text-xl font-bold">
              {pingResult < 1000 ? `${Math.round(pingResult)}ms` : t('timeout')}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="text-center p-3 sm:p-4 border border-gray-800 rounded-lg">
            <div className="text-gray-400 text-sm sm:text-base mb-1 sm:mb-2">{t('download_speed')}</div>
            <div className="text-2xl sm:text-3xl font-bold">{formatSpeed(downloadSpeed)}</div>
            {downloadSpeed !== null && (
              <div className="text-gray-400 text-xs mt-2">{getBroadbandEquivalent(downloadSpeed)}</div>
            )}
            {latestResults.download.length > 1 && (
              <div className="text-gray-500 text-xs mt-1">
                {t('average')}: {formatSpeed(getAverageResult('download'))}
              </div>
            )}
          </div>
          <div className="text-center p-3 sm:p-4 border border-gray-800 rounded-lg">
            <div className="text-gray-400 text-sm sm:text-base mb-1 sm:mb-2">{t('upload_speed')}</div>
            <div className="text-2xl sm:text-3xl font-bold">{formatSpeed(uploadSpeed)}</div>
            {uploadSpeed !== null && (
              <div className="text-gray-400 text-xs mt-2">{getBroadbandEquivalent(uploadSpeed)}</div>
            )}
            {latestResults.upload.length > 1 && (
              <div className="text-gray-500 text-xs mt-1">
                {t('average')}: {formatSpeed(getAverageResult('upload'))}
              </div>
            )}
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
        
        <div className="text-center">
          <button
            onClick={startTest}
            disabled={testing}
            className={`px-5 py-3 rounded-md text-base font-medium transition duration-150 ${
              testing
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {testing ? t('testing') : t('start_test')}
          </button>
        </div>
        
        <div className="mt-5 text-xs text-gray-500 text-center">
          <p>{t('privacy_notice')}</p>
        </div>
      </div>
    </div>
  )
}
