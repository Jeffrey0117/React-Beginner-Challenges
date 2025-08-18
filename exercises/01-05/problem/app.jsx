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
          {friends.map(friend => (
            <div key={friend.id}>This is your friend, {friend.name}</div>
          ))}
        </div>
      )}
      {!friends.length && <p>I am sorry, you have no friends</p>}
    </div>
  );
}
