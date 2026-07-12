// 모든 라우트의 공통 뼈대. App.jsx의 최상위 <Route element={<AppLayout />}>로 사용되어
// 어떤 화면으로 이동하든 AppHeader가 항상 보이도록 하고, 실제 페이지는 <Outlet />에 렌더링된다.
import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-surface-soft">
      <AppHeader />
      <Outlet />
    </div>
  )
}
