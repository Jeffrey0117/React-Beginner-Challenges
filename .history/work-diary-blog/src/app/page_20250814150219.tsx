'use client'

import { useState, useEffect } from 'react'

export default function HomePage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('載入統計資料失敗:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg">載入中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">工作日報儀表板</h1>
        <p className="text-gray-600">個人工作記錄與統計分析</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">總日報數</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total || 0}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">本月日報</h3>
            <p className="text-3xl font-bold text-green-600">{stats.thisMonth || 0}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">日報類型</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.types?.length || 0}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">總工時</h3>
            <p className="text-3xl font-bold text-orange-600">328h</p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/work-report" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-medium text-gray-900">查看所有日報</h3>
            <p className="text-sm text-gray-600">瀏覽全部工作日報記錄</p>
          </a>
          
          <button className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900">更新快取</h3>
            <p className="text-sm text-gray-600">重新載入最新資料</p>
          </button>
          
          <a href="/work-report/category/週會心得" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-medium text-gray-900">週會心得</h3>
            <p className="text-sm text-gray-600">查看週會相關記錄</p>
          </a>
        </div>
      </div>

      {stats?.types && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">日報類型分佈</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.types.map((type: any) => (
              <a 
                key={type.type} 
                href={`/work-report/category/${encodeURIComponent(type.type)}`}
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-medium text-gray-900">{type.type}</h4>
                <p className="text-sm text-gray-600">{type.count} 篇</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
