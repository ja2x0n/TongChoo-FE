// 라우트 가드 모음. Frontend.md §4.
// App.jsx에서 <Route element={<RequireAuth />}> / <Route element={<RedirectIfAuthenticated />}>로
// 감싸는 용도로만 쓰인다 (각 라우트 컴포넌트 안에서 개별적으로 인증 체크를 반복하지 않기 위함).
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

// Frontend.md §4: 인증 필요 라우트 가드. 토큰이 없으면 /login으로 리다이렉트한다.
export function RequireAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

// Frontend.md §4: /signup, /login은 이미 로그인된 상태로 접근하면 /create로 리다이렉트한다.
export function RedirectIfAuthenticated() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/create" replace />
  }

  return <Outlet />
}
