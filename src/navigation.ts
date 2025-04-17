import { createNavigation } from 'next-intl/navigation';

// 直接定义支持的语言，避免导入错误
const locales = ['en', 'zh', 'zh-Hant'];

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales }); 