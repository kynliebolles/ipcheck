'use client';

import { usePathname, useRouter } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';

// Define locales directly to avoid import issues
const locales = ['en', 'zh', 'zh-Hant'];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: e.target.value });
  };

  return (
    <div className="flex items-center space-x-2 z-50">
      <select 
        value={locale} 
        onChange={handleChange}
        className="bg-black text-white border border-gray-700 rounded px-2 py-1 text-sm hover:border-gray-500 transition-colors shadow-md"
      >
        {locales.map((loc: string) => (
          <option key={loc} value={loc}>
            {loc === 'en' 
              ? t('language.en') 
              : loc === 'zh' 
                ? t('language.zh') 
                : t('language.zh-Hant')}
          </option>
        ))}
      </select>
    </div>
  );
} 