import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const size = parseInt(searchParams.get('size') || '5242880', 10) // 默认5MB
  
  // 限制最大测试文件大小为50MB，以防止服务器过载
  const maxSize = 52428800 // 50MB
  const actualSize = Math.min(size, maxSize)
  
  // 生成随机数据
  const buffer = new ArrayBuffer(actualSize)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < actualSize; i++) {
    view[i] = Math.floor(Math.random() * 256)
  }

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache',
      'Access-Control-Allow-Origin': '*', // 允许跨域请求，便于将来添加远程测速服务器
    },
  })
}
