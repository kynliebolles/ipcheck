'use client';

import { useState, useEffect } from 'react';

// 直接定义支持的语言，避免导入错误
const locales = ['en', 'zh', 'zh-Hant'];
const defaultLocale = 'en';


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
