import { useState } from 'react'
import './App.css'

// 題目資料
const exercises = [
  {
    id: '01-01',
    title: 'Array.push 用在更新 state，居然不起作用了？',
    description: '點擊按鈕後為什麼畫面沒有變化？',
    difficulty: '基礎',
    status: '已完成',
    category: '狀態管理'
  },
  {
    id: '01-02', 
    title: 'setState 連續呼叫這麼多次，怎麼只作用一次？',
    description: '連續 5 次 setState，為什麼只增加 1？',
    difficulty: '基礎',
    status: '已完成',
    category: '狀態管理'
  },
  {
    id: '01-03',
    title: '簡單的 useState 使用，卻出現了「Cannot set properties of undefined」？',
    description: '使用 useState 時的常見錯誤',
    difficulty: '基礎',
    status: '規劃中',
    category: '狀態管理'
  },
  {
    id: '02-01',
    title: '怪了，我的頁面怎麼越跑越慢啊？記憶體洩漏是什麼鬼？',
    description: 'useEffect 的記憶體洩漏問題',
    difficulty: '中級',
    status: '規劃中',
    category: '副作用'
  }
]

function App() {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedExercise, setSelectedExercise] = useState(null)

  // 獲取分類
  const categories = ['全部', ...new Set(exercises.map(ex => ex.category))]
  
  // 過濾題目
  const filteredExercises = selectedCategory === '全部' 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory)

  const getStatusColor = (status) => {
    switch (status) {
      case '已完成': return '#27ae60'
      case '進行中': return '#f39c12'
      case '規劃中': return '#95a5a6'
      default: return '#95a5a6'
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '基礎': return '#3498db'
      case '中級': return '#e67e22'
      case '高級': return '#e74c3c'
      default: return '#95a5a6'
    }
  }

  if (selectedExercise) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <button 
          onClick={() => setSelectedExercise(null)}
          style={{
            backgroundColor: '#95a5a6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← 回到題目列表
        </button>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          borderLeft: '4px solid #ffc107'
        }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#856404' }}>
            {selectedExercise.id} - {selectedExercise.title}
          </h2>
          <p style={{ margin: '0', color: '#856404' }}>
            📁 請到 <code>exercises/{selectedExercise.id}/</code> 資料夾查看題目詳情
          </p>
          <div style={{ marginTop: '15px' }}>
            <h3 style={{ color: '#856404' }}>操作步驟：</h3>
            <ol style={{ color: '#856404' }}>
              <li>查看 <code>exercises/{selectedExercise.id}/README.md</code> 了解問題</li>
              <li>複製 <code>exercises/{selectedExercise.id}/problem/App.jsx</code> 到 <code>src/App.jsx</code> 測試問題</li>
              <li>嘗試自己解決問題</li>
              <li>查看 <code>exercises/{selectedExercise.id}/solution/README.md</code> 學習解答</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>
          🚀 React 求職訓練營
        </h1>
        <p style={{ color: '#7f8c8d', margin: '0' }}>
          系統性學習 React 面試常見問題與解決方案
        </p>
      </header>

      {/* 分類篩選 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px', color: '#34495e' }}>📂 分類篩選：</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                backgroundColor: selectedCategory === category ? '#3498db' : '#ecf0f1',
                color: selectedCategory === category ? 'white' : '#2c3e50',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 題目列表 */}
      <div style={{ display: 'grid', gap: '15px' }}>
        <h3 style={{ marginBottom: '10px', color: '#34495e' }}>
          📚 題目列表 ({filteredExercises.length} 題)
        </h3>
        
        {filteredExercises.map(exercise => (
          <div
            key={exercise.id}
            onClick={() => setSelectedExercise(exercise)}
            style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #ecf0f1',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <h4 style={{ 
                margin: '0', 
                color: '#2c3e50', 
                fontSize: '16px',
                lineHeight: '1.4'
              }}>
                {exercise.id} - {exercise.title}
              </h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  backgroundColor: getStatusColor(exercise.status),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {exercise.status}
                </span>
                <span style={{
                  backgroundColor: getDifficultyColor(exercise.difficulty),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {exercise.difficulty}
                </span>
              </div>
            </div>
            <p style={{ 
              margin: '0', 
              color: '#7f8c8d', 
              fontSize: '14px',
              lineHeight: '1.4'
            }}>
              {exercise.description}
            </p>
            <div style={{ 
              marginTop: '10px', 
              fontSize: '12px', 
              color: '#95a5a6' 
            }}>
              📂 exercises/{exercise.id}/
            </div>
          </div>
        ))}
      </div>

      <footer style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#ecf0f1', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0', color: '#7f8c8d', fontSize: '14px' }}>
          💡 <strong>使用說明：</strong> 點擊題目卡片查看詳細資訊和操作步驟
        </p>
      </footer>
    </div>
  )
}

export default App
