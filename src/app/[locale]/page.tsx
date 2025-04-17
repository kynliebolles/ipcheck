import { Metadata } from "next";
import ClientPage from '@/components/ClientPage';

// Server-side metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "IP Check - Free IP Address Lookup Tool & Network Speed Test",
    description: "Free IP address lookup and network speed test tools. Get detailed information about any IP address and measure your internet connection speed. No registration required.",
  };
}

// Server component
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  // Await and destructure the params object to access locale
  const { locale } = await params;
  return <ClientPage locale={locale} />;
}
