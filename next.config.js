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
  // 添加重定向规则来解决SEO问题
  async redirects() {
    return [
      // 将没有语言前缀的speedtest重定向到英语版本
      {
        source: '/speedtest',
        destination: '/en/speedtest',
        permanent: true, // 301重定向
      },
      // 将没有语言前缀的ipdistance重定向到英语版本
      {
        source: '/ipdistance',
        destination: '/en/ipdistance',
        permanent: true,
      },
      // 将没有语言前缀的privacy重定向到英语版本
      {
        source: '/privacy',
        destination: '/en/privacy',
        permanent: true,
      },
    ];
  },
  // 添加headers来确保正确的缓存和SEO设置
  async headers() {
    return [
      {
        // 为所有页面添加安全和SEO headers
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = withNextIntl(nextConfig); 