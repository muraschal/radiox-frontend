import { NextRequest, NextResponse } from 'next/server';

const RADIOX_API_BASE = 'https://api.radiox.cloud';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'shows';
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';
    
    console.log(`🔄 Proxying RadioX API: ${endpoint}`);
    
    const response = await fetch(`${RADIOX_API_BASE}/api/v1/${endpoint}?limit=${limit}&offset=${offset}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RadioX-Frontend/5.1',
      },
    });
    
    if (!response.ok) {
      throw new Error(`RadioX API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ RadioX API success: ${data.shows?.length || 0} shows`);
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error('❌ RadioX API Proxy Error:', error);
    return NextResponse.json(
      { error: 'RadioX API unavailable', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔄 Proxying RadioX API POST: generate show');
    
    const response = await fetch(`${RADIOX_API_BASE}/api/v1/shows/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'RadioX-Frontend/5.1',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`RadioX API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ RadioX API show generation success');
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error('❌ RadioX API Proxy POST Error:', error);
    return NextResponse.json(
      { error: 'Show generation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 503 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 