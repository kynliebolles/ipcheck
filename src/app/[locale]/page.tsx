import { Metadata } from "next";
import ClientPage from '@/components/ClientPage';

// Server-side metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // 使用locale变量来添加不同语言版本的标题
  const titles = {
    'en': "IP Check - Free IP Address Lookup Tool & Network Speed Test",
    'zh': "IP检测 - 免费IP地址查询工具和网络速度测试",
    'zh-Hant': "IP檢測 - 免費IP地址查詢工具和網絡速度測試"
  };
  
  // 使用对应语言的标题，如果没有则使用英文默认值
  const title = titles[locale as keyof typeof titles] || titles['en'];
  
  return {
    title,
    description: "Free IP address lookup and network speed test tools. Get detailed information about any IP address and measure your internet connection speed. No registration required.",
  };
}

// Server component
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  // Await and destructure the params object to access locale
  const { locale } = await params;
  return <ClientPage locale={locale} />;
}
