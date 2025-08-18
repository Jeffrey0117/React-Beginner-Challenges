import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      {/* 正確做法：用 typeof 或 !== 0 或三元運算子避免 0 被渲染 */}
      {count !== 0 && <p>目前計數：{count}</p>}
    </div>
  );
}

export default Counter;
