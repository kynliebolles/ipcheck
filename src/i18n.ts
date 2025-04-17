import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Define the locales and make them directly importable
export const locales = ['en', 'zh', 'zh-Hant'];
export const defaultLocale = 'en';

// This is a function to get messages
export async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    return {};
  }
}

// Default export for next-intl's config
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is supported
  if (locale && !locales.includes(locale)) {
    notFound();
  }

  // Load messages for the requested locale
  return {
    locale: locale || defaultLocale,
    messages: (await import(`@/messages/${locale || defaultLocale}.json`)).default
  };
}); 