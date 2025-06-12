'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from "next-intl";
import Link from 'next/link';
import { Advertisement } from '@/components/Advertisement';

interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

interface LocationInfo {
  coordinates: GeolocationData;
  address?: {
    country?: string;
    region?: string;
    city?: string;
    district?: string;
    street?: string;
    postcode?: string;
    formatted?: string;
  };
  timezone?: string;
  isp?: string;
}

export default function GeolocationContent() {
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const t = useTranslations("geolocation");
  const locale = useLocale();

  // 检查地理位置权限状态
  const checkPermissionStatus = async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(permission.state);
        
        permission.addEventListener('change', () => {
          setPermissionStatus(permission.state);
        });
      } catch (err) {
        console.log('Permission API not supported');
      }
    }
  };

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  // 获取地理位置信息
  const getLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError(t('geolocation_not_supported'));
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = position.coords;
        const locationData: GeolocationData = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          altitude: coords.altitude ?? undefined,
          altitudeAccuracy: coords.altitudeAccuracy ?? undefined,
          heading: coords.heading ?? undefined,
          speed: coords.speed ?? undefined,
          timestamp: position.timestamp
        };

        // 尝试获取地址信息
        try {
          const addressInfo = await reverseGeocode(coords.latitude, coords.longitude);
          setLocationInfo({
            coordinates: locationData,
            address: addressInfo.address,
            timezone: addressInfo.timezone,
            isp: addressInfo.isp
          });
        } catch (err) {
          // 即使无法获取地址信息，也显示坐标
          setLocationInfo({
            coordinates: locationData
          });
        }
        
        setLoading(false);
      },
      (error) => {
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('permission_denied');
            setPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('position_unavailable');
            break;
          case error.TIMEOUT:
            errorMessage = t('timeout');
            break;
          default:
            errorMessage = t('unknown_error');
            break;
        }
        setError(errorMessage);
        setLoading(false);
      }
    );
  };



  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加成功提示
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  // 在地图中查看
  const viewOnMap = () => {
    if (locationInfo?.coordinates) {
      const { latitude, longitude } = locationInfo.coordinates;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
  };

  // 反向地理编码函数
  const reverseGeocode = async (lat: number, lng: number) => {
    const results: any = {};
    
    try {
      // 获取地址信息
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=${locale}`,
        {
          headers: {
            'User-Agent': 'IPCheck/1.0 (https://ipcheck.ing)'
          }
        }
      );
      
      if (nominatimResponse.ok) {
        const data = await nominatimResponse.json();
        if (data && data.address) {
          results.address = {
            country: data.address.country,
            region: data.address.state || data.address.province || data.address.region,
            city: data.address.city || data.address.town || data.address.village,
            district: data.address.suburb || data.address.district,
            street: data.address.road,
            postcode: data.address.postcode,
            formatted: data.display_name
          };
        }
      }
    } catch (error) {
      console.warn('Nominatim API failed:', error);
    }

    // 添加时区信息 (不依赖外部API)
    results.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      // 尝试获取ISP信息
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        const ispResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        if (ispResponse.ok) {
          const ispData = await ispResponse.json();
          results.isp = ispData.org;
        }
      }
    } catch (error) {
      console.warn('ISP API failed:', error);
    }

    return results;
  };

  return (
    <>
      {/* 页面标题 - 与其他页面保持一致的布局 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('title')}</h1>
        <Link 
          href={`/${locale}`}
          className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-white hover:text-black"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>{t('back_home')}</span>
        </Link>
      </div>
      <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto text-center">
        {t('description')}
      </p>

    <div className="max-w-4xl mx-auto">

      {/* 获取位置按钮 */}
      <div className="text-center mb-8">
        <button
          onClick={getLocation}
          disabled={loading}
          className="bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 px-8 py-3 rounded-md font-medium transition-colors"
        >
          {loading ? t('getting_location') : t('get_location')}
        </button>
      </div>

      {/* 权限状态提示 */}
      {permissionStatus === 'denied' && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{t('permission_denied_notice')}</p>
            </div>
          </div>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md mb-6">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* 位置信息显示 */}
      {locationInfo && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">{t('location_info')}</h2>
          
          {/* 坐标信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-black border border-gray-800 rounded-md p-4">
              <h3 className="text-gray-400 text-sm font-medium mb-2">{t('coordinates')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{t('latitude')}:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-mono">{locationInfo.coordinates.latitude.toFixed(6)}</span>
                    <button
                      onClick={() => copyToClipboard(locationInfo.coordinates.latitude.toString())}
                      className="text-gray-400 hover:text-white"
                      title={t('copy')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{t('longitude')}:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-mono">{locationInfo.coordinates.longitude.toFixed(6)}</span>
                    <button
                      onClick={() => copyToClipboard(locationInfo.coordinates.longitude.toString())}
                      className="text-gray-400 hover:text-white"
                      title={t('copy')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{t('accuracy')}:</span>
                  <span className="text-white">{Math.round(locationInfo.coordinates.accuracy)} {t('meters')}</span>
                </div>
              </div>
            </div>

            {/* 额外信息 */}
            <div className="bg-black border border-gray-800 rounded-md p-4">
              <h3 className="text-gray-400 text-sm font-medium mb-2">{t('additional_info')}</h3>
              <div className="space-y-2">
                {locationInfo.timezone && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{t('timezone')}:</span>
                    <span className="text-white text-sm">{locationInfo.timezone}</span>
                  </div>
                )}
                {locationInfo.isp && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{t('isp')}:</span>
                    <span className="text-white text-sm">{locationInfo.isp}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{t('timestamp')}:</span>
                  <span className="text-white text-sm">{new Date(locationInfo.coordinates.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 地址信息 */}
          {locationInfo.address && (
            <div className="bg-black border border-gray-800 rounded-md p-4 mb-4">
              <h3 className="text-gray-400 text-sm font-medium mb-2">{t('address')}</h3>
              <div className="space-y-2">
                {locationInfo.address.formatted && (
                  <div className="flex justify-between items-start">
                    <span className="text-gray-300 flex-shrink-0">{t('full_address')}:</span>
                    <span className="text-white text-sm text-right break-words ml-4 max-w-xs">{locationInfo.address.formatted}</span>
                  </div>
                )}
                {locationInfo.address.country && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{t('country')}:</span>
                    <span className="text-white">{locationInfo.address.country}</span>
                  </div>
                )}
                {locationInfo.address.region && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{t('region')}:</span>
                    <span className="text-white">{locationInfo.address.region}</span>
                  </div>
                )}
                {locationInfo.address.city && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{t('city')}:</span>
                    <span className="text-white">{locationInfo.address.city}</span>
                  </div>
                )}
              </div>
            </div>
          )}



          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={viewOnMap}
              className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('view_on_map')}
            </button>
            <button
              onClick={() => copyToClipboard(`${locationInfo.coordinates.latitude},${locationInfo.coordinates.longitude}`)}
              className="bg-gray-700 text-white hover:bg-gray-600 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {t('copy_coordinates')}
            </button>
          </div>
        </div>
      )}

      {/* 广告位 */}
      <div className="mb-8">
        <Advertisement slot="1234567890" width="728px" height="90px" />
      </div>

      {/* 使用说明 */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">{t('how_to_use')}</h2>
        <div className="space-y-3 text-gray-300">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
              1
            </div>
            <p>{t('step_1')}</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
              2
            </div>
            <p>{t('step_2')}</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
              3
            </div>
            <p>{t('step_3')}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
} 