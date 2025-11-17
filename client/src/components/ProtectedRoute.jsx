import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../api/utils.js'; // utils.js의 함수 사용

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // isTokenExpired 함수는 토큰이 없거나(null),
  // 형식이 잘못되었거나, 만료되었으면 true를 반환합니다.
  if (isTokenExpired(token)) {
    if (token) {
      localStorage.removeItem('token'); // 만료되었으니 확실하게 제거
    }
    return <Navigate to="/" replace />; // 로그인 페이지로 리다이렉트
  }

  // 토큰이 유효한 경우
  return children;
};

export default ProtectedRoute;