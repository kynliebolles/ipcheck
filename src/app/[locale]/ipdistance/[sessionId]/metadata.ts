import { Metadata } from 'next';
// import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ 
  // params 
}: { params: { locale: string, sessionId: string } }): Promise<Metadata> {
  // Can't use translations easily in metadata without additional setup
  // Using direct values for now
  return {
    title: "IP Distance Calculator - Measure Geographic Distance Between IPs | IP Check Tools",
    description: "Calculate the geographical distance between two IP addresses in real-time. See how far apart two internet connections are located.",
    keywords: "ipdistance, ip distance result, geographic ip measurement, ip location distance, distance between addresses, ip coordinates distance, location tracker, ip mapping result, how far apart are ips",
    robots: {
      index: false,
      follow: false
    },
    openGraph: {
      title: "IP Distance Calculator - Measure Geographic Distance Between IPs",
      description: "Calculate the geographical distance between two IP addresses in real-time.",
      type: 'website'
    }
  };
} 