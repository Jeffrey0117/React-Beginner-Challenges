# 解答程式碼

```jsx
import React, { useState } from "react";

function Form() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <form>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="age"
        value={form.age}
        onChange={handleChange}
        placeholder="Age"
      />
    </form>
  );
}

export default Form;
```

# 解決方案說明：避免重複的 handleChange

## 最佳實踐

只寫一個通用的 handleChange，根據 input 的 `name` 屬性來更新對應的 state。

## 為什麼這樣做？

- 減少重複的 handler function，讓程式碼更簡潔、好維護。
- 只要 input 的 `name` 屬性對應到 state 的 key，就能用同一個 handler 處理所有欄位。

## 實作重點

- input 的 `name` 屬性要和 state 的 key 完全一致。
- handleChange 只寫一次，利用 `e.target.name` 和 `e.target.value` 動態更新對應欄位。

## 好處

- 程式碼更 DRY（Don't Repeat Yourself）。
- 新增欄位時只要加一個 input，不用再寫 handler。
- 維護、擴充都更容易。
