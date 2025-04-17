'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n';

import type { IPInfo } from '@/types/ip';
import { Advertisement } from '@/components/Advertisement';


// JSON-LD 结构化数据
function generateStructuredData() {
  // Web应用结构化数据
  const webApplication = {
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
    hasPart: [
      {
        '@type': 'WebApplication',
        'name': 'Network Speed Test',
        'applicationCategory': 'UtilityApplication',
        'description': 'Test your network download and upload speeds with our free speed test tool. No registration required.',
        'url': 'https://ipcheck.tools/speedtest',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      },
      {
        '@type': 'WebApplication',
        'name': 'IP Distance Calculator',
        'applicationCategory': 'UtilityApplication',
        'description': 'Calculate the geographical distance between two IP addresses. Generate a unique link and invite someone to discover the distance between your locations.',
        'url': 'https://ipcheck.tools/ipdistance',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      }
    ]
  };

  // 组织结构化数据
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IP Check Tools',
    url: 'https://ipcheck.tools',
    logo: 'https://ipcheck.tools/logo.png',
    description: 'Provider of free IP address lookup and network testing tools.',
    sameAs: [
      'https://twitter.com/ipchecktools',
      'https://github.com/kynliebolles/ipcheck'
    ]
  };

  // 面包屑导航结构化数据
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ipcheck.tools'
      }
    ]
  };

  // FAQ结构化数据
  const faq = {
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
      },
      {
        '@type': 'Question',
        name: 'How accurate is the IP location information?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The location information is generally accurate to the city level. However, exact precision can vary based on how ISPs assign IP addresses and update their information.'
        }
      },
      {
        '@type': 'Question',
        name: 'What factors can affect my speed test results?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Multiple factors can affect speed test results, including your current network traffic, Wi-Fi signal strength, server load, and the device you are using.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does the IP Distance feature work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our IP Distance tool creates a unique link that you share with another person. When both of you visit the link, we calculate the geographical distance between your IP locations using geolocation databases and the Haversine formula.'
        }
      }
    ]
  };

  return [webApplication, organization, breadcrumb, faq];
}

export default function RootPage() {
  // 防止无限重定向循环的状态标志
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    // 已经在重定向过程中，不再执行重定向逻辑
    if (isRedirecting) return;
    
    // 检查当前URL，如果已经包含语言前缀，则不再重定向
    const currentPath = window.location.pathname;
    // 检查是否已经有语言前缀，如/en, /zh, /zh-Hant
    if (locales.some(locale => currentPath === `/${locale}` || currentPath.startsWith(`/${locale}/`))) {
      return;
    }
    
    setIsRedirecting(true);
    
    // 获取浏览器语言
    const navigatorLang = navigator.language.toLowerCase();
    
    // 检查是否有完全匹配的区域设置（例如 zh-hant）
    const fullLocaleMatch = locales.find(l => 
      l.toLowerCase() === navigatorLang || 
      l.toLowerCase().replace('-', '') === navigatorLang.replace('-', '')
    );
    
    // 如果有完全匹配，重定向到该区域设置
    if (fullLocaleMatch) {
      window.location.href = `/${fullLocaleMatch}${currentPath === '/' ? '' : currentPath}`;
      return;
    }
    
    // 否则检查是否有部分匹配（例如 'zh-CN' 中的 'zh'）
    const partialLocaleMatch = locales.find(l => 
      navigatorLang.startsWith(l.toLowerCase())
    );
    
    // 如果有部分匹配，重定向到该区域设置
    if (partialLocaleMatch) {
      window.location.href = `/${partialLocaleMatch}${currentPath === '/' ? '' : currentPath}`;
      return;
    }
    
    // 默认回退
    window.location.href = `/${defaultLocale}${currentPath === '/' ? '' : currentPath}`;
  }, [isRedirecting]);
  
  // 简单的加载指示
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}
