import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const size = parseInt(searchParams.get('size') || '5242880', 10) // 默认5MB
  
  // 生成随机数据
  const buffer = new ArrayBuffer(size)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < size; i++) {
    view[i] = Math.floor(Math.random() * 256)
  }

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache',
    },
  })
}
