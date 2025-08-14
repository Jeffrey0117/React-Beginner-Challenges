# 解答：Array.push 更新 state 問題

## 🟢 解決方案

### ✅ 方法 1：展開運算符（最常用）

```jsx
const handleAddKiki = () => {
  setUsers([...users, "Kiki"]); // 創建新陣列
};
```

### ✅ 方法 2：使用 concat

```jsx
const handleAddKiki = () => {
  setUsers(users.concat("Kiki")); // concat 返回新陣列
};
```

### ✅ 方法 3：防止重複新增

```jsx
const handleAddKiki = () => {
  if (!users.includes("Kiki")) {
    setUsers([...users, "Kiki"]);
  }
};
```

## 🧠 原理解釋

### **問題根源：參考相等性**

```jsx
const [users, setUsers] = useState(["Jeffrey", "Tony", "Amy"]);

const handleAddKiki = () => {
  users.push("Kiki"); // 修改原陣列，記憶體位址不變
  setUsers(users); // 傳入同一個陣列參考

  // React 的判斷：
  // oldUsers === newUsers  // true！同一個陣列物件
  // 結論：沒有變化，不重新渲染
};
```

### **React 的比較機制**

```jsx
// React 內部類似這樣比較：
function useState(initialState) {
  let state = initialState;

  function setState(newState) {
    if (newState === state) {
      // 淺比較！
      return; // 不重新渲染
    }
    state = newState;
    rerender(); // 觸發重新渲染
  }

  return [state, setState];
}
```

## 📚 核心概念

### **1. 不可變性 (Immutability)**

```jsx
// ❌ 可變操作：修改原陣列
const originalArray = [1, 2, 3];
originalArray.push(4); // 修改原陣列
console.log(originalArray); // [1, 2, 3, 4]

// ✅ 不可變操作：創建新陣列
const originalArray = [1, 2, 3];
const newArray = [...originalArray, 4]; // 創建新陣列
console.log(originalArray); // [1, 2, 3] (不變)
console.log(newArray); // [1, 2, 3, 4] (新的)
```

### **2. 陣列操作對照表**

| 操作 | ❌ 會修改原陣列                         | ✅ 不會修改原陣列            |
| ---- | --------------------------------------- | ---------------------------- |
| 新增 | `push()`, `unshift()`                   | `[...arr, item]`, `concat()` |
| 刪除 | `pop()`, `shift()`, `splice()`          | `filter()`, `slice()`        |
| 修改 | `arr[i] = value`, `sort()`, `reverse()` | `map()`, `[...arr].sort()`   |

### **3. 記憶體視角**

```javascript
// 視覺化記憶體位址：
let arr1 = ["A", "B"]; // 記憶體位址: 0x1000
let arr2 = arr1; // 記憶體位址: 0x1000 (同一個！)
let arr3 = [...arr1]; // 記憶體位址: 0x2000 (新的！)

arr1.push("C");
console.log(arr1); // ['A', 'B', 'C']
console.log(arr2); // ['A', 'B', 'C'] (也被影響了！)
console.log(arr3); // ['A', 'B'] (不受影響)

// React 的比較：
console.log(arr1 === arr2); // true  (同一個物件)
console.log(arr1 === arr3); // false (不同物件)
```

## 💡 實用模式

### **複雜陣列操作**

```jsx
// 新增多個項目
setUsers([...users, "Kiki", "Amy", "Tony"]);

// 在特定位置插入
const insertAt = (arr, index, item) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index),
];
setUsers(insertAt(users, 1, "Kiki"));

// 更新特定項目
setUsers(
  users.map((user) =>
    user.id === targetId ? { ...user, name: "Updated Name" } : user
  )
);

// 刪除項目
setUsers(users.filter((user) => user.id !== targetId));
```

### **物件陣列的操作**

```jsx
const [userList, setUserList] = useState([
  { id: 1, name: "Jeffrey", age: 25 },
  { id: 2, name: "Tony", age: 30 },
]);

// ✅ 新增物件
setUserList([...userList, { id: 3, name: "Kiki", age: 28 }]);

// ✅ 更新物件
setUserList(
  userList.map((user) =>
    user.id === 1
      ? { ...user, age: 26 } // 創建新物件
      : user
  )
);

// ✅ 刪除物件
setUserList(userList.filter((user) => user.id !== 2));
```

## 🔍 調試技巧

```jsx
const handleAddUser = () => {
  console.log("Before:", users);
  console.log("Memory address check:", users === users); // true

  const newUsers = [...users, "Kiki"];
  console.log("After:", newUsers);
  console.log("Same reference?", users === newUsers); // false

  setUsers(newUsers);
};
```

## ⚡ 性能考量

```jsx
// 對於大陣列，展開運算符可能有性能影響
const largeArray = new Array(10000).fill(0);

// 如果經常需要新增，考慮使用 concat
setLargeArray(largeArray.concat(newItem));

// 或者使用 push + slice
const addItem = (arr, item) => {
  const newArr = arr.slice(); // 複製
  newArr.push(item); // 修改複製品
  return newArr;
};
```

---

**核心原則：在 React 中，狀態更新 = 創建新的記憶體空間！** 🎯
