import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. 페이지 컴포넌트들
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Main from './pages/Main.jsx';
import CoursesPage from './pages/Courses.jsx';
import ProfilePage from './pages/Profile.jsx';

// 2. 레이아웃 및 보호 라우트
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './components/MainLayout.jsx';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === 1. 로그인 전 공개 라우트 === */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* === 2. 로그인 후 보호 라우트 === */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Main />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>

        {/* === 3. 그 외 모든 경로는 루트(/)로 리다이렉트 === */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;