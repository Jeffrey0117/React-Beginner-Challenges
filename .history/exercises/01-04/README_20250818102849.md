# 04 - 避免重複的 handleChange

## 題目說明

請完成一個表單，包含三個欄位：`name`、`email`、`age`。
starter code 為每個 input 都寫一個 `handleChange`，導致重複程式碼。
請思考如何優化，讓程式更乾淨。

### Starter Code

```jsx
import React, { useState } from "react";

function Form() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  function handleNameChange(e) {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  }
  function handleEmailChange(e) {
    setForm((prev) => ({ ...prev, email: e.target.value }));
  }
  function handleAgeChange(e) {
    setForm((prev) => ({ ...prev, age: e.target.value }));
  }

  return (
    <form>
      <input
        name="name"
        value={form.name}
        onChange={handleNameChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      <input
        name="age"
        value={form.age}
        onChange={handleAgeChange}
        placeholder="Age"
      />
    </form>
  );
}

export default Form;
```

---

### 檔案路徑

- 題目程式碼：`problem/app.jsx`
- 解答程式碼：`solution/app.jsx`

---

## 補充說明

- 請思考：有沒有辦法只用一個 handler 處理所有 input？
- 可以善用 input 的 `name` 屬性與 state 結構。
- 盡量讓程式碼更 DRY（Don't Repeat Yourself）。
