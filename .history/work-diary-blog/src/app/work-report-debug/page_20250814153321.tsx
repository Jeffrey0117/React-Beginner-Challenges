'use client'

import { useState, useEffect } from 'react'

export default function WorkReportDebugPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rawResponse, setRawResponse] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/work-report-v2')
        const text = await response.text()
        setRawResponse(text)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = JSON.parse(text)
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
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">工作日報 - 除錯模式</h1>
          <div className="bg-white rounded-lg p-6">
            <p>載入中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">工作日報 - 除錯模式</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">錯誤</h2>
            <p className="text-red-600">{error}</p>
            <details className="mt-4">
              <summary className="cursor-pointer text-red-700 font-medium">原始回應</summary>
              <pre className="mt-2 p-3 bg-red-100 rounded text-sm overflow-auto">
                {rawResponse}
              </pre>
            </details>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">工作日報 - 除錯模式</h1>

        {/* 統計資訊 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800">原始總數</h3>
            <p className="text-2xl font-bold text-blue-600">{data?.originalTotal || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800">修正總數</h3>
            <p className="text-2xl font-bold text-green-600">{data?.iTotalRecords || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800">顯示筆數</h3>
            <p className="text-2xl font-bold text-purple-600">{data?.iTotalDisplayRecords || 0}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800">已過濾</h3>
            <p className="text-2xl font-bold text-red-600">{data?.filtered || 0}</p>
          </div>
        </div>

        {/* 資料表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">工作日報資料</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">欄位 1</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">欄位 2</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">欄位 3</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">欄位 4</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">欄位 5</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">所有內容</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.aaData?.map((item: any[], index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={String(item[0] || '')}>
                        {String(item[0] || '').substring(0, 50)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={String(item[1] || '')}>
                        {String(item[1] || '').substring(0, 50)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={String(item[2] || '')}>
                        {String(item[2] || '').substring(0, 50)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={String(item[3] || '')}>
                        {String(item[3] || '').substring(0, 50)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={String(item[4] || '')}>
                        {String(item[4] || '').substring(0, 50)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <details>
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                          查看完整資料
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 原始回應 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">原始 API 回應</h2>
          </div>
          <div className="p-6">
            <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
