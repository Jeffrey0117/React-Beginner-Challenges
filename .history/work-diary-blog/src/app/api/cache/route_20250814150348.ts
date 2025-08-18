import { NextResponse } from 'next/server'

// 簡單的內存快取
let cache: { [key: string]: { data: any, timestamp: number } } = {}
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 小時

export async function POST() {
  try {
    // 清除快取
    cache = {}
    
    return NextResponse.json({
      success: true,
      message: '快取已清除',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: '快取清除失敗',
        details: error instanceof Error ? error.message : '未知錯誤'
      }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const cacheKeys = Object.keys(cache)
    const cacheInfo = cacheKeys.map(key => ({
      key,
      timestamp: new Date(cache[key].timestamp).toISOString(),
      age: Date.now() - cache[key].timestamp
    }))

    return NextResponse.json({
      success: true,
      caches: cacheInfo,
      total: cacheKeys.length
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: '無法取得快取資訊',
        details: error instanceof Error ? error.message : '未知錯誤'
      }, 
      { status: 500 }
    )
  }
}
