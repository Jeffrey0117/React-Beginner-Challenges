'use client'

import { useState, useEffect } from 'react'

interface WorkReport {
  DT_RowId: string
  Id: string
  日報時間: string
  日報內容: string
  日報類型: string
  工時: string
}

export default function WorkReportPage() {
  const [reports, setReports] = useState<WorkReport[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadReports = async (pageNum: number, append = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      const response = await fetch(`/api/work-report-v2?page=${pageNum}&limit=20`)
      const data = await response.json()

      if (data.success) {
        if (append) {
          setReports(prev => [...prev, ...data.data])
        } else {
          setReports(data.data)
        }
        setHasMore(data.pagination.hasMore)
      } else {
        console.error('載入失敗:', data.error)
      }
    } catch (error) {
      console.error('載入工作日報失敗:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    loadReports(1)
  }, [])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadReports(nextPage, true)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('zh-TW')
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg">載入工作日報中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">工作日報列表</h1>
        <div className="text-sm text-gray-600">
          共 {reports.length} 篇日報
        </div>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.DT_RowId} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {report.日報類型 || '未分類'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(report.日報時間)}
                </span>
                {report.工時 && (
                  <span className="text-sm text-gray-500">
                    工時: {report.工時}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-gray-700 whitespace-pre-wrap">
              {report.日報內容 || '無內容'}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            {loadingMore ? '載入中...' : '載入更多'}
          </button>
        </div>
      )}

      {!hasMore && reports.length > 0 && (
        <div className="text-center text-gray-500 py-6">
          已顯示全部日報
        </div>
      )}

      {reports.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-12">
          目前沒有工作日報
        </div>
      )}
    </div>
  )
}
