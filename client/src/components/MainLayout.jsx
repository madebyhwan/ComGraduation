import React, { useState } from 'react'; // (isSidebarOpen을 위해 useState는 여전히 필요)
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User, Menu, X, LogOut, MessageSquare } from 'lucide-react';
import { decodeJWT } from '../api/utils.js';

// (토큰에서 사용자 이름을 가져오는 헬퍼 함수 - 동일)
const getUsernameFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const decoded = decodeJWT(token);
        return decoded?.username || '사용자';
    }
    return '사용자';
};


const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // --- (수정!) ---
    // "setUsername"을 제거하고 [username]만 받도록 수정
    const [username, setUsername] = useState(() => getUsernameFromToken());

    // [추가] 토큰 변경 감지 (로그인/로그아웃 시 동기화) 또는 직접 호출용 함수
    const updateUsername = (newName) => {
        if (newName) {
             setUsername(newName);
        } else {
             // 인자가 없으면 토큰에서 다시 읽어옴
             setUsername(getUsernameFromToken());
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* 모바일 오버레이 */}
            <div
                className={`mobile-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* 사이드바 */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0`}
            >
                <div className="flex items-center justify-between p-6">
                    <h1 className="text-2xl font-bold text-knu-blue">ComGraduation</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-gray-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 flex flex-col gap-2 px-4">                           
                    <SidebarLink label="나의 정보" to="/app/profile" icon={<User size={20} />} />
                    <SidebarLink label="나의 수강과목" to="/app/courses" icon={<BookOpen size={20} />} />
                    <SidebarLink label="자가진단" to="/app" icon={<LayoutDashboard size={20} />} />
                    <SidebarLink label="커뮤니티" to="/app/community" icon={<MessageSquare size={20} />} />
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    >
                        <LogOut size={20} />
                        <span>로그아웃</span>
                    </button>
                </div>
            </aside>

            {/* 메인 컨텐츠 영역 */}
            <div className="flex-1 flex flex-col lg:pl-64">
                {/* 헤더 */}
                <header className="sticky top-0 z-10 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <button
                        className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1 lg:flex-none"></div>

                    <div className="flex items-center gap-4">

                        <div className="flex items-center gap-2">
                            <span className="hidden sm:block font-semibold text-gray-700">{username} 님</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <Outlet context={{ updateUsername }} />
                </main>
            </div>
        </div>
    );
};

// 사이드바 링크 아이템 (NavLink 사용)
const SidebarLink = ({ label, icon, to }) => {
    return (
        <NavLink
            to={to}
            end={to === "/app"} // '/app' 경로는 정확히 일치할 때만 active
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors
                ${isActive
                    ? 'bg-knu-blue-light text-knu-blue'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
            }
        >
            {icon}
            <span>{label}</span>
        </NavLink>
    );
};

export default MainLayout;