import { NextRequest, NextResponse } from 'next/server'

interface WorkReportItem {
  DT_RowId: string
  Id: string
  日報時間: string
  日報內容: string
  日報類型: string
  工時: string
}

interface DataTablesResponse {
  draw: number
  recordsTotal: number
  recordsFiltered: number
  data: WorkReportItem[]
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const start = (page - 1) * limit

    // 構建 DataTables API 請求參數
    const params = new URLSearchParams({
      draw: '1',
      start: start.toString(),
      length: limit.toString(),
      'search[value]': '',
      'search[regex]': 'false'
    })

    // 如果有指定類型，添加到搜尋參數
    if (type) {
      params.set('search[value]', type)
    }

    const apiUrl = `https://eip.polaris.tw/WorkReport/GetDataTablesData?${params.toString()}`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Cookie': process.env.AUTH_COOKIE || '',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://eip.polaris.tw/WorkReport',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`)
    }

    const data: DataTablesResponse = await response.json()
    
    // 篩選掉派工單類型
    const filteredData = data.data.filter(item => 
      item.日報類型 && !item.日報類型.includes('派工單')
    )

    // 如果有指定類型，進一步篩選
    const finalData = type ? 
      filteredData.filter(item => 
        item.日報類型 && item.日報類型.includes(type)
      ) : 
      filteredData

    return NextResponse.json({
      success: true,
      data: finalData,
      pagination: {
        page,
        limit,
        total: data.recordsTotal,
        filtered: finalData.length,
        hasMore: start + limit < data.recordsTotal
      }
    })

  } catch (error) {
    console.error('工作日報 API 錯誤:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '無法取得工作日報資料',
        details: error instanceof Error ? error.message : '未知錯誤'
      }, 
      { status: 500 }
    )
  }
}
