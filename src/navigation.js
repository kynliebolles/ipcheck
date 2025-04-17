import { createNavigation } from 'next-intl/navigation';
import { locales } from './middleware';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales }); 