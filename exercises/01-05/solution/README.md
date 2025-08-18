# 解決方案說明：條件渲染多了個 0？

## 解答程式碼

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
    setTimeout(() => {
      setFriends(DEFAULT_LIST_FOR_DEMO);
    }, 1500);
  }, []);

  return (
    <div className="container">
      {/* 正確做法：用 friends.length > 0 或三元運算子避免 0 被渲染 */}
      {friends.length > 0 ? (
        <div>
          {friends.map((friend) => (
            <div key={friend.id}>This is your friend, {friend.name}</div>
          ))}
        </div>
      ) : (
        <p>I am sorry, you have no friends</p>
      )}
    </div>
  );
}
```

## 為什麼會多一個 0？

- 在 React 中，`{friends.length && ...}` 如果 friends.length 是 0，JSX 會直接渲染 0（因為 0 是 falsy，但會被當作內容渲染）。
- 所以當 friends.length = 0 時，畫面會出現一個 0。

## 正確做法

- 用 `{friends.length > 0 && ...}` 或三元運算子：`{friends.length > 0 ? ... : ...}`
- 這樣 0 就不會被渲染到畫面上。

## 小結

- 條件渲染時要注意 0、空字串、null、undefined 等 falsy 值的渲染行為。
- 這是 React 新手常見陷阱！
