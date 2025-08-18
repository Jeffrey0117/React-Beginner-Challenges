'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DashboardStats {
  totalReports: number
  workingDays: number
  startDate: string
  latestDate: string
  averagePerWeek: number
  reportsByType: { [key: string]: number }
}

interface SalaryStats {
  records: Array<{
    month: string
    year: number
    salary: number
    laborInsurance: number
    healthInsurance: number
    netSalary: number
    isFullMonth: boolean
    hourlyWage: number
    actualWorkingHours?: number
  }>
  summary: {
    totalSalary: number
    totalLaborInsurance: number
    totalHealthInsurance: number
    totalInsurance: number
    averageSalary: number
    currentHourlyWage: number
    totalWorkingHours: number
    averageWorkingHours: number
    monthsWorked: number
    latestMonth: string
    latestYear: number
  }
}

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [salaryStats, setSalaryStats] = useState<SalaryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        console.log('🔄 開始載入完整統計資料...')
        
        // 同時載入工作日報和薪資統計
        const [workReportResponse, salaryResponse] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/salary')
        ])
        
        if (!workReportResponse.ok) {
          throw new Error(`Work report API error: ${workReportResponse.status}`)
        }
        
        if (!salaryResponse.ok) {
          throw new Error(`Salary API error: ${salaryResponse.status}`)
        }
        
        const workReportResult = await workReportResponse.json()
        const salaryResult = await salaryResponse.json()
        
        console.log('📊 收到工作日報統計:', workReportResult)
        console.log('💰 收到薪資統計:', salaryResult)
        
        if (workReportResult.error) {
          throw new Error(workReportResult.error)
        }
        
        if (salaryResult.error) {
          throw new Error(salaryResult.error)
        }
        
        const dashboardStats: DashboardStats = {
          totalReports: workReportResult.totalReports || 0,
          workingDays: workReportResult.workingDays || 0,
          startDate: workReportResult.startDate || '',
          latestDate: workReportResult.latestDate || '',
          averagePerWeek: workReportResult.averagePerWeek || 0,
          reportsByType: workReportResult.reportsByType || {}
        }
        
        console.log('✅ 統計資料載入完成:', dashboardStats)
        setStats(dashboardStats)
        setSalaryStats(salaryResult)
      } catch (err) {
        console.error('❌ 載入統計資料失敗:', err)
        setError(err instanceof Error ? err.message : '載入失敗')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const calculateWorkingDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">載入 Dashboard 中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <h2 className="text-xl font-semibold text-red-800 mb-4">載入失敗</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            重新載入
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* 標題區域 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            工作日報 Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Jeffrey 的工作旅程統計面板
          </p>
          
          {stats && (
            <div className="inline-block bg-white px-8 py-4 rounded-2xl shadow-lg border border-gray-100">
              <p className="text-lg text-gray-700">
                從 <span className="font-semibold text-blue-600">{formatDate(stats.startDate)}</span> 開始
                到 <span className="font-semibold text-purple-600">{formatDate(stats.latestDate)}</span>
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                已工作 <span className="text-green-600">{calculateWorkingDays(stats.startDate, stats.latestDate)}</span> 天
              </p>
            </div>
          )}
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">總日報數</h3>
            <p className="text-4xl font-bold text-blue-600">{stats?.totalReports || 0}</p>
            <p className="text-sm text-gray-500 mt-2">已撰寫的工作日報</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h.5a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H8.5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5H8zM8 7v10a1 1 0 001 1h6a1 1 0 001-1V7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">工作日數</h3>
            <p className="text-4xl font-bold text-green-600">{stats?.workingDays || 0}</p>
            <p className="text-sm text-gray-500 mt-2">有記錄的工作天</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">週平均</h3>
            <p className="text-4xl font-bold text-purple-600">{stats?.averagePerWeek || 0}</p>
            <p className="text-sm text-gray-500 mt-2">每週平均日報數</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">總天數</h3>
            <p className="text-4xl font-bold text-orange-600">
              {stats && calculateWorkingDays(stats.startDate, stats.latestDate)}
            </p>
            <p className="text-sm text-gray-500 mt-2">從開始到現在</p>
          </div>
        </div>

        {/* 薪資統計區塊 */}
        {salaryStats && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">薪資統計</h2>
              <p className="text-lg text-gray-600">
                目前時薪 <span className="font-semibold text-green-600">NT$ {salaryStats.summary.currentHourlyWage}</span>
                ・已工作 <span className="font-semibold text-blue-600">{salaryStats.summary.monthsWorked}</span> 個月
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">累積薪資</h3>
                <p className="text-4xl font-bold text-green-600">
                  {salaryStats.summary.totalSalary.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">總實領金額</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">平均月薪</h3>
                <p className="text-4xl font-bold text-blue-600">
                  {salaryStats.summary.averageSalary.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">月平均收入</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">保險自付額</h3>
                <p className="text-4xl font-bold text-red-600">
                  {salaryStats.summary.totalInsurance.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">勞健保總額</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">總工時</h3>
                <p className="text-4xl font-bold text-purple-600">
                  {salaryStats.summary.totalWorkingHours}
                </p>
                <p className="text-sm text-gray-500 mt-2">累積工作小時</p>
              </div>
            </div>

            {/* 月薪資詳細 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">月薪資明細</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {salaryStats.records.map((record, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {record.year} 年 {record.month}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.isFullMonth 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.isFullMonth ? '足月' : '不足月'}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">實領薪資</span>
                        <span className="font-semibold text-green-600">
                          NT$ {record.salary.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">勞保自付額</span>
                        <span className="font-medium text-red-600">
                          NT$ {record.laborInsurance}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">健保自付額</span>
                        <span className="font-medium text-red-600">
                          NT$ {record.healthInsurance}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">時薪</span>
                        <span className="font-medium text-blue-600">
                          NT$ {record.hourlyWage}
                        </span>
                      </div>
                      
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-600">實際工時</span>
                        <span className="font-semibold text-purple-600">
                          {record.actualWorkingHours || Math.round(record.salary / record.hourlyWage)} 小時
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 日報類型分布 */}
        {stats?.reportsByType && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">日報類型分布</h2>
            <p className="text-gray-600 mb-6">點擊類型查看該類型的所有日報</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.reportsByType)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count], index) => (
                <Link 
                  key={type} 
                  href={`/work-report/category/${encodeURIComponent(type)}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 transition-transform group-hover:scale-110 ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-orange-500' :
                      'bg-gray-400'
                    }`}></div>
                    <span className="text-gray-700 font-medium group-hover:text-blue-700 transition-colors">{type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{count}</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 快速導航 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">快速導航</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/work-report"
              className="group bg-white px-8 py-4 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500 mr-3 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">瀏覽工作日報</h3>
                  <p className="text-sm text-gray-500">查看所有工作日報內容</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/work-report-debug"
              className="group bg-white px-8 py-4 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-500 mr-3 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600">除錯模式</h3>
                  <p className="text-sm text-gray-500">查看原始資料結構</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
