import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const limit = searchParams.get('limit') || '10'
    
    // 原始工作日報 API URL
    const apiUrl = `https://eip.polaris.tw/work_report/gen_json.php?sEcho=2&iColumns=9&sColumns=&iDisplayStart=${page}&iDisplayLength=${limit}&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2&mDataProp_3=3&mDataProp_4=4&mDataProp_5=5&mDataProp_6=6&mDataProp_7=7&mDataProp_8=8&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&sSearch_7=&bRegex_7=false&bSearchable_7=true&sSearch_8=&bRegex_8=false&bSearchable_8=true&_=${Date.now()}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    // 過濾掉派工單相關的資料 (假設派工單在某個欄位中包含特定關鍵字)
    const filteredData = {
      ...data,
      aaData: data.aaData?.filter((item: any[]) => {
        // 檢查是否為派工單 (根據實際欄位內容調整)
        const content = JSON.stringify(item).toLowerCase()
        return !content.includes('派工') && 
               !content.includes('派工單') && 
               !content.includes('work order')
      }) || []
    }

    return NextResponse.json(filteredData)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work report data' },
      { status: 500 }
    )
  }
}
