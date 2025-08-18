'use client'

import { useState, useEffect } from 'react'

export default function WorkReportPage() {
  const [data, setData] = useState<any>(null)
  const [allReports, setAllReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchData = async (page: number = 0, append: boolean = false) => {
    try {
      if (!append) setLoading(true)
      else setLoadingMore(true)

      // 修改 API 呼叫參數來獲取更多資料
      const response = await fetch(`/api/work-report-v2?page=${page}&limit=20`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (append) {
        // 追加資料
        setAllReports(prev => [...prev, ...result.aaData])
      } else {
        // 初始載入
        setAllReports(result.aaData || [])
        setData(result)
      }

      // 檢查是否還有更多資料
      const totalLoaded = (page + 1) * 20
      setHasMore(totalLoaded < result.iTotalDisplayRecords)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchData(nextPage, true)
    }
  }

  useEffect(() => {
    fetchData(0, false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">載入工作日報中...</p>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">工作日報</h1>
          <p className="text-lg text-gray-600">
            已載入 {allReports.length} 篇日報，共 {data?.iTotalDisplayRecords || 0} 篇
          </p>
        </div>

        <div className="space-y-8">
          {allReports.map((item: any[], index: number) => {
            // 資料結構: item[2] = 日期, item[3] = 主題, item[8] = HTML 內容
            const date = item[2] || ''
            const title = item[3] || ''
            const htmlContent = item[8] || ''
            
            return (
              <article 
                key={`${date}-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* 日期與主題 */}
                  <header className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <time className="text-sm text-blue-600 font-medium">
                        {date}
                      </time>
                      <span className="text-sm text-gray-500">
                        #{index + 1}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {title}
                    </h2>
                  </header>

                  {/* HTML 內容渲染區 */}
                  <div 
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    style={{
                      lineHeight: '1.6',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    發布於 {date}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* 載入更多按鈕 */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loadingMore ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  載入中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  載入更多日報
                </>
              )}
            </button>
          </div>
        )}

        {/* 統計資訊 */}
        {!hasMore && allReports.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              已載入所有 {allReports.length} 篇工作日報
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
