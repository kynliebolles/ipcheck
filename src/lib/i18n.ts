import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define the supported locales
export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is supported
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Load messages for the requested locale
  const messages = (await import(`../messages/${locale}/common.json`)).default;

  return {
    locale: locale as string,
    messages
  };
}); 