# Work Diary Blog

私人工作日報部落格系統，用於記錄和管理日常工作進度。

## 🚀 功能特色

- **工作日報管理** - 查看和篩選工作日報記錄
- **自動過濾** - 自動過濾派工單，只顯示工作日報
- **響應式設計** - 支援各種裝置瀏覽
- **即時同步** - 與外部 API 同步資料

## 🛠️ 技術棧

- **Next.js 15** - React 框架
- **TypeScript** - 類型安全
- **Tailwind CSS** - 樣式框架
- **Turbopack** - 快速建置

## 🏃‍♂️ 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 瀏覽器開啟 http://localhost:3000
```

## 📁 專案結構

```
src/
├── app/
│   ├── api/                 # API 路由
│   ├── work-report/         # 工作日報頁面
│   ├── work-report-debug/   # 除錯模式
│   └── globals.css         # 全域樣式
├── components/
│   └── Navigation.tsx      # 導航元件
└── ...
```

## 🔧 環境設定

創建 `.env.local` 檔案：

```env
WORK_REPORT_COOKIE=your_cookie_here
```

## 📝 主要頁面

- **首頁** (`/`) - 專案介紹和導航
- **工作日報** (`/work-report`) - 主要日報檢視頁面
- **除錯模式** (`/work-report-debug`) - 開發和除錯用

## 🎯 未來規劃

- [ ] 統計分析功能
- [ ] 知識分享區塊
- [ ] 資料匯出功能
- [ ] 搜尋和篩選優化

---

_最後更新: 2025 年 8 月 14 日_
