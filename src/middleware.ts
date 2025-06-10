import createMiddleware from 'next-intl/middleware';

// 直接定义语言，不再从i18n导入，避免循环依赖
const locales = ['en', 'zh', 'zh-Hant'];
const defaultLocale = 'en';

// 使用简化的中间件配置
export default createMiddleware({
  // Locales supported by the application
  locales,
  // Default locale used when no locale matches
  defaultLocale,
  // Always show the locale prefix in the URL
  localePrefix: 'always'
});

// Export locales for other files to use
export { locales, defaultLocale };

// Match all paths except for
// - API routes (/api/*)
// - Next.js internal routes (/_next/*)
// - Files (files with an extension)
export const config = {
  matcher: [
    // Match all paths except for specific patterns
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match the root path
    '/'
  ]
}; 