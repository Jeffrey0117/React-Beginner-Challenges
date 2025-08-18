import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              工作日報部落格
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              記錄工作心得、分享技術經驗、追蹤專案進度。讓每一天的成長都被記錄下來。
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/work-report"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                查看工作日報
              </Link>
              <Link
                href="/work-report-debug"
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-300 transition-colors"
              >
                除錯模式
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Link
            href="/work-report"
            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">工作日報</h3>
            <p className="text-gray-600">
              查看和管理日常工作記錄，追蹤工作進度和成果，記錄每日心得與學習。
            </p>
            <div className="mt-4 text-blue-600 font-medium">
              查看詳情 →
            </div>
          </Link>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">統計分析</h3>
            <p className="text-gray-600">
              工作效率分析、時間分配統計、進度追蹤報表，幫助優化工作流程。
            </p>
            <div className="mt-4 text-gray-400 font-medium">
              即將推出
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">知識分享</h3>
            <p className="text-gray-600">
              技術筆記、經驗分享、問題解決方案，建立個人知識庫和學習記錄。
            </p>
            <div className="mt-4 text-gray-400 font-medium">
              即將推出
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">目前狀態</h2>
            <p className="text-gray-600">系統運行狀態和資料統計</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98+</div>
              <div className="text-gray-600">工作日報</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">系統運行</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">5+</div>
              <div className="text-gray-600">過濾派工單</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-600">資料同步</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
