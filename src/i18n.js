import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// 直接定义支持的语言，避免循环导入
export const locales = ['en', 'zh', 'zh-Hant'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is supported
  if (!locales.includes(locale)) {
    notFound();
  }

  try {
    // 尝试两种可能的路径加载翻译文件
    let messages;
    try {
      // 首先尝试从 ./messages/${locale}/common.json 加载
      messages = (await import(`./messages/${locale}/common.json`)).default;
    } catch {
      // 如果失败，尝试从 ./messages/${locale}.json 加载
      messages = (await import(`./messages/${locale}.json`)).default;
    }

    return {
      locale,
      messages,
    };
  } catch (error) {
    console.error('Failed to load messages:', error);
    // 加载失败时返回空对象而不是 404，避免整个应用崩溃
    return {
      locale,
      messages: {}
    };
  }
});