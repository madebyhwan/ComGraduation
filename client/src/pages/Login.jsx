import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/api.js'; // 4단계에서 수정한 api.js

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login({ studentId, password });
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        navigate('/app');
      } else {
        setError('학번 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    // Tailwind 스타일 적용
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-center text-3xl font-bold text-knu-blue">
          ComGraduation
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="studentId">
              ID
            </label>
            <input
              className="form-input"
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              비밀번호
            </label>
            <input
              className="form-input"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <button className="w-full justify-center rounded-md bg-knu-blue py-2 px-4 font-medium text-white shadow-sm hover:bg-opacity-80" type="submit">
            로그인
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          <p>
            계정이 없으신가요? <Link to="/signup" className="font-medium text-knu-blue hover:underline"> 회원가입 </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;