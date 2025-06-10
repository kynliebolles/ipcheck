import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import "../globals.css";

// 直接定义支持的语言，避免导入错误
const locales = ['en', 'zh', 'zh-Hant'];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  // 根据语言设置不同的title和description
  const titles = {
    en: "IP Check - Free IP Address Lookup Tool & Network Speed Test",
    zh: "IP查询 - 免费IP地址查询工具和网络测速",
    'zh-Hant': "IP查詢 - 免費IP地址查詢工具和網路測速"
  };
  
  const descriptions = {
    en: "Free IP address lookup and network speed test tools. Get detailed information about any IP address and measure your internet connection speed. No registration required.",
    zh: "免费的IP地址查询和网络测速工具。获取任何IP地址的详细信息，测量您的网络连接速度。无需注册。",
    'zh-Hant': "免費的IP地址查詢和網路測速工具。獲取任何IP地址的詳細資訊，測量您的網路連線速度。無需註冊。"
  };

  const currentTitle = titles[locale as keyof typeof titles] || titles.en;
  const currentDescription = descriptions[locale as keyof typeof descriptions] || descriptions.en;
  
  return {
    metadataBase: new URL('https://ipcheck.tools'),
    title: currentTitle,
    description: currentDescription,
    keywords: "IP lookup, IP checker, network speed test, internet speed test, bandwidth test, IP geolocation, IP information, IP address lookup, IP address checker, IP location finder",
    authors: [{ name: "IP Check Tool" }],
    creator: "IP Check Tool",
    publisher: "IP Check Tool",
    openGraph: {
      title: currentTitle,
      description: currentDescription,
      type: "website",
      locale: locale === 'zh' ? 'zh_CN' : locale === 'zh-Hant' ? 'zh_TW' : 'en_US',
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
      title: currentTitle,
      description: currentDescription,
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
      google: 'your-google-site-verification-code',
    },
    alternates: {
      canonical: `https://ipcheck.tools/${locale}`,
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
}

export function generateStaticParams() {
  return locales.map((locale: string) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    // 如果无法加载消息文件，则跳转到404页面
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* 为每个语言版本设置正确的canonical URL */}
        <link rel="canonical" href={`https://ipcheck.tools/${locale}`} />
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
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="fixed bottom-4 right-4 z-40">
            <LanguageSwitcher />
          </div>
          <GoogleAnalytics />
          {children}
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
