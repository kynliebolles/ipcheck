import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json({
        error: 'Missing latitude or longitude parameters'
      }, { status: 400 });
    }

    // 验证坐标格式
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json({
        error: 'Invalid latitude or longitude format'
      }, { status: 400 });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json({
        error: 'Latitude must be between -90 and 90, longitude must be between -180 and 180'
      }, { status: 400 });
    }

    // 使用多个地理编码服务获取更准确的信息
    let addressInfo = null;
    let timezone = null;
    let error = null;

    // 尝试使用 OpenStreetMap Nominatim API (免费)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时

      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'IPCheck-Tools-Geolocation/1.0 (https://ipcheck.tools)',
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (nominatimResponse.ok) {
        const nominatimData = await nominatimResponse.json();
        
        if (nominatimData.address) {
          addressInfo = {
            formatted: nominatimData.display_name,
            country: nominatimData.address.country,
            region: nominatimData.address.state || nominatimData.address.province || nominatimData.address.region,
            city: nominatimData.address.city || nominatimData.address.town || nominatimData.address.village || nominatimData.address.municipality,
            district: nominatimData.address.suburb || nominatimData.address.neighbourhood || nominatimData.address.quarter,
            street: nominatimData.address.road || nominatimData.address.pedestrian,
            postcode: nominatimData.address.postcode,
          };
        }
      }
    } catch (err) {
      console.error('Nominatim API error:', err);
      error = 'Failed to fetch address information';
    }

    // 尝试获取时区信息 (使用免费的时区API)
    try {
      // 如果没有API密钥，跳过时区获取
      if (!process.env.TIMEZONE_API_KEY) {
        console.log('Timezone API key not provided, skipping timezone lookup');
      } else {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

        const timezoneResponse = await fetch(
          `https://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.TIMEZONE_API_KEY}&format=json&by=position&lat=${latitude}&lng=${longitude}`,
          {
            headers: {
              'User-Agent': 'IPCheck-Tools-Geolocation/1.0 (https://ipcheck.tools)',
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

              if (timezoneResponse.ok) {
          const timezoneData = await timezoneResponse.json();
          if (timezoneData.status === 'OK') {
            timezone = timezoneData.zoneName;
          }
        }
      }
    } catch (err) {
      console.error('Timezone API error:', err);
      // 时区信息不是必需的，所以不影响主要功能
    }

    // 如果没有获取到任何地址信息，使用基本的地理信息
    if (!addressInfo) {
      addressInfo = {
        formatted: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        country: null,
        region: null,
        city: null,
        district: null,
        street: null,
        postcode: null,
      };
    }

    return NextResponse.json({
      address: addressInfo,
      timezone: timezone,
      coordinates: {
        latitude: latitude,
        longitude: longitude,
      },
      error: error
    });

  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
} 