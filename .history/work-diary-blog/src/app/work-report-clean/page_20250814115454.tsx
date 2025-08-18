'use client'

import { useState, useEffect } from 'react'

export default function WorkReportCleanPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/work-report-v2')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知錯誤')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
            共 {data?.iTotalDisplayRecords || 0} 篇日報
          </p>
        </div>

        <div className="space-y-8">
          {data?.aaData?.map((item: any[], index: number) => {
            // 資料結構: item[2] = 日期, item[3] = 主題, item[8] = HTML 內容
            const date = item[2] || ''
            const title = item[3] || ''
            const htmlContent = item[8] || ''
            
            return (
              <article 
                key={index} 
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

        {/* 分頁資訊 */}
        {data?.aaData?.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <span className="text-sm text-gray-600">
                目前顯示 {data.aaData.length} 篇日報，共 {data.iTotalDisplayRecords} 篇
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
