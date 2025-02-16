import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetIp = searchParams.get('ip');
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'Unknown';

    // 在开发环境中返回模拟数据
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        status: "success",
        country: "United States",
        countryCode: "US",
        region: "CA",
        regionName: "California",
        city: "Mountain View",
        zip: "94043",
        lat: 37.422,
        lon: -122.084,
        timezone: "America/Los_Angeles",
        isp: "Google LLC",
        org: "Google LLC",
        as: "AS15169 Google LLC",
        query: targetIp || "8.8.8.8",
        userAgent
      });
    }

    // 生产环境中的逻辑
    const clientIp = headersList.get('x-forwarded-for')?.split(',')[0] ||
                    headersList.get('x-real-ip') ||
                    headersList.get('cf-connecting-ip');

    if (!clientIp && !targetIp) {
      throw new Error('Could not determine IP address');
    }

    const ipToQuery = targetIp || clientIp;
    
    const response = await fetch(`http://ip-api.com/json/${ipToQuery}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'IPCheck/1.0'
      }
    });

    const data = await response.json();
    
    if (data.status === 'fail') {
      throw new Error(data.message || 'IP API request failed');
    }

    return NextResponse.json({
      ...data,
      query: ipToQuery,
      userAgent
    });
  } catch (error) {
    console.error('Error fetching IP information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch IP information', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
