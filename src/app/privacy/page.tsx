'use client';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p>When you use our IP Check tool, we collect:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your IP address</li>
            <li>Browser user agent information</li>
            <li>Basic usage statistics</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide IP address details and geolocation information</li>
            <li>Improve our service</li>
            <li>Analyze usage patterns</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Advertising</h2>
          <p>We use Google AdSense to display advertisements. Google AdSense may use cookies and web beacons to collect data, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your IP address</li>
            <li>Browser type</li>
            <li>Operating system</li>
            <li>Browsing behavior</li>
          </ul>
          <p>For more information about Google AdSense, please visit <a href="https://policies.google.com/technologies/ads" className="text-blue-600 dark:text-blue-400 hover:underline">Google&apos;s Advertising Policies</a>.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p>We implement appropriate security measures to protect your information. However, no method of transmission over the internet is 100% secure.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p>If you have any questions about this privacy policy, please contact us.</p>
        </div>
      </div>
    </div>
  );
}
