# GitHub Copilot 專案指引

## 重要注意事項

### 1. 項目路徑

- **正確路徑**: C:\Users\Jeffrey\Desktop\code\react-practice\work-diary-blog
- **開發服務器**: http://localhost:3001

### 2. 目錄操作規則 (PowerShell 語法)

- **永遠使用完整路徑**: `cd "C:\Users\Jeffrey\Desktop\code\react-practice\work-diary-blog"; npm run dev`
- **不要使用相對路徑**: 避免使用 `cd ..` 或相對路徑操作
- **啟動開發服務器**: 固定使用 `cd "C:\Users\Jeffrey\Desktop\code\react-practice\work-diary-blog"; npm run dev`
- **PowerShell 注意**: 使用 `;` 而非 `&&` 來連接命令

### 3. 文件編輯注意事項

- 使用 `replace_string_in_file` 時，必須包含 3-5 行前後文來確保唯一匹配
- 避免直接覆蓋文件，優先使用編輯工具
- 如果文件損壞，重新建立而非重複修復

### 4. 專案結構

```
work-diary-blog/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── work-report-v2/route.ts
│   │   │   ├── cache/route.ts
│   │   │   ├── stats/route.ts
│   │   │   └── salary/route.ts
│   │   ├── work-report/
│   │   │   └── category/[type]/page.tsx
│   │   └── page.tsx (主頁面)
│   └── components/
└── .env.local
```

### 5. API 端點說明

- `/api/work-report-v2`: 主要工作日報 API，支援分頁和篩選
- `/api/cache`: 快取系統，用於提升效能
- `/api/stats`: 統計資料 API
- `/api/salary`: 薪資統計 API（6 月 152h + 7 月 176h = 328h）

### 6. 常見問題

- **類型篩選問題**: "週會心得" 等類型在統計中存在但篩選時找不到
- **路徑混淆**: 專案位於 react-practice 子目錄中，不是直接在 code 目錄下

### 7. 禁止操作

- **不要刪除文件**: 如用戶所說 "他媽的別再刪除了"
- **不要重複修復**: 文件損壞時直接重建
- **不要使用錯誤路徑**: 避免使用 C:\Users\Jeffrey\Desktop\code\work-diary-blog
