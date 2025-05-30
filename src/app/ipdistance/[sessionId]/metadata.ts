import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string, sessionId: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'ipDistance' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    robots: {
      index: false,
      follow: false
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website'
    }
  };
} 