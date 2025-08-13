import { useState } from 'react'
import './App.css'

function App() {
  // 初始使用者列表
  const [users, setUsers] = useState(['Jeffrey', 'Tony', 'Amy'])

  // ✅ 正確寫法 - 解決方案
  const handleAddKiki = () => {
    console.log('按鈕被點擊了！新增 Kiki...')
    // 方法1: 使用展開運算符創建新陣列
    setUsers([...users, 'Kiki'])
  }

  // ✅ 另一種寫法
  const handleAddKiki2 = () => {
    // 方法2: 使用 concat 創建新陣列
    setUsers(users.concat('Kiki'))
  }

  // ✅ 防止重複新增的版本
  const handleAddKiki3 = () => {
    if (!users.includes('Kiki')) {
      setUsers([...users, 'Kiki'])
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>使用者列表 - 解答版本</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>所有使用者：</h2>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '15px'
        }}>
          {users.map((user, index) => (
            <li key={index} style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              👤 {user}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleAddKiki}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          方法1: 展開運算符
        </button>

        <button 
          onClick={handleAddKiki2}
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          方法2: concat
        </button>

        <button 
          onClick={handleAddKiki3}
          style={{
            backgroundColor: '#FF9800',
            color: 'white',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          方法3: 防重複
        </button>
      </div>
      
      <p style={{ marginTop: '15px', color: '#666' }}>
        ✅ 現在按鈕都能正常工作了！
      </p>
    </div>
  )
}

export default App
