import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '0')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // 原始工作日報 API URL
    const apiUrl = `https://eip.polaris.tw/work_report/gen_json.php?sEcho=2&iColumns=9&sColumns=&iDisplayStart=${page}&iDisplayLength=${limit}&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2&mDataProp_3=3&mDataProp_4=4&mDataProp_5=5&mDataProp_6=6&mDataProp_7=7&mDataProp_8=8&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&sSearch_7=&bRegex_7=false&bSearchable_7=true&sSearch_8=&bRegex_8=false&bSearchable_8=true&_=${Date.now()}`

    console.log('🔍 正在呼叫 API:', apiUrl)
    console.log('🍪 Cookie 狀態:', process.env.WORK_REPORT_COOKIE ? `已設定 (長度: ${process.env.WORK_REPORT_COOKIE.length})` : '未設定')

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebNet/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://eip.polaris.tw/work_report/gen_index.php',
        'Cookie': process.env.WORK_REPORT_COOKIE || '',
      },
    })

    console.log('📡 API 回應狀態:', response.status, response.statusText)
    console.log('📄 Content-Type:', response.headers.get('content-type'))

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    console.log('📝 原始回應內容 (前 200 字元):', responseText.substring(0, 200))

    // 檢查是否為 HTML 回應 (登入頁面)
    if (responseText.trim().startsWith('<!DOCTYPE') || responseText.includes('<html')) {
      console.log('❌ 收到 HTML 回應，可能是登入頁面')
      return NextResponse.json({
        error: '需要重新認證',
        message: 'Cookie 已過期或無效，請重新登入並更新 Cookie',
        type: 'AUTH_ERROR',
        htmlContent: responseText.substring(0, 500)
      }, { status: 401 })
    }

    // 嘗試解析 JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.log('❌ JSON 解析失敗:', parseError)
      console.log('原始內容:', responseText.substring(0, 1000))
      return NextResponse.json({
        error: '資料格式錯誤',
        message: '無法解析 API 回應為 JSON 格式',
        type: 'PARSE_ERROR',
        rawResponse: responseText.substring(0, 500)
      }, { status: 500 })
    }

    console.log('✅ 成功解析 JSON 資料')
    console.log('📊 資料摘要:', {
      sEcho: data.sEcho,
      iTotalRecords: data.iTotalRecords,
      iTotalDisplayRecords: data.iTotalDisplayRecords,
      aaDataLength: data.aaData?.length || 0
    })

    // 檢查數據合理性
    if (data.iTotalRecords > 1000000) {
      console.log('⚠️ 檢測到異常的總記錄數，進行修正')
      data.iTotalRecords = data.aaData?.length || 0
    }

    // 檢查是否有實際資料
    if (!data.aaData || data.aaData.length === 0) {
      console.log('📝 沒有實際資料，提供示例資料')
      return NextResponse.json({
        sEcho: data.sEcho || 1,
        iTotalRecords: 0,
        iTotalDisplayRecords: 0,
        aaData: [],
        message: '目前沒有工作日報資料'
      })
    }

    // 過濾派工單資料（調整過濾邏輯）
    const filteredData = data.aaData.filter((item: any[]) => {
      // 檢查每個欄位的內容
      for (let i = 0; i < item.length; i++) {
        const cellContent = String(item[i] || '').toLowerCase()
        console.log(`項目內容: ${cellContent.substring(0, 50)} 是否包含派工: ${cellContent.includes('派工')}`)
        
        // 如果明確包含派工相關關鍵字，才過濾掉
        if (cellContent.includes('派工單') || 
            cellContent.includes('work order') ||
            (cellContent.includes('派工') && cellContent.includes('單'))) {
          return false // 過濾掉派工單
        }
      }
      return true // 保留非派工單項目
    })

    // 修正總數問題
    let correctedTotal = data.iTotalRecords
    if (correctedTotal > 1000000) {
      console.log('修正異常的總記錄數')
      correctedTotal = Math.min(1000, data.iTotalDisplayRecords || filteredData.length)
    }

    console.log(`🔧 過濾結果: ${data.aaData.length} → ${filteredData.length} (移除 ${data.aaData.length - filteredData.length} 筆派工單)`)

    return NextResponse.json({
      sEcho: data.sEcho,
      iTotalRecords: correctedTotal,
      iTotalDisplayRecords: filteredData.length,
      aaData: filteredData.slice(0, 10), // 限制回傳數量
      originalTotal: data.iTotalRecords,
      filtered: data.aaData.length - filteredData.length
    })

  } catch (error) {
    console.error('💥 API 錯誤:', error)
    return NextResponse.json({
      error: '載入工作日報失敗',
      message: error instanceof Error ? error.message : '未知錯誤',
      type: 'FETCH_ERROR'
    }, { status: 500 })
  }
}
