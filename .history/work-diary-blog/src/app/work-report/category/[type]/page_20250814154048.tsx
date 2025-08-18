'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function CategoryPage() {
  const params = useParams()
  const categoryType = decodeURIComponent(params.type as string)
  
  const [data, setData] = useState<any>(null)
  const [filteredReports, setFilteredReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategoryData = async () => {
    try {
      setLoading(true)
      console.log(`🔍 開始載入 "${categoryType}" 類型的日報資料...`)

      // 使用統計 API 來獲取所有資料
      const response = await fetch('/api/stats')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const statsResult = await response.json()
      console.log('📊 從統計 API 收到資料:', statsResult)
      
      if (statsResult.error) {
        throw new Error(statsResult.error)
      }

      // 現在載入實際的工作日報資料來進行篩選
      let allReports: any[] = []
      let currentPage = 0
      const limit = 50
      let hasMore = true
      
      while (hasMore && currentPage < 20) { // 限制最多 20 頁
        console.log(`📄 載入第 ${currentPage + 1} 頁工作日報資料`)
        const reportResponse = await fetch(`/api/work-report-v2?page=${currentPage}&limit=${limit}`)
        
        if (!reportResponse.ok) {
          console.log(`❌ 第 ${currentPage + 1} 頁載入失敗`)
          break
        }
        
        const reportResult = await reportResponse.json()
        
        if (reportResult.aaData && reportResult.aaData.length > 0) {
          allReports = [...allReports, ...reportResult.aaData]
          console.log(`✅ 第 ${currentPage + 1} 頁載入成功: ${reportResult.aaData.length} 筆資料`)
          
          if (reportResult.aaData.length < limit) {
            hasMore = false
          }
        } else {
          hasMore = false
        }
        
        currentPage++
        await new Promise(resolve => setTimeout(resolve, 100)) // 短暫延遲
      }
      
      console.log(`📊 總共載入 ${allReports.length} 筆工作日報資料`)
      
      // 篩選特定類型的日報 - 精確匹配
      const filtered = allReports.filter((item: any[]) => {
        const type = item[3] || ''
        console.log(`🔍 檢查日報類型: "${type}" vs 目標類型: "${categoryType}"`)
        return type.trim() === categoryType.trim()
      })
      
      console.log(`📊 篩選結果: ${filtered.length} 篇 "${categoryType}" 類型的日報`)
      setFilteredReports(filtered)
      setData({ aaData: allReports })
      
    } catch (err) {
      console.error('❌ 載入類型日報失敗:', err)
      setError(err instanceof Error ? err.message : '未知錯誤')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryData()
  }, [categoryType])

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">載入 {categoryType} 類型日報中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">載入失敗</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* 麵包屑導航 */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">首頁</Link>
          <span>/</span>
          <Link href="/work-report" className="hover:text-blue-600 transition-colors">工作日報</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{categoryType}</span>
        </nav>

        {/* 標題區域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categoryType}
          </h1>
          <p className="text-lg text-gray-600">
            共找到 <span className="font-semibold text-blue-600">{filteredReports.length}</span> 篇相關日報
          </p>
        </div>

        {/* 日報列表 */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">沒有找到相關日報</h3>
            <p className="text-gray-500 mb-6">「{categoryType}」類型的日報目前為空</p>
            <Link 
              href="/work-report"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              查看所有日報
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredReports.map((item: any[], index: number) => {
              const date = item[2] || ''
              const title = item[3] || '無標題'
              const htmlContent = item[8] || ''
              const plainContent = stripHtmlTags(htmlContent)
              const preview = plainContent.length > 200 
                ? plainContent.substring(0, 200) + '...' 
                : plainContent

              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-500">
                          {formatDate(date)}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {categoryType}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {title}
                    </h2>
                    
                    {plainContent && (
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {preview}
                      </p>
                    )}
                    
                    {htmlContent && htmlContent !== plainContent && (
                      <details className="mt-6">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                          查看完整內容
                        </summary>
                        <div 
                          className="mt-4 p-4 bg-gray-50 rounded-lg prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                      </details>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 返回按鈕 */}
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors mr-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首頁
          </Link>
          <Link 
            href="/work-report"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            查看所有日報
          </Link>
        </div>
      </div>
    </div>
  )
}
