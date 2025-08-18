import { NextResponse } from 'next/server'

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

export async function GET() {
  try {
    // 取得大量資料來分析統計
    const params = new URLSearchParams({
      draw: '1',
      start: '0',
      length: '1000', // 取得更多資料用於統計
      'search[value]': '',
      'search[regex]': 'false'
    })

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
      throw new Error(`統計 API 請求失敗: ${response.status}`)
    }

    const data: DataTablesResponse = await response.json()
    
    // 篩選掉派工單
    const filteredData = data.data.filter(item => 
      item.日報類型 && !String(item.日報類型).includes('派工單')
    )

    // 統計本月日報
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    const thisMonthReports = filteredData.filter(item => {
      if (!item.日報時間) return false
      const reportDate = new Date(item.日報時間)
      return reportDate.getMonth() + 1 === currentMonth && 
             reportDate.getFullYear() === currentYear
    })

    // 統計類型分佈
    const typeStats = new Map<string, number>()
    filteredData.forEach(item => {
      if (item.日報類型) {
        const currentCount = typeStats.get(item.日報類型) || 0
        typeStats.set(item.日報類型, currentCount + 1)
      }
    })

    const types = Array.from(typeStats.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      success: true,
      total: filteredData.length,
      thisMonth: thisMonthReports.length,
      types,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('統計 API 錯誤:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '無法取得統計資料',
        details: error instanceof Error ? error.message : '未知錯誤'
      }, 
      { status: 500 }
    )
  }
}
