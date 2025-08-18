# 05 - 條件渲染怎麼多了個 0 啊？

## 題目說明

請完成一個簡單的 friends 條件渲染元件。
當 friends 資料還沒回來時，畫面會多出一個 0，這不是你想要的結果。

請思考為什麼？要怎麼修正？

### Starter Code

```jsx
import React, { useEffect, useState } from "react";

const DEFAULT_LIST_FOR_DEMO = [
  { id: 1, name: "Danny" },
  { id: 2, name: "May" },
  { id: 3, name: "Wang" },
];

export default function App() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // 模擬 fetch 資料
    setTimeout(() => {
      setFriends(DEFAULT_LIST_FOR_DEMO);
    }, 1500);
  }, []);

  return (
    <div className="container">
      {/* 你希望有朋友時顯示列表，沒朋友時顯示 sorry，但畫面會多一個 0 */}
      {friends.length && (
        <div>
          {friends.map((friend) => (
            <div key={friend.id}>This is your friend, {friend.name}</div>
          ))}
        </div>
      )}
      {!friends.length && <p>I am sorry, you have no friends</p>}
    </div>
  );
}
```

---

### 檔案路徑

- 題目程式碼：`problem/app.jsx`
- 解答程式碼：`solution/README.md`
