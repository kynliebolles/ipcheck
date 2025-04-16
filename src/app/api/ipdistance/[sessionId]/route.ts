import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession, calculateDistance } from '@/lib/db';
import { IPLocationInfo } from '@/types/ipdistance';

async function getIPInfo(ip: string): Promise<IPLocationInfo | null> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'IPCheck/1.0'
      }
    });
    
    const data = await response.json();
    
    if (data.status === 'fail') {
      return null;
    }
    
    return {
      ip,
      lat: data.lat,
      lon: data.lon,
      city: data.city,
      regionName: data.regionName,
      country: data.country,
      countryCode: data.countryCode
    };
  } catch (error) {
    console.error('Error fetching IP information:', error);
    return null;
  }
}

// Get session info or register IP to session
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
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
    
    // If this is the first IP for this session
    if (!session.firstIP) {
      const ipInfo = await getIPInfo(clientIp);
      
      if (!ipInfo) {
        return NextResponse.json({ error: 'Failed to get IP information' }, { status: 500 });
      }
      
      // 更新会话，记录第一个IP
      updateSession(sessionId, {
        firstIP: clientIp,
        firstIPInfo: ipInfo
      });
      
      return NextResponse.json({
        message: 'You are the first visitor. Share this link with someone else to see the IP distance.',
        sessionId,
        expiresAt: session.expiresAt,
        isFirstVisitor: true,
        isComplete: false
      });
    }
    
    // If this is the same IP as first visitor, just return current state
    if (session.firstIP === clientIp) {
      return NextResponse.json({
        message: 'You have already visited this link. Share it with someone else.',
        sessionId,
        expiresAt: session.expiresAt,
        isFirstVisitor: true,
        isComplete: !!session.secondIP
      });
    }
    
    // If this is the second visitor and not already recorded
    if (!session.secondIP) {
      const ipInfo = await getIPInfo(clientIp);
      
      if (!ipInfo) {
        return NextResponse.json({ error: 'Failed to get IP information' }, { status: 500 });
      }
      
      // Calculate distance between IPs
      const distance = calculateDistance(
        session.firstIPInfo!.lat,
        session.firstIPInfo!.lon,
        ipInfo.lat,
        ipInfo.lon
      );
      
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