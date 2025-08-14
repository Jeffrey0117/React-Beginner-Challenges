import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 🚨 問題：沒有給 useState 初始值
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

  // 🚨 問題：嘗試直接修改 undefined 的屬性
  const updateUserName = () => {
    // 這裡會拋出錯誤：Cannot set properties of undefined (setting 'name')
    user.name = 'Jane Doe'
    setUser({...user})
  }

  // 🚨 問題：在 user 是 undefined 時嘗試存取屬性
  const displayUserInfo = () => {
    return (
      <div>
        <h2>用戶資料</h2>
        <p>姓名：{user.name}</p>  {/* 會出錯 */}
        <p>信箱：{user.email}</p> {/* 會出錯 */}
        <p>年齡：{user.age}</p>   {/* 會出錯 */}
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
