import { NextResponse } from 'next/server';
import { createSession } from '@/lib/db';
import { CreateSessionResponse } from '@/types/ipdistance';

// Create a new session
export async function POST(request: Request) {
  try {
    const session = createSession();
    const host = request.headers.get('host') || 'ipcheck.tools';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    
    const shareUrl = `${protocol}://${host}/ipdistance/${session.id}`;
    
    const response: CreateSessionResponse = {
      sessionId: session.id,
      shareUrl,
      expiresAt: session.expiresAt
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating IP distance session:', error);
    return NextResponse.json(
      { error: 'Failed to create session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 