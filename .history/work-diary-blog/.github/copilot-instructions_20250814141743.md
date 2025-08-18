# GitHub Copilot 專案指引

## 重要注意事項

### 1. 目錄操作規則
- **永遠使用完整路徑**: `cd "C:\Users\Jeffrey\Desktop\code\react-practice\work-diary-blog" && npm run dev`
- **不要使用相對路徑**: 避免使用 `cd ..` 或相對路徑操作
- **啟動開發服務器**: 固定使用 `cd "C:\Users\Jeffrey\Desktop\code\react-practice\work-diary-blog" && npm run dev`

### 2. 文件編輯注意事項
- 使用 `replace_string_in_file` 時，必須包含 3-5 行前後文來確保唯一匹配
- 避免直接覆蓋文件，優先使用編輯工具
- 如果文件損壞，重新建立而非重複修復

### 3. 專案結構
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

### 4. API 端點說明
- `/api/work-report-v2`: 主要工作日報 API，支援分頁和篩選
- `/api/cache`: 快取系統，用於提升效能
- `/api/stats`: 統計資料 API
- `/api/salary`: 薪資統計 API（6月152h + 7月176h = 328h）

### 5. 常見問題
- **類型篩選問題**: "週會心得" 等類型在統計中存在但篩選時找不到
- **服務器啟動**: 使用 localhost:3001 而非 3000
- **編碼問題**: 確保中文字元正確處理

### 6. 開發流程
1. 先確認在正確目錄
2. 使用固定命令啟動服務器
3. 檢查編譯錯誤
4. 測試 API 端點
5. 驗證前端功能

## 禁止操作
- ❌ 不要使用相對路徑切換目錄
- ❌ 不要在錯誤目錄執行 npm 命令
- ❌ 不要重複修復同一個損壞的文件
- ❌ 不要忽視 TypeScript 編譯錯誤

## 優先操作
- ✅ 使用完整路徑
- ✅ 檢查文件內容再編輯
- ✅ 測試 API 回應
- ✅ 驗證前端顯示結果
