import createNextIntlPlugin from 'next-intl/plugin';

// 创建 next-intl 插件，指定 i18n 配置文件路径
// 注意：这里使用的是相对路径，不是绝对路径
const withNextIntl = createNextIntlPlugin('./src/i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 禁用静态资源前缀，避免路径冲突
  assetPrefix: '',
  
  // 启用实验性功能，支持 App Router 国际化
  experimental: {
    // 启用 App Router 国际化
    appDocumentPreloading: true,
  },
  
  // 确保静态资源正确加载
  // 使用 any 类型避免 TypeScript 错误
  webpack: (config: any) => {
    return config;
  },
  
  // 添加这个配置以确保静态资源可以从国际化路径下访问
  // 这将确保 /en/_next/static/... 路径可以正确解析
  skipMiddlewareUrlNormalize: true,
  
  // 确保静态资源可以在所有路径下访问
  skipTrailingSlashRedirect: true,
  
  // 添加静态资源处理配置，确保 favicon 等资源可以正确加载
  images: {
    domains: ['localhost'],
  },
  
  // 添加这个配置以确保静态资源可以被正确访问
  // 尤其是在使用国际化路由时
  trailingSlash: false,
};

export default withNextIntl(nextConfig);
