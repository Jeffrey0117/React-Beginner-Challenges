# 01-06 發生不可預期的錯誤時，該怎麼解決呢？

## 題目說明

這個範例模擬了一個應用程式，其中有一段的畫面顯示依賴於使用者的登入狀態，同時我們希望在使用者登入後去執行資料獲取的操作。在已經知道這個邏輯需求的情況下，原本預期看到的畫面會是（請自行想像畫面）。

```jsx
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log("Checking user authentication status...");
    // 用 setTimeout 模擬登入的行為
    setTimeout(() => {
      setIsLoggedIn(true);
    }, 1000);
  }, []);

  // 使用者登入後才執行資料獲取
  if (isLoggedIn) {
    useEffect(() => {
      // 假設這裡是資料獲取邏輯
      console.log("Fetching user data...");
    }, []);
  }

  return (
    <div className="container">
      <h1>使用者{isLoggedIn ? "已登入" : "未登入"}</h1>
    </div>
  );
}
```

請說明這段程式碼為什麼會出現「Rendered more hooks than during the previous render」的錯誤，並嘗試解釋問題的原理。
