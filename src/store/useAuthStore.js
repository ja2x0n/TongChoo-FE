// 로그인 상태 전역 관리 (zustand). Frontend.md §3.3, §5.3.
// Context API 대신 zustand를 사용해서 Provider로 감쌀 필요 없이 어디서든 useAuthStore()로
// 로그인 여부/닉네임을 읽거나 login/logout/updateNickname을 호출할 수 있다.
import { create } from 'zustand'

// 새로고침 직후 스토어 초기값으로 쓰인다. localStorage에 토큰이 있어도
// expiresAt이 지난 "만료된 토큰"이면 로그인 안 된 것으로 취급해 선제적으로 로그아웃 처리한다
// (Frontend.md §3.3 "만료된 토큰이면 API 호출 전에 선제적으로 로그아웃 처리").
function readStoredAuth() {
  const accessToken = localStorage.getItem('accessToken')
  const nickname = localStorage.getItem('nickname')
  const expiresAt = localStorage.getItem('expiresAt')

  if (!accessToken || !expiresAt || Date.now() >= Number(expiresAt)) {
    return null
  }

  return { nickname }
}

export const useAuthStore = create((set) => {
  const stored = readStoredAuth()

  return {
    isAuthenticated: stored !== null,
    nickname: stored?.nickname ?? null,

    // 로그인/회원가입 응답(accessToken/tokenType/expiresIn/nickname)을 저장
    login: ({ accessToken, tokenType, expiresIn, nickname }) => {
      const expiresAt = Date.now() + expiresIn

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('tokenType', tokenType)
      localStorage.setItem('nickname', nickname)
      localStorage.setItem('expiresAt', String(expiresAt))

      set({ isAuthenticated: true, nickname })
    },

    // Frontend.md §3.3: 별도 로그아웃 API 없이 localStorage만 비운다
    logout: () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('tokenType')
      localStorage.removeItem('nickname')
      localStorage.removeItem('expiresAt')

      set({ isAuthenticated: false, nickname: null })
    },

    // 마이페이지 닉네임 수정 성공 시 호출
    updateNickname: (nickname) => {
      localStorage.setItem('nickname', nickname)
      set({ nickname })
    },
  }
})
