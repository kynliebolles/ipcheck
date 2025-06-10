import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ipcheck.tools'
  const locales = ['en', 'zh', 'zh-Hant']
  
  // 为不同页面设置不同的配置
  const pages = [
    { 
      path: '', 
      priority: 1.0, 
      changeFrequency: 'daily' as const,
      lastModified: new Date() 
    },
    { 
      path: 'speedtest', 
      priority: 0.9, 
      changeFrequency: 'weekly' as const,
      lastModified: new Date() 
    },
    { 
      path: 'ipdistance', 
      priority: 0.8, 
      changeFrequency: 'weekly' as const,
      lastModified: new Date() 
    },
    { 
      path: 'privacy', 
      priority: 0.5, 
      changeFrequency: 'monthly' as const,
      lastModified: new Date() 
    }
  ]
  
  const sitemap: MetadataRoute.Sitemap = []
  
  // 为每个页面和语言组合创建sitemap条目
  for (const page of pages) {
    for (const locale of locales) {
      const url = page.path ? `${baseUrl}/${locale}/${page.path}` : `${baseUrl}/${locale}`
      
      // 创建所有语言的备选链接
      const languageAlternates = locales.reduce((acc, loc) => {
        const altUrl = page.path ? `${baseUrl}/${loc}/${page.path}` : `${baseUrl}/${loc}`
        acc[loc] = altUrl
        return acc
      }, {} as Record<string, string>)
      
      // 添加x-default指向英语版本
      languageAlternates['x-default'] = page.path ? `${baseUrl}/en/${page.path}` : `${baseUrl}/en`
      
      sitemap.push({
        url,
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: languageAlternates
        }
      })
    }
  }
  
  return sitemap
} 