'use client';

import IPInfoClientComponent from './IPInfoClientComponent';
import { useTranslations } from 'next-intl';

export default function ClientPage({ locale }: { locale: string }) {
  return <IPInfoClientComponent locale={locale} />;
} 