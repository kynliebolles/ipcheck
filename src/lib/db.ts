import { IPDistanceSession } from '@/types/ipdistance';
import { v4 as uuidv4 } from 'uuid';

// In-memory database for sessions
const sessions: Map<string, IPDistanceSession> = new Map();

// Calculate expiration time (60 minutes from now)
const getExpirationTime = (): Date => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 60);
  return expiresAt;
};

// Create a new session
export const createSession = (): IPDistanceSession => {
  const id = uuidv4();
  const createdAt = new Date();
  const expiresAt = getExpirationTime();
  
  const session: IPDistanceSession = {
    id,
    createdAt,
    expiresAt,
    firstIP: null,
    secondIP: null,
    firstIPInfo: null,
    secondIPInfo: null,
    distance: null
  };
  
  sessions.set(id, session);
  
  // Schedule cleanup of expired session
  setTimeout(() => {
    if (sessions.has(id)) {
      sessions.delete(id);
    }
  }, 60 * 60 * 1000); // 60 minutes
  
  return session;
};

// Get a session by ID
export const getSession = (id: string): IPDistanceSession | null => {
  if (!sessions.has(id)) {
    return null;
  }
  
  const session = sessions.get(id)!;
  
  // Check if session has expired
  if (new Date() > session.expiresAt) {
    sessions.delete(id);
    return null;
  }
  
  return session;
};

// Update a session
export const updateSession = (id: string, data: Partial<IPDistanceSession>): IPDistanceSession | null => {
  const session = getSession(id);
  if (!session) {
    return null;
  }
  
  const updatedSession = { ...session, ...data };
  sessions.set(id, updatedSession);
  
  return updatedSession;
};

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}; 