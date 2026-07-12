// 공통 헤더. Frontend.md §3.4 AppHeader.
// 모든 화면(랜딩 포함)에서 AppLayout을 통해 재사용되며, 로그인 여부에 따라 우측 영역만 바뀐다.
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import logo from "../../assets/변기_logo.png";

// Frontend.md §3.4 AppHeader: 로그인 여부와 무관하게 4개 메뉴를 노출하고,
// 우측 영역만 로그인 상태에 따라 로그인/회원가입 ↔ 닉네임+로그아웃으로 바뀐다.
const NAV_ITEMS = [
    { to: "/create", label: "변명 만들기" },
    { to: "/excuses", label: "내 기록" },
    { to: "/mypage", label: "마이페이지" },
    { to: "/rank", label: "등급" },
];

// react-router-dom의 NavLink는 className에 { isActive } 콜백을 넘겨줄 수 있다.
// 현재 경로와 일치하는 메뉴만 브랜드 컬러로 강조하고, 나머지는 hover 시에만 색이 바뀐다.
function navLinkClassName({ isActive }) {
    return isActive
        ? "text-brand-primary transition-colors"
        : "hover:text-brand-primary transition-colors";
}

export default function AppHeader() {
    const { isAuthenticated, nickname, logout } = useAuthStore();
    const navigate = useNavigate();

    // 로그아웃은 별도 API가 없으므로(서버가 Stateless) localStorage만 비우고 랜딩으로 이동시킨다
    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border-soft bg-white/95 backdrop-blur-sm">
            <div className="max-w-[1500px] mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-6 px-7 sm:px-10 lg:px-14 py-5 md:py-6">
                <Link
                    to="/"
                    className="flex items-center gap-3 shrink-0 justify-self-start"
                    aria-label="변기 홈으로 이동"
                >
                    <img
                        src={logo}
                        alt="변기 로고"
                        className="w-12 h-12 object-contain"
                    />
                    <span className="text-2xl font-bold tracking-tight text-navy-950">
                        변기
                    </span>
                </Link>

                <nav
                    className="hidden md:flex items-center justify-center gap-10 text-base font-bold text-navy-700"
                    aria-label="서비스 메뉴"
                >
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={navLinkClassName}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {isAuthenticated ? (
                    <div className="flex items-center gap-2 sm:gap-3 justify-self-end">
                        <span className="hidden sm:inline text-sm font-medium text-navy-500">
                            {nickname}님
                        </span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="px-5 py-2.5 text-base font-medium text-navy-950 border border-border-input rounded-md hover:bg-brand-primary-soft transition-colors"
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <nav
                        className="flex items-center gap-2 sm:gap-3 justify-self-end"
                        aria-label="회원 메뉴"
                    >
                        <Link
                            to="/login"
                            className="px-5 py-2.5 text-base font-normal text-navy-950 hover:bg-brand-primary-soft rounded-md transition-colors"
                        >
                            로그인
                        </Link>
                        <Link
                            to="/signup"
                            className="px-5 py-2.5 text-base font-bold text-white bg-brand-primary rounded-md shadow-[0_3px_8px_rgba(21,126,251,0.18)] hover:bg-brand-primary-hover hover:shadow-[0_4px_10px_rgba(21,126,251,0.22)] transition-all"
                        >
                            회원가입
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
