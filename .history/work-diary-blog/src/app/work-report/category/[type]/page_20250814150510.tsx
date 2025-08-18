'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface WorkReport {
  DT_RowId: string
  Id: string
  日報時間: string
  日報內容: string
  日報類型: string
  工時: string
}

export default function CategoryPage() {
  const params = useParams()
  const type = decodeURIComponent(String(params.type || ''))
  
  const [reports, setReports] = useState<WorkReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadReports = async (pageNum: number, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true)
        setError(null)
      }

      const response = await fetch(`/api/work-report-v2?page=${pageNum}&limit=20&type=${encodeURIComponent(type)}`)
      const data = await response.json()

      if (data.success) {
        if (append) {
          setReports(prev => [...prev, ...data.data])
        } else {
          setReports(data.data)
        }
        setHasMore(data.pagination.hasMore)
      } else {
        setError(data.error || '載入失敗')
      }
    } catch (err) {
      setError('網路錯誤，請稍後再試')
      console.error('載入類別日報失敗:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (type) {
      loadReports(1)
    }
  }, [type])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadReports(nextPage, true)
  }

  const refreshCache = async () => {
    try {
      await fetch('/api/cache', { method: 'POST' })
      // 重新載入資料
      setPage(1)
      loadReports(1)
    } catch (error) {
      console.error('重新整理快取失敗:', error)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg">載入 "{type}" 相關日報中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{type}</h1>
          <p className="text-gray-600 mt-1">共找到 {reports.length} 篇相關日報</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={refreshCache}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            重新整理
          </button>
          <a
            href="/work-report"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            返回全部
          </a>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          錯誤: {error}
        </div>
      )}

      {reports.length === 0 && !loading && !error && (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">找不到 "{type}" 類型的日報</p>
          <p className="mt-2">可能需要重新整理資料或檢查篩選條件</p>
        </div>
      )}

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.DT_RowId} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {String(report.日報類型) || '未分類'}
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
            
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {report.日報內容 || '無內容'}
            </div>
          </div>
        ))}
      </div>

      {hasMore && reports.length > 0 && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? '載入中...' : '載入更多'}
          </button>
        </div>
      )}

      {!hasMore && reports.length > 0 && (
        <div className="text-center text-gray-500 py-6">
          已顯示全部 "{type}" 日報
        </div>
      )}
    </div>
  )
}
