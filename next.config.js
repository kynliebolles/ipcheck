/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  // This is the default, so you can remove it if you want
  './src/i18n.ts'
);

const nextConfig = {
  experimental: {
    turbo: {
      // This can be safely removed if not needed
      resolveAlias: {
        // Add any aliasing if needed
      },
    },
  },
  // Configure image domains if you use next/image with external sources
  images: {
    domains: [],
  },
  // 注意：HTTP 到 HTTPS 的重定向应该在服务器层面处理（Nginx/Apache/Cloudflare 等）
  // Next.js 的重定向在应用层面，可能会导致循环
  // 这里我们移除了重定向配置，避免循环问题
  /*
  async redirects() {
    return [];
  },
  */
}

module.exports = withNextIntl(nextConfig); 