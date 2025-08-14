import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // ✅ 解決方案 1：提供適當的初始值
  const [user, setUser] = useState(null) // 或者使用 {} 空物件
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 模擬從 API 獲取用戶資料
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 模擬 API 回應
        const userData = {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          age: 30
        }
        
        setUser(userData)
      } catch (err) {
        setError('載入用戶資料失敗')
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
  }, [])

  // ✅ 解決方案 2：正確更新物件狀態
  const updateUserName = () => {
    if (user) { // 先檢查 user 是否存在
      setUser({
        ...user,
        name: 'Jane Doe'
      })
    }
  }

  // ✅ 解決方案 3：條件渲染，處理載入和錯誤狀態
  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontSize: '18px'
      }}>
        <div>⏳ 載入中...</div>
        <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          正在獲取用戶資料
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#e74c3c'
      }}>
        ❌ {error}
      </div>
    )
  }

  // ✅ 解決方案 4：防禦性渲染
  if (!user) {
    return (
      <div style={{ padding: '20px' }}>
        ⚠️ 沒有用戶資料
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>✅ useState 正確使用示例</h1>
      
      <div style={{ 
        padding: '20px', 
        border: '2px solid #27ae60', 
        borderRadius: '8px',
        backgroundColor: '#f8fff8'
      }}>
        <h2>用戶資料</h2>
        <p><strong>姓名：</strong>{user.name}</p>
        <p><strong>信箱：</strong>{user.email}</p>
        <p><strong>年齡：</strong>{user.age}</p>
        <button 
          onClick={updateUserName}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          更新姓名
        </button>
      </div>

      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e8f5e8',
        borderRadius: '5px'
      }}>
        <h3>✨ 解決方案重點：</h3>
        <ul>
          <li><strong>初始值設定：</strong>useState(null) 而不是 useState()</li>
          <li><strong>條件渲染：</strong>載入中、錯誤、無資料的處理</li>
          <li><strong>防禦性編程：</strong>在存取物件屬性前先檢查存在性</li>
          <li><strong>正確更新：</strong>使用展開運算子而不是直接修改</li>
          <li><strong>用戶體驗：</strong>提供清楚的載入和錯誤狀態</li>
        </ul>
      </div>
      
      <div style={{ 
        marginTop: '15px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '5px'
      }}>
        <h3>🎯 其他初始值選擇：</h3>
        <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '3px' }}>
{`// 選擇 1：null（推薦）
const [user, setUser] = useState(null)

// 選擇 2：空物件
const [user, setUser] = useState({})

// 選擇 3：預設結構
const [user, setUser] = useState({
  name: '',
  email: '',
  age: 0
})`}
        </pre>
      </div>
    </div>
  )
}

export default App
