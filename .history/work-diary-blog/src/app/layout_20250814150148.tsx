import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '工作日報系統',
  description: '個人工作日報管理系統',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">工作日報系統</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/" className="text-gray-600 hover:text-gray-900">首頁</a>
                  <a href="/work-report" className="text-gray-600 hover:text-gray-900">工作日報</a>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
