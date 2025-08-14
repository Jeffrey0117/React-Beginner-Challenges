import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  // 模擬從 API 獲取用戶資料
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      
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
      setLoading(false)
    }
    
    fetchUser()
  }, [])

  const updateUserName = () => {
    user.name = 'Jane Doe'
    setUser({...user})
  }

  const displayUserInfo = () => {
    return (
      <div>
        <h2>用戶資料</h2>
        <p>姓名：{user.name}</p>
        <p>信箱：{user.email}</p>
        <p>年齡：{user.age}</p>
        <button onClick={updateUserName}>
          更新姓名
        </button>
      </div>
    )
  }

  if (loading) {
    return <div>載入中...</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚨 useState 未定義錯誤示例</h1>
      <div style={{ 
        padding: '20px', 
        border: '2px solid #e74c3c', 
        borderRadius: '8px',
        backgroundColor: '#fdf2f2'
      }}>
        {displayUserInfo()}
      </div>
      
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '5px'
      }}>
        <h3>🤔 觀察問題：</h3>
        <ul>
          <li>打開瀏覽器開發者工具查看錯誤訊息</li>
          <li>useState 沒有初始值時，user 的值是什麼？</li>
          <li>為什麼會出現 "Cannot set properties of undefined"？</li>
          <li>如何修復這個問題？</li>
        </ul>
      </div>
    </div>
  )
}

export default App
