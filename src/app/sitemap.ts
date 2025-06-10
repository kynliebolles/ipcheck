import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ipcheck.tools'
  const locales = ['en', 'zh', 'zh-Hant']
  const pages = ['', 'speedtest', 'ipdistance', 'privacy']
  
  const sitemap: MetadataRoute.Sitemap = []
  
  // 为每个页面和语言组合创建sitemap条目
  for (const page of pages) {
    for (const locale of locales) {
      const url = page ? `${baseUrl}/${locale}/${page}` : `${baseUrl}/${locale}`
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: locales.reduce((acc, loc) => {
            const altUrl = page ? `${baseUrl}/${loc}/${page}` : `${baseUrl}/${loc}`
            acc[loc] = altUrl
            return acc
          }, {} as Record<string, string>)
        }
      })
    }
  }
  
  return sitemap
} 