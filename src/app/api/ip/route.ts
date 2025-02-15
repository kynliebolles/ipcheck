import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetIp = searchParams.get('ip');
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'Unknown';

    let clientIp = headersList.get('x-forwarded-for');
    if (!clientIp) {
      // Fallback to ipify if 'x-forwarded-for' is not available
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();
      clientIp = ip;
    }

    if (!targetIp) {
      const response = await fetch(`http://ip-api.com/json/${clientIp}`);
      const data = await response.json();
      return NextResponse.json({ 
        ...data, 
        query: clientIp,
        userAgent
      });
    } else {
      // Query the specified IP
      const response = await fetch(`http://ip-api.com/json/${targetIp}`);
      const data = await response.json();
      return NextResponse.json({
        ...data,
        userAgent
      });
    }
  } catch (error) {
    console.error('Error fetching IP information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch IP information', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
