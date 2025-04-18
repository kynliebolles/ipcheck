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
}

module.exports = withNextIntl(nextConfig); 