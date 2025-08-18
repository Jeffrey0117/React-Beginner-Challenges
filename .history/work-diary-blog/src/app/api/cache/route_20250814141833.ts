import { NextResponse } from 'next/server'

interface CachedData {
  data: any[]
  lastUpdated: string
  totalRecords: number
}

// 模擬本地快取 - 在實際環境中應使用資料庫或 Redis
let cachedWorkReports: CachedData | null = null

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const forceUpdate = searchParams.get('forceUpdate') === 'true'
  
  try {
    // 檢查是否需要更新快取
    const shouldUpdate = forceUpdate || 
                        !cachedWorkReports || 
                        isDataStale(cachedWorkReports.lastUpdated)
    
    if (shouldUpdate) {
      console.log('🔄 開始更新工作日報快取資料...')
      await updateCache()
    } else {
      console.log('✅ 使用快取的工作日報資料')
    }
    
    if (!cachedWorkReports) {
      return NextResponse.json({ error: '無法載入資料' }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      data: cachedWorkReports.data,
      totalRecords: cachedWorkReports.totalRecords,
      lastUpdated: cachedWorkReports.lastUpdated,
      cached: !shouldUpdate
    })
    
  } catch (error) {
    console.error('❌ 快取管理錯誤:', error)
    return NextResponse.json(
      { error: '資料載入失敗', details: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    )
  }
}

// 檢查資料是否過期 (超過1天)
function isDataStale(lastUpdated: string): boolean {
  const lastUpdateTime = new Date(lastUpdated).getTime()
  const now = new Date().getTime()
  const oneDayInMs = 24 * 60 * 60 * 1000
  
  return (now - lastUpdateTime) > oneDayInMs
}

// 更新快取資料
async function updateCache(): Promise<void> {
  let allReports: any[] = []
  let currentPage = 0
  const limit = 50
  let hasMore = true
  
  console.log('🔍 開始載入所有工作日報資料到快取')
  
  while (hasMore && currentPage < 20) {
    try {
      const startIndex = currentPage * limit
      const apiUrl = `https://eip.polaris.tw/work_report/gen_json.php?sEcho=2&iColumns=9&sColumns=&iDisplayStart=${startIndex}&iDisplayLength=${limit}&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2&mDataProp_3=3&mDataProp_4=4&mDataProp_5=5&mDataProp_6=6&mDataProp_7=7&mDataProp_8=8&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&sSearch_7=&bRegex_7=false&bSearchable_7=true&sSearch_8=&bRegex_8=false&bSearchable_8=true&_=${Date.now()}`
      
      console.log(`📄 載入第 ${currentPage + 1} 頁 (從 ${startIndex} 開始)`)
      
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
        
        if (data.aaData.length < limit) {
          hasMore = false
        }
      } else {
        hasMore = false
      }
      
      currentPage++
      await new Promise(resolve => setTimeout(resolve, 200))
      
    } catch (error) {
      console.log(`❌ 第 ${currentPage + 1} 頁載入錯誤:`, error)
      break
    }
  }
  
  // 更新快取
  cachedWorkReports = {
    data: allReports,
    totalRecords: allReports.length,
    lastUpdated: new Date().toISOString()
  }
  
  console.log(`💾 快取更新完成: ${allReports.length} 筆工作日報資料`)
}
