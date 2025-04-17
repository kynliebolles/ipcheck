import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

// 直接定义语言，不再从i18n导入，避免循环依赖
const locales = ['en', 'zh', 'zh-Hant'];
const defaultLocale = 'en';

// 防止无限重定向循环的检测函数
function isRedirectLoop(request: NextRequest): boolean {
  // 获取请求的 URL
  const url = request.nextUrl.clone();
  
  // 检查 Referer 头，如果存在
  const referer = request.headers.get('referer');
  if (!referer) return false;
  
  try {
    // 解析 Referer URL
    const refererUrl = new URL(referer);
    const currentPath = url.pathname;
    const refererPath = refererUrl.pathname;
    
    // 如果当前路径和引用路径相同，可能是重定向循环
    if (currentPath === refererPath) {
      return true;
    }
    
    // 检查循环重定向模式，例如 A->B->A
    const redirectCount = parseInt(request.headers.get('x-redirect-count') || '0');
    if (redirectCount > 5) { // 设置一个合理的阈值
      return true;
    }
  } catch (_) { // 使用下划线表示有意忽略的变量
    // 解析 URL 错误，忽略
    return false;
  }
  
  return false;
}

// Create the middleware
const intlMiddleware = createMiddleware({
  // Locales supported by the application
  locales,
  // Default locale used when no locale matches
  defaultLocale,
  // Always show the locale prefix in the URL
  localePrefix: 'always'
});

// Export a middleware function that wraps the intl middleware
export default function middleware(request: NextRequest) {
  // 首先检查是否存在重定向循环
  if (isRedirectLoop(request)) {
    console.warn('Detected redirect loop, bypassing language middleware');
    // 如果检测到重定向循环，直接返回请求而不修改
    return NextResponse.next();
  }
  
  // 获取当前 URL
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  
  // 如果路径已经有有效的区域设置前缀，直接使用国际化中间件
  if (locales.some(locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) {
    return intlMiddleware(request);
  }
  
  // 没有区域设置前缀的路径，添加重定向计数头
  const response = intlMiddleware(request);
  
  if (response.headers.get('Location')) {
    // 这是一个重定向，增加计数
    const redirectCount = parseInt(request.headers.get('x-redirect-count') || '0');
    response.headers.set('x-redirect-count', (redirectCount + 1).toString());
  }
  
  return response;
}

// Export locales for other files to use
export { locales, defaultLocale };

// Match all paths except for
// - API routes (/api/*)
// - Next.js internal routes (/_next/*)
// - Files (files with an extension)
export const config = {
  // Define the matcher for Next.js
  matcher: [
    // Match all paths except for specific patterns
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match the root path
    '/'
  ]
}; 