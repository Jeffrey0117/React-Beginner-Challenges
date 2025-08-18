import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 根據之前的資料，6月152h + 7月176h = 328h
    const salaryData = {
      months: [
        {
          month: '2024-06',
          name: '6月',
          hours: 152,
          rate: 200, // 假設時薪
          amount: 152 * 200
        },
        {
          month: '2024-07',
          name: '7月',
          hours: 176,
          rate: 200,
          amount: 176 * 200
        }
      ],
      summary: {
        totalHours: 328,
        totalAmount: 328 * 200,
        averageHoursPerMonth: 164
      }
    }

    return NextResponse.json({
      success: true,
      data: salaryData,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('薪資統計 API 錯誤:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '無法取得薪資統計',
        details: error instanceof Error ? error.message : '未知錯誤'
      }, 
      { status: 500 }
    )
  }
}
