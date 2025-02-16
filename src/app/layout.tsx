import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IP Check - Free IP Address Lookup Tool",
  description: "Free IP address lookup tool. Get detailed information about any IP address including location, ISP, timezone, and organization. Check your own IP or lookup any IP address.",
  keywords: "IP lookup, IP checker, IP address details, IP geolocation, IP information, IP address lookup, IP address checker, IP location finder",
  authors: [{ name: "IP Check Tool" }],
  creator: "IP Check Tool",
  publisher: "IP Check Tool",
  openGraph: {
    title: "IP Check - Free IP Address Lookup Tool",
    description: "Get detailed information about any IP address including location, ISP, timezone, and organization.",
    type: "website",
    locale: "en_US",
    siteName: "IP Check Tool",
  },
  twitter: {
    card: "summary_large_image",
    title: "IP Check - Free IP Address Lookup Tool",
    description: "Get detailed information about any IP address including location, ISP, timezone, and organization.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
