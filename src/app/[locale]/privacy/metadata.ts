import { Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return {
    title: 'Privacy Policy - How We Handle Your Data | IP Check Tools',
    description: 'Privacy policy for IP Check Tools. Learn how we collect, use, and protect your information when using our IP lookup and speed test services.',
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      canonical: `https://ipcheck.tools/${params.locale}/privacy`
    }
  };
};
