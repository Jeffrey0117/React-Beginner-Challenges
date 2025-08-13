# React 求職訓練營 🚀

> React 狀態管理的陷阱與技巧

## 📚 學習目標

透過實際練習來理解 React 狀態管理的常見陷阱，特別是初學者最容易遇到的問題。

---

## 🎯 第一題：Array.push 用在更新 state，居然不起作用了？

### 問題描述

點擊「新增 Kiki」按鈕後，為什麼畫面沒有出現變化呢？

### 錯誤程式碼

```jsx
const [users, setUsers] = useState(["Jeffrey", "Tony", "Amy"]);

const handleAddKiki = () => {
  users.push("Kiki"); // 直接修改原陣列
  setUsers(users); // 傳入同一個陣列參考
};
```

### 問題分析

1. **參考相等性問題**：`users.push('Kiki')` 修改了原陣列，但陣列的記憶體位址沒有改變
2. **React 的比較機制**：React 使用 `===` 來比較新舊 state
3. **結果**：React 認為沒有狀態變化，不會觸發重新渲染

### 解決方案

#### ✅ 方法 1：展開運算符

```jsx
const handleAddKiki = () => {
  users.push("Kiki");
  setUsers([...users]); // 創建新陣列
};
```

#### ✅ 方法 2：直接創建新陣列 (推薦)

```jsx
const handleAddKiki = () => {
  setUsers([...users, "Kiki"]); // 更乾淨的寫法
};
```

#### ✅ 方法 3：使用 concat

```jsx
const handleAddKiki = () => {
  setUsers(users.concat("Kiki")); // concat 返回新陣列
};
```

### 核心概念

- **不可變性 (Immutability)**：React 要求 state 是不可變的
- **淺比較**：React 只比較記憶體位址，不做深度比較
- **新記憶體 = 新狀態**：必須創建新的陣列/物件才會觸發更新

---

## 🧠 學習重點

### JavaScript 基礎知識

- ES6 解構賦值：`const [users, setUsers] = useState(...)`
- 展開運算符：`[...users, 'Kiki']`
- 參考型別 vs 原始型別
- 淺拷貝 vs 深拷貝

### React 核心機制

1. **狀態檢測**：比較記憶體位址
2. **虛擬 DOM 比較**：找出差異
3. **重新渲染**：更新必要的部分
4. **真實 DOM 更新**：最小化 DOM 操作

---

## 🚀 專案啟動

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

---

## 💡 練習建議

1. 先理解錯誤的原因
2. 嘗試不同的解決方案
3. 觀察 console.log 的輸出
4. 理解 React 的更新流程

---

## 📖 延伸學習

- React 官方文檔：State 和生命週期
- JavaScript ES6+ 語法
- 函數式程式設計概念
- React DevTools 的使用

---

**記住：在 React 中，狀態更新就是要創建新的記憶體空間！** 🎯
