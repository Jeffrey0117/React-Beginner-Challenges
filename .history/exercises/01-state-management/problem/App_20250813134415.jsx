import { useState } from 'react'
import './App.css'

function App() {
  // 初始使用者列表
  const [users, setUsers] = useState(['Jeffrey', 'Tony', 'Amy'])

  // TODO: 實作新增 Kiki 的功能 (練習用)
  const handleAddKiki = () => {
    console.log('按鈕被點擊了！準備新增 Kiki...')
    // ❌ 錯誤寫法 - 為什麼點擊後畫面沒變化？
    users.push('Kiki')
    setUsers(users)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>使用者列表 - 問題版本</h1>
      
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

      <button 
        onClick={handleAddKiki}
        style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        新增 Kiki (有問題的版本)
      </button>
      
      <p style={{ marginTop: '15px', color: '#666' }}>
        🤔 點擊按鈕後為什麼畫面沒有變化？
      </p>
    </div>
  )
}

export default App
