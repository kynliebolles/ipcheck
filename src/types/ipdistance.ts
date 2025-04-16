export interface IPDistanceSession {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  firstIP: string | null;
  secondIP: string | null;
  firstIPInfo: IPLocationInfo | null;
  secondIPInfo: IPLocationInfo | null;
  distance: number | null;
}

export interface IPLocationInfo {
  ip: string;
  lat: number;
  lon: number;
  city: string;
  regionName: string;
  country: string;
  countryCode: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  shareUrl: string;
  expiresAt: Date;
}

export interface IPDistanceResult {
  firstIP: IPLocationInfo;
  secondIP: IPLocationInfo;
  distance: number;
  unit: 'km';
} 