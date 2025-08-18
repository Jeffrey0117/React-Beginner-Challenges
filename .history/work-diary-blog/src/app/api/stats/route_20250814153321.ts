import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 開始獲取所有工作日報資料進行統計分析')
    
    let allReports: any[] = []
    let currentPage = 0
    const limit = 50 // 每次獲取 50 筆
    let hasMore = true
    
    while (hasMore && currentPage < 10) { // 限制最多 10 頁，避免無限循環
      const startIndex = currentPage * limit
      const apiUrl = `https://eip.polaris.tw/work_report/gen_json.php?sEcho=2&iColumns=9&sColumns=&iDisplayStart=${startIndex}&iDisplayLength=${limit}&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2&mDataProp_3=3&mDataProp_4=4&mDataProp_5=5&mDataProp_6=6&mDataProp_7=7&mDataProp_8=8&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&sSearch_7=&bRegex_7=false&bSearchable_7=true&sSearch_8=&bRegex_8=false&bSearchable_8=true&_=${Date.now()}`
      
      console.log(`📄 正在載入第 ${currentPage + 1} 頁 (從 ${startIndex} 開始)`)
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
          'X-Requested-With': 'XMLHttpRequest',
          'Cookie': process.env.WORK_REPORT_COOKIE || '',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
      })

      if (!response.ok) {
        console.log(`❌ 第 ${currentPage + 1} 頁載入失敗: HTTP ${response.status}`)
        break
      }

      const text = await response.text()
      
      try {
        const data = JSON.parse(text)
        
        if (data.aaData && data.aaData.length > 0) {
          // 過濾派工單
          const filteredData = data.aaData.filter((item: any[]) => {
            for (let i = 0; i < item.length; i++) {
              const cellContent = String(item[i] || '').toLowerCase()
              if (cellContent.includes('派工單') || 
                  cellContent.includes('work order') ||
                  (cellContent.includes('派工') && cellContent.includes('單'))) {
                return false
              }
            }
            return true
          })
          
          allReports = [...allReports, ...filteredData]
          console.log(`✅ 第 ${currentPage + 1} 頁載入成功: ${data.aaData.length} 筆原始資料, ${filteredData.length} 筆過濾後資料`)
          
          // 檢查是否還有更多資料
          if (data.aaData.length < limit) {
            hasMore = false
            console.log('🏁 已載入所有資料')
          }
        } else {
          hasMore = false
          console.log('📝 沒有更多資料')
        }
      } catch (parseError) {
        console.log(`❌ 第 ${currentPage + 1} 頁 JSON 解析失敗:`, parseError)
        break
      }
      
      currentPage++
      
      // 短暫延遲避免 API 請求過於頻繁
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    console.log(`📊 總計載入 ${allReports.length} 筆工作日報資料`)
    
    // 進行統計分析
    const dates = allReports
      .map((item: any[]) => item[2])
      .filter((date: string) => date && date !== '' && typeof date === 'string')
      .sort()
    
    const reportsByType: { [key: string]: number } = {}
    allReports.forEach((item: any[]) => {
      const type = item[3] || '其他'
      reportsByType[type] = (reportsByType[type] || 0) + 1
    })
    
    const uniqueDates = [...new Set(dates)].sort()
    const startDate = uniqueDates[0] || ''
    const latestDate = uniqueDates[uniqueDates.length - 1] || ''
    
    // 計算工作週數
    const start = startDate ? new Date(startDate) : new Date()
    const latest = latestDate ? new Date(latestDate) : new Date()
    const diffTime = latest.getTime() - start.getTime()
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    
    const stats = {
      totalReports: allReports.length,
      workingDays: uniqueDates.length,
      startDate,
      latestDate,
      averagePerWeek: diffWeeks > 0 ? Math.round((allReports.length / diffWeeks) * 10) / 10 : 0,
      reportsByType,
      totalDays: Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
      loadedPages: currentPage
    }
    
    console.log('📈 統計結果:', stats)
    
    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('❌ 統計分析錯誤:', error)
    return NextResponse.json(
      { error: '統計分析失敗', details: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    )
  }
}
