import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession, calculateDistance } from '@/lib/db';
import { IPLocationInfo } from '@/types/ipdistance';

// 添加重试和备用API支持
async function getIPInfo(ip: string, retryCount = 0): Promise<IPLocationInfo | null> {
  const maxRetries = 3;
  const ipApis = [
    // 主要API
    {
      url: `http://ip-api.com/json/${ip}`,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'IPCheck/1.0'
      } as Record<string, string>,
      transform: (data: any): IPLocationInfo | null => {
        if (data.status === 'fail') return null;
        return {
          ip,
          lat: data.lat,
          lon: data.lon,
          city: data.city || 'Unknown',
          regionName: data.regionName || 'Unknown',
          country: data.country || 'Unknown',
          countryCode: data.countryCode || 'XX'
        };
      }
    },
    // 备用API 1
    {
      url: `https://ipapi.co/${ip}/json/`,
      headers: {
        'Accept': 'application/json'
      } as Record<string, string>,
      transform: (data: any): IPLocationInfo | null => {
        if (data.error) return null;
        return {
          ip,
          lat: data.latitude,
          lon: data.longitude,
          city: data.city || 'Unknown',
          regionName: data.region || 'Unknown',
          country: data.country_name || 'Unknown',
          countryCode: data.country_code || 'XX'
        };
      }
    },
    // 备用API 2 - ipinfo.io（注意：有请求限制）
    {
      url: `https://ipinfo.io/${ip}/json`,
      headers: {
        'Accept': 'application/json'
      } as Record<string, string>,
      transform: (data: any): IPLocationInfo | null => {
        if (!data || data.error) return null;
        // 解析坐标（格式为 "lat,lon"）
        const coords = data.loc ? data.loc.split(',') : [0, 0];
        return {
          ip,
          lat: parseFloat(coords[0]),
          lon: parseFloat(coords[1]),
          city: data.city || 'Unknown',
          regionName: data.region || 'Unknown',
          country: data.country || 'Unknown',
          countryCode: data.country || 'XX'
        };
      }
    }
  ];

  try {
    // 使用当前重试计数选择API
    const apiIndex = retryCount % ipApis.length;
    const api = ipApis[apiIndex];
    
    console.log(`Fetching IP info for ${ip} using API ${apiIndex + 1}, attempt ${retryCount + 1}`);
    
    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(api.url, {
      headers: api.headers,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }
    
    const data = await response.json();
    const ipInfo = api.transform(data);
    
    // 如果获取到有效的IP信息，返回
    if (ipInfo && ipInfo.lat && ipInfo.lon) {
      return ipInfo;
    }
    
    throw new Error('Invalid IP information received');
  } catch (error) {
    console.error(`Error fetching IP information (attempt ${retryCount + 1}):`, error);
    
    // 如果还有重试次数，尝试重试
    if (retryCount < maxRetries) {
      console.log(`Retrying with different API (${retryCount + 1}/${maxRetries})...`);
      return getIPInfo(ip, retryCount + 1);
    }
    
    // 失败次数过多，返回模拟数据（仅用于开发/测试）
    if (process.env.NODE_ENV === 'development') {
      console.warn('All IP APIs failed, using fallback mock data');
      return {
        ip,
        lat: Math.random() * 180 - 90,  // 随机纬度
        lon: Math.random() * 360 - 180, // 随机经度
        city: 'Unknown City',
        regionName: 'Unknown Region',
        country: 'Unknown Country',
        countryCode: 'XX'
      };
    }
    
    return null;
  }
}

// Get session info or register IP to session
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ sessionId: string }> }
) {
  try {
    const params = await props.params;
    const sessionId = params.sessionId;
    
    const session = getSession(sessionId);
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 });
    }
    
    // Get client IP
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                    request.headers.get('x-real-ip') ||
                    request.headers.get('cf-connecting-ip') ||
                    '0.0.0.0';
    
    console.log(`Processing request for session: ${sessionId}, client IP: ${clientIp}`);
    
    // If this is the first IP for this session
    if (!session.firstIP) {
      console.log(`Recording first visitor (${clientIp}) for session ${sessionId}`);
      
      const ipInfo = await getIPInfo(clientIp);
      
      if (!ipInfo) {
        console.error(`Failed to get IP information for ${clientIp}`);
        return NextResponse.json({ error: 'Failed to get IP information' }, { status: 500 });
      }
      
      // 更新会话，记录第一个IP
      updateSession(sessionId, {
        firstIP: clientIp,
        firstIPInfo: ipInfo
      });
      
      console.log(`First visitor recorded successfully: ${ipInfo.city}, ${ipInfo.country}`);
      
      return NextResponse.json({
        message: 'You are the first visitor. Share this link with someone else to see the IP distance.',
        sessionId,
        expiresAt: session.expiresAt,
        isFirstVisitor: true,
        isComplete: false
      });
    }
    
    // Check if the calculation is complete (second visitor has accessed)
    if (session.secondIP && session.distance) {
      // If calculation is already complete, return full results regardless of visitor
      return NextResponse.json({
        message: 'IP distance calculation complete!',
        sessionId,
        expiresAt: session.expiresAt,
        isFirstVisitor: session.firstIP === clientIp,
        isComplete: true,
        firstIP: session.firstIPInfo,
        secondIP: session.secondIPInfo,
        distance: session.distance,
        unit: 'km'
      });
    }
    
    // If this is the same IP as first visitor, but calculation is not complete
    if (session.firstIP === clientIp) {
      return NextResponse.json({
        message: 'You have already visited this link. Share it with someone else.',
        sessionId,
        expiresAt: session.expiresAt,
        isFirstVisitor: true,
        isComplete: false
      });
    }
    
    // If this is the second visitor and not already recorded
    if (!session.secondIP) {
      console.log(`Recording second visitor (${clientIp}) for session ${sessionId}`);
      
      const ipInfo = await getIPInfo(clientIp);
      
      if (!ipInfo) {
        console.error(`Failed to get IP information for ${clientIp}`);
        return NextResponse.json({ error: 'Failed to get IP information' }, { status: 500 });
      }
      
      console.log(`Second visitor recorded successfully: ${ipInfo.city}, ${ipInfo.country}`);
      
      // Calculate distance between IPs
      const distance = calculateDistance(
        session.firstIPInfo!.lat,
        session.firstIPInfo!.lon,
        ipInfo.lat,
        ipInfo.lon
      );
      
      console.log(`Distance calculated: ${distance} km`);
      
      // 更新会话，记录第二个IP和距离
      updateSession(sessionId, {
        secondIP: clientIp,
        secondIPInfo: ipInfo,
        distance
      });
      
      return NextResponse.json({
        message: 'IP distance calculation complete!',
        sessionId,
        expiresAt: session.expiresAt,
        isFirstVisitor: false,
        isComplete: true,
        firstIP: session.firstIPInfo,
        secondIP: ipInfo,
        distance,
        unit: 'km'
      });
    }
    
    // If this is a third visitor or more
    if (session.secondIP && session.secondIP !== clientIp && session.firstIP !== clientIp) {
      return NextResponse.json({
        message: 'This link has already been used by two different IPs.',
        sessionId,
        expiresAt: session.expiresAt,
        isComplete: true
      }, { status: 403 });
    }
    
    // If this is the second visitor returning
    if (session.secondIP === clientIp) {
      return NextResponse.json({
        message: 'IP distance calculation complete!',
        sessionId,
        expiresAt: session.expiresAt,
        isFirstVisitor: false,
        isComplete: true,
        firstIP: session.firstIPInfo,
        secondIP: session.secondIPInfo,
        distance: session.distance,
        unit: 'km'
      });
    }
    
    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error processing IP distance request:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 