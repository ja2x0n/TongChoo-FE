import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/common/AppLayout'
import { RedirectIfAuthenticated, RequireAuth } from './hooks/useRequireAuth'
import LandingPage from './pages/landing/LandingPage'
import SignupPage from './pages/auth/SignupPage'
import LoginPage from './pages/auth/LoginPage'
import ExcuseFormPage from './pages/excuse/ExcuseFormPage'
import ExcuseResultPage from './pages/excuse/ExcuseResultPage'
import ExcuseHistoryPage from './pages/excuse/ExcuseHistoryPage'
import ExcuseDetailPage from './pages/excuse/ExcuseDetailPage'
import MyPagePage from './pages/mypage/MyPagePage'
import RankPage from './pages/rank/RankPage'

function NotFoundPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-navy-950">페이지를 찾을 수 없습니다</h1>
    </main>
  )
}

// Frontend.md §4 라우팅 테이블 그대로 구성.
// 바깥쪽 <Route element={<AppLayout />}>가 헤더를 공통으로 씌우고,
// 그 안에서 다시 두 그룹으로 나뉜다:
//   - RedirectIfAuthenticated로 감싼 그룹: 로그인 상태면 /signup, /login에 못 들어가고 /create로 튕긴다
//   - RequireAuth로 감싼 그룹: 비로그인 상태면 /login으로 튕긴다 (변명 생성/기록/마이페이지/등급)
// 랜딩("/")은 어느 그룹에도 속하지 않아 로그인 여부와 무관하게 항상 접근 가능하다.
function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />

        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/create" element={<ExcuseFormPage />} />
          <Route path="/excuses/result" element={<ExcuseResultPage />} />
          <Route path="/excuses" element={<ExcuseHistoryPage />} />
          <Route path="/excuses/:excuseId" element={<ExcuseDetailPage />} />
          <Route path="/mypage" element={<MyPagePage />} />
          <Route path="/rank" element={<RankPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
