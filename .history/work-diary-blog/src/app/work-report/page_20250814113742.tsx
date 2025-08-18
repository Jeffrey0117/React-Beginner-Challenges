'use client'

import { useState, useEffect } from 'react'

interface WorkReportData {
  sEcho: number
  iTotalRecords: number
  iTotalDisplayRecords: number
  aaData: any[][]
}

export default function WorkReportPage() {
  const [workReports, setWorkReports] = useState<WorkReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [limit] = useState(10)

  const fetchWorkReports = async (currentPage: number = 0) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/work-report?page=${currentPage * limit}&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch work reports')
      }

      const data = await response.json()
      console.log('前端收到的資料:', data)
      console.log('aaData:', data.aaData)
      setWorkReports(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching work reports:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkReports(page)
  }, [page])

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (workReports && (page + 1) * limit < workReports.iTotalRecords) {
      setPage(page + 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">錯誤</h2>
            <p>{error}</p>
            <button
              onClick={() => fetchWorkReports(page)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              重新載入
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">工作日報</h1>
          <p className="mt-2 text-gray-600">
            總共 {workReports?.iTotalRecords || 0} 筆記錄（已過濾派工單）
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* 根據實際 API 回傳的欄位調整表頭 */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    工作內容
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    優先級
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    類別
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workReports?.aaData?.map((report, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {page * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report[0] || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={report[1] || '-'}>
                        {report[1] || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report[2] || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分頁控制 */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                  顯示第{' '}
                  <span className="font-medium">{page * limit + 1}</span>
                  {' '}到{' '}
                  <span className="font-medium">
                    {Math.min((page + 1) * limit, workReports?.iTotalRecords || 0)}
                  </span>
                  {' '}項，共{' '}
                  <span className="font-medium">{workReports?.iTotalRecords || 0}</span>
                  {' '}項
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一頁
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    第 {page + 1} 頁
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={!workReports || (page + 1) * limit >= workReports.iTotalRecords}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一頁
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
