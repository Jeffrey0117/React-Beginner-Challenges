'use client'

import { useState, useEffect } from 'react'

interface WorkReportItem {
  id: string
  date: string
  content: string
  status: string
  priority: string
  category: string
}

interface WorkReportResponse {
  sEcho: number
  iTotalRecords: number
  iTotalDisplayRecords: number
  aaData: any[][]
  message?: string
  error?: string
  type?: string
  originalTotal?: number
  filtered?: number
}

export default function WorkReportV2Page() {
  const [workReports, setWorkReports] = useState<WorkReportResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [limit] = useState(10)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const fetchWorkReports = async (currentPage: number = 0) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log(`🔍 正在載入第 ${currentPage + 1} 頁資料...`)
      
      const response = await fetch(`/api/work-report-v2?page=${currentPage * limit}&limit=${limit}`)
      const data = await response.json()
      
      console.log('📦 收到回應:', data)
      setDebugInfo(data)

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`)
      }

      if (data.error) {
        setError(`${data.error}: ${data.message}`)
        return
      }

      setWorkReports(data)
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '載入失敗'
      setError(errorMsg)
      console.error('❌ 載入錯誤:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkReports(page)
  }, [page])

  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (workReports && (page + 1) * limit < workReports.iTotalRecords) {
      setPage(page + 1)
    }
  }

  const renderTableHeaders = () => {
    // 根據實際資料結構調整表頭
    return (
      <tr className="bg-gray-100">
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">序號</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">欄位1</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">欄位2</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">欄位3</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">欄位4</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">欄位5</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">操作</th>
      </tr>
    )
  }

  const renderTableRow = (item: any[], index: number) => {
    return (
      <tr key={index} className="hover:bg-gray-50 border-b">
        <td className="px-4 py-3 text-sm text-gray-900">{page * limit + index + 1}</td>
        {item.map((cell, cellIndex) => (
          <td key={cellIndex} className="px-4 py-3 text-sm text-gray-900 max-w-xs">
            <div className="truncate" title={String(cell || '')}>
              {cell || '-'}
            </div>
          </td>
        ))}
        <td className="px-4 py-3 text-sm text-gray-900">
          <button className="text-blue-600 hover:text-blue-800 text-xs">
            查看詳情
          </button>
        </td>
      </tr>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入工作日報中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">工作日報系統 v2</h1>
          <p className="mt-2 text-gray-600">
            {workReports 
              ? `共 ${workReports.iTotalRecords} 筆記錄${workReports.filtered ? `（已過濾 ${workReports.filtered} 筆派工單）` : ''}`
              : '載入中...'}
          </p>
        </div>

        {/* 錯誤顯示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">載入錯誤</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <div className="mt-3">
                  <button
                    onClick={() => fetchWorkReports(page)}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm text-red-800 hover:bg-red-200"
                  >
                    重新載入
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 調試資訊 (開發模式) */}
        {debugInfo && process.env.NODE_ENV === 'development' && (
          <details className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <summary className="cursor-pointer text-sm font-medium text-yellow-800">
              🐛 調試資訊 (點擊展開)
            </summary>
            <pre className="mt-2 text-xs text-yellow-700 bg-yellow-100 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}

        {/* 資料表格 */}
        {workReports && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  {renderTableHeaders()}
                </thead>
                <tbody>
                  {workReports.aaData && workReports.aaData.length > 0 ? (
                    workReports.aaData.map((item, index) => renderTableRow(item, index))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">沒有資料</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {workReports.message || '目前沒有可顯示的工作日報記錄'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 分頁控制 */}
            {workReports.aaData && workReports.aaData.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一頁
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={!workReports || (page + 1) * limit >= workReports.iTotalRecords}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一頁
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      顯示第 <span className="font-medium">{page * limit + 1}</span> 到{' '}
                      <span className="font-medium">
                        {Math.min((page + 1) * limit, workReports.iTotalRecords)}
                      </span>{' '}
                      項，共 <span className="font-medium">{workReports.iTotalRecords}</span> 項
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={handlePreviousPage}
                        disabled={page === 0}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        上一頁
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        第 {page + 1} 頁
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={!workReports || (page + 1) * limit >= workReports.iTotalRecords}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        下一頁
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
