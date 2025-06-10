import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

// 直接定义默认语言
const defaultLocale = 'en';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ipcheck.tools'),
  title: "IP Check - Free IP Address Lookup Tool & Network Speed Test",
  description: "Free IP address lookup and network speed test tools. Get detailed information about any IP address and measure your internet connection speed. No registration required.",
  keywords: "IP lookup, IP checker, network speed test, internet speed test, bandwidth test, IP geolocation, IP information, IP address lookup, IP address checker, IP location finder",
  authors: [{ name: "IP Check Tool" }],
  creator: "IP Check Tool",
  publisher: "IP Check Tool",
  openGraph: {
    title: "IP Check - Free IP Address Lookup Tool & Network Speed Test",
    description: "Get detailed information about any IP address and measure your internet connection speed with our free online tools.",
    type: "website",
    locale: "en_US",
    siteName: "IP Check Tools",
    images: [{
      url: 'https://ipcheck.tools/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'IP Check Tools - IP Lookup and Speed Test'
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "IP Check - Free IP Address Lookup Tool & Network Speed Test",
    description: "Get detailed information about any IP address and measure your internet connection speed with our free online tools.",
    images: ['https://ipcheck.tools/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code', // 需要替换成实际的验证码
  },
  alternates: {
    canonical: 'https://ipcheck.tools/en',
    languages: {
      'en': 'https://ipcheck.tools/en',
      'zh': 'https://ipcheck.tools/zh',
      'zh-Hant': 'https://ipcheck.tools/zh-Hant',
      'x-default': 'https://ipcheck.tools/en'
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
    ],
  },
};

// 修改后的根布局组件，不再强制服务器端重定向
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLocale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* 规范链接标签，将根路径指向英语版本 */}
        <link rel="canonical" href="https://ipcheck.tools/en" />
        {/* hreflang links */}
        <link rel="alternate" href="https://ipcheck.tools/en" hrefLang="en" />
        <link rel="alternate" href="https://ipcheck.tools/zh" hrefLang="zh" />
        <link rel="alternate" href="https://ipcheck.tools/zh-Hant" hrefLang="zh-Hant" />
        <link rel="alternate" href="https://ipcheck.tools/en" hrefLang="x-default" />
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4921416661260152"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Inject homepage structured data once */}
        <script
          id="homepage-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: 'IP Check Tools',
                applicationCategory: 'UtilityApplication',
                description: 'Free IP address lookup and network speed test tools providing detailed information about IP addresses and connection speeds.',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD'
                },
                operatingSystem: 'Any',
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.8',
                  ratingCount: '256',
                  bestRating: '5',
                  worstRating: '1'
                },
                featureList: [
                  'IP Address Lookup',
                  'Geolocation Information',
                  'ISP Details',
                  'Organization Information',
                  'Timezone Data',
                  'Network Speed Test',
                  'Download Speed Measurement',
                  'Upload Speed Measurement',
                  'IP Distance Calculator'
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'How does the IP Lookup tool work?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Our IP lookup tool uses geolocation databases to provide detailed information about any IP address, including geographical location, ISP, organization, and timezone.'
                    }
                  },
                  {
                    '@type': 'Question',
                    name: 'Is the Network Speed Test free to use?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes, our Network Speed Test is completely free to use. No registration or subscription is required.'
                    }
                  }
                ]
              }
            ])
          }}
        />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
