import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // ✅ 解決方案1：使用函數式更新
  const handleFunctionalUpdates = () => {
    console.log('使用函數式更新 - 點擊前 count:', count)
    
    setCount(prevCount => {
      console.log('第1次更新，prevCount:', prevCount)
      return prevCount + 1
    })
    setCount(prevCount => {
      console.log('第2次更新，prevCount:', prevCount)
      return prevCount + 1
    })
    setCount(prevCount => {
      console.log('第3次更新，prevCount:', prevCount)
      return prevCount + 1
    })
    setCount(prevCount => {
      console.log('第4次更新，prevCount:', prevCount)
      return prevCount + 1
    })
    setCount(prevCount => {
      console.log('第5次更新，prevCount:', prevCount)
      return prevCount + 1
    })
    
    console.log('函數式更新 - 點擊後 count:', count)  // 還是舊值，但組件會重新渲染
  }

  // ✅ 解決方案2：一次性計算（最佳解法）
  const handleDirectUpdate = () => {
    console.log('一次性更新 - 點擊前 count:', count)
    setCount(count + 5)  // 直接加5
    console.log('一次性更新 - 點擊後 count:', count)  // 還是舊值，但組件會重新渲染
  }

  // ❌ 錯誤示範：展示問題
  const handleProblematicUpdates = () => {
    console.log('❌ 問題版本 - 點擊前 count:', count)
    
    setCount(count + 1)  // count = 舊值, 設定為 舊值+1
    setCount(count + 1)  // count = 舊值, 設定為 舊值+1 (覆蓋前一個)
    setCount(count + 1)  // count = 舊值, 設定為 舊值+1 (覆蓋前一個)
    setCount(count + 1)  // count = 舊值, 設定為 舊值+1 (覆蓋前一個)
    setCount(count + 1)  // count = 舊值, 設定為 舊值+1 (覆蓋前一個)
    
    console.log('❌ 問題版本 - 點擊後 count:', count)
  }

  const resetCounter = () => {
    setCount(0)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>計數器 - 解答版本</h1>
      
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

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={handleFunctionalUpdates}
          style={{
            backgroundColor: '#27ae60',
            color: 'white',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ✅ 函數式更新 +5
        </button>

        <button 
          onClick={handleDirectUpdate}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ✅ 一次性更新 +5
        </button>

        <button 
          onClick={handleProblematicUpdates}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ❌ 問題示範 +5
        </button>

        <button 
          onClick={resetCounter}
          style={{
            backgroundColor: '#95a5a6',
            color: 'white',
            padding: '12px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          重置
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <div style={{ 
          marginBottom: '10px',
          padding: '15px', 
          backgroundColor: '#d4edda', 
          borderRadius: '4px',
          borderLeft: '4px solid #28a745'
        }}>
          <p style={{ margin: '0', color: '#155724' }}>
            ✅ <strong>解決方案：</strong><br/>
            <strong>方法1：</strong> 使用函數式更新 <code>setCount(prev => prev + 1)</code><br/>
            <strong>方法2：</strong> 一次性計算 <code>setCount(count + 5)</code>
          </p>
        </div>

        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8d7da', 
          borderRadius: '4px',
          borderLeft: '4px solid #dc3545'
        }}>
          <p style={{ margin: '0', color: '#721c24' }}>
            ❌ <strong>問題原因：</strong><br/>
            每次 <code>setCount(count + 1)</code> 中的 <code>count</code> 都是當前渲染時的值（閉包）<br/>
            React 的批次更新會讓最後一個 setState 覆蓋前面的
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
