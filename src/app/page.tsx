import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// 直接定义支持的语言，避免导入错误
const locales = ['en', 'zh', 'zh-Hant'];
const defaultLocale = 'en';

function getPreferredLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale;
  
  // 解析Accept-Language头
  const langs = acceptLanguage
    .split(',')
    .map(lang => {
      const parts = lang.trim().split(';');
      const code = parts[0].toLowerCase();
      const q = parts[1] ? parseFloat(parts[1].split('=')[1]) : 1;
      return { code, q };
    })
    .sort((a, b) => b.q - a.q);
  
  // 查找最佳匹配
  for (const { code } of langs) {
    // 完全匹配
    const fullMatch = locales.find(l => 
      l.toLowerCase() === code || 
      l.toLowerCase().replace('-', '') === code.replace('-', '')
    );
    if (fullMatch) return fullMatch;
    
    // 部分匹配（例如 zh-CN 匹配 zh）
    const partialMatch = locales.find(l => 
      code.startsWith(l.toLowerCase())
    );
    if (partialMatch) return partialMatch;
  }
  
  return defaultLocale;
}

export default async function RootPage() {
  // 获取Accept-Language头
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  
  // 根据浏览器语言偏好选择语言
  const preferredLocale = getPreferredLocale(acceptLanguage);
  
  // 服务器端重定向到首选语言版本
  redirect(`/${preferredLocale}`);
}
