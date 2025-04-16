import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now()
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 计算接收文件的时间
    const endTime = Date.now()
    const processingTime = endTime - startTime
    
    // 这里我们只需要确认接收到数据，不需要实际保存文件
    return NextResponse.json({
      success: true,
      processingTime,
      timestamp: endTime
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*', // 允许跨域请求
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
