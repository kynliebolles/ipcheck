import { getTranslations, getLocale } from 'next-intl/server';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// Define the routes for your application
export const pathnames = {
  '/': '/',
  '/speedtest': '/speedtest',
  '/ipdistance/[sessionId]': '/ipdistance/[sessionId]',
  '/privacy': '/privacy'
} as const;

// Create navigation functions
export const { Link, redirect, useRouter, usePathname } =
  createNavigation({ locales, pathnames });

// Export utility functions to be used in your components/pages
export async function getI18n(namespace?: string) {
  return getTranslations(namespace);
}

export async function getCurrentLocale() {
  return getLocale();
} 