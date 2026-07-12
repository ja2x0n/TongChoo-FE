import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// zustand 스토어(useAuthStore)는 Context API와 달리 Provider가 필요 없어서
// BrowserRouter만 최상단에 두면 된다 — App 내부 어디서든 useAuthStore()로 바로 접근 가능하다.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
