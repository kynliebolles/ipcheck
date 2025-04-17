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
    google: 'your-google-site-verification-code', // Need to replace with actual verification code
  },
  alternates: {
    canonical: 'https://ipcheck.tools'
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
