import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // ❌ 問題版本 - 連續呼叫多次 setState
  const handleMultipleUpdates = () => {
    console.log('點擊前 count:', count)
    
    setCount(count + 1)  
    setCount(count + 1)   
    setCount(count + 1)   
    setCount(count + 1)   
    setCount(count + 1)   
    
    console.log('預期應該是 5，但實際上只會變成 1')
  }

  const resetCounter = () => {
    setCount(0)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>計數器 - 問題版本</h1>
      
      <div style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#333', fontSize: '48px', margin: '0' }}>
          {count}
        </h2>
        <p style={{ color: '#666', margin: '10px 0' }}>
          目前計數
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={handleMultipleUpdates}
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
          點擊 +5 (有問題的版本)
        </button>

        <button 
          onClick={resetCounter}
          style={{
            backgroundColor: '#95a5a6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          重置
        </button>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        borderRadius: '4px',
        borderLeft: '4px solid #ffc107'
      }}>
        <p style={{ margin: '0', color: '#856404' }}>
          🤔 <strong>問題：</strong> 為什麼點擊 "+5" 按鈕後，計數只增加了 1 而不是 5？<br/>
          💡 <strong>提示：</strong> 打開開發者工具查看 console 的輸出！
        </p>
      </div>
    </div>
  )
}

export default App
